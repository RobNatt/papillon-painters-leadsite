/**
 * In-browser wall recoloring. No upload, no server, no ML model.
 *
 * 1. The photo is drawn to a canvas (longest side ≤ MAX_SIDE) and every
 *    pixel is converted once to CIE Lab plus linear luminance.
 * 2. A tap flood-fills outward from the tapped point while pixels stay close
 *    to the seed color (lightness weighted low, so shadows on a wall still
 *    count as "the wall") and stops at strong edges (Sobel on L), which is
 *    where walls meet trim, ceilings and furniture.
 * 3. Rendering swaps each wall pixel's color for the paint color scaled by
 *    the pixel's original brightness relative to the wall's median, so
 *    shading, light falloff and texture survive the color change.
 */

export const MAX_SIDE = 1280;

type Region = { rgb: [number, number, number]; refLum: number; hex: string };

const SRGB_TO_LIN = new Float32Array(256);
for (let i = 0; i < 256; i++) {
  const c = i / 255;
  SRGB_TO_LIN[i] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
const linToSrgb8 = (v: number) => {
  const c = v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  return Math.max(0, Math.min(255, Math.round(c * 255)));
};

export function hexToLin(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [SRGB_TO_LIN[(n >> 16) & 255], SRGB_TO_LIN[(n >> 8) & 255], SRGB_TO_LIN[n & 255]];
}

const fLab = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);

export class Recolor {
  readonly w: number;
  readonly h: number;
  private src: Uint8ClampedArray;
  private L: Float32Array;
  private A: Float32Array;
  private B: Float32Array;
  private Y: Float32Array;
  private edge: Float32Array;
  /** Region id per pixel (0 = untouched). */
  private owner: Uint8Array;
  /** Blend alpha per pixel, 0–255 (soft 1px edge). */
  private alpha: Uint8Array;
  private regions: (Region | null)[] = [null];
  private out: ImageData;
  readonly original: HTMLCanvasElement;

  constructor(source: CanvasImageSource & { width: number; height: number }) {
    const scale = Math.min(1, MAX_SIDE / Math.max(source.width, source.height));
    this.w = Math.max(1, Math.round(source.width * scale));
    this.h = Math.max(1, Math.round(source.height * scale));

    this.original = document.createElement("canvas");
    this.original.width = this.w;
    this.original.height = this.h;
    const octx = this.original.getContext("2d", { willReadFrequently: true })!;
    octx.drawImage(source, 0, 0, this.w, this.h);
    const img = octx.getImageData(0, 0, this.w, this.h);
    this.src = img.data;
    this.out = new ImageData(new Uint8ClampedArray(img.data), this.w, this.h);

    const n = this.w * this.h;
    this.L = new Float32Array(n);
    this.A = new Float32Array(n);
    this.B = new Float32Array(n);
    this.Y = new Float32Array(n);
    this.edge = new Float32Array(n);
    this.owner = new Uint8Array(n);
    this.alpha = new Uint8Array(n);

    for (let p = 0, i = 0; p < n; p++, i += 4) {
      const r = SRGB_TO_LIN[this.src[i]];
      const g = SRGB_TO_LIN[this.src[i + 1]];
      const b = SRGB_TO_LIN[this.src[i + 2]];
      const X = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047;
      const Yv = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const Z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883;
      const fx = fLab(X);
      const fy = fLab(Yv);
      const fz = fLab(Z);
      this.L[p] = 116 * fy - 16;
      this.A[p] = 500 * (fx - fy);
      this.B[p] = 200 * (fy - fz);
      this.Y[p] = Yv;
    }
    // Sobel magnitude on lightness. Border pixels have no full neighborhood, so
    // they count as edges; otherwise a fill could run along the frame edge and
    // slip into the ceiling or floor. The 1px fringe still covers them visually.
    const { w, h, L } = this;
    this.edge.fill(1e6);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const p = y * w + x;
        const gx = L[p - w + 1] + 2 * L[p + 1] + L[p + w + 1] - L[p - w - 1] - 2 * L[p - 1] - L[p + w - 1];
        const gy = L[p + w - 1] + 2 * L[p + w] + L[p + w + 1] - L[p - w - 1] - 2 * L[p - w] - L[p - w + 1];
        this.edge[p] = Math.sqrt(gx * gx + gy * gy) / 4;
      }
    }
  }

  get regionCount() {
    return this.regions.filter(Boolean).length;
  }

  /** Region already painted at (x, y), if any. */
  regionAt(x: number, y: number): number {
    const p = Math.floor(y) * this.w + Math.floor(x);
    return this.alpha[p] > 200 ? this.owner[p] : 0;
  }

  /**
   * Flood-fill from (x, y). `tolerance` 4–40 (default ~16).
   * Returns the new region id, or 0 if the area was too small to be a surface.
   */
  fill(x: number, y: number, hex: string, tolerance = 16): number {
    if (this.regions.length >= 255) return 0;
    const { w, h, L, A, B, edge, owner, alpha } = this;
    const sx = Math.max(0, Math.min(w - 1, Math.floor(x)));
    const sy = Math.max(0, Math.min(h - 1, Math.floor(y)));

    // Seed = mean of a 5×5 patch, to ignore single-pixel noise.
    let sl = 0, sa = 0, sb = 0, cnt = 0;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const xx = sx + dx, yy = sy + dy;
        if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
        const p = yy * w + xx;
        sl += L[p]; sa += A[p]; sb += B[p]; cnt++;
      }
    }
    sl /= cnt; sa /= cnt; sb /= cnt;

    const tol2 = tolerance * tolerance;
    // Gradual shading changes lightness by well under 1 L/px; a wall meeting
    // trim or a ceiling is a step of 8+ L within a pixel or two.
    const edgeMax = 2.5 + tolerance * 0.25;
    const maxDl = 26 + tolerance;
    const id = this.regions.length;
    const visited = new Uint8Array(w * h);
    const stack = new Int32Array(w * h);
    let top = 0;
    const accept = (p: number) => {
      if (visited[p]) return false;
      visited[p] = 1;
      if (alpha[p] > 200 && owner[p] !== 0) return false; // don't eat another painted wall
      if (edge[p] > edgeMax) return false;
      const rawDl = L[p] - sl;
      if (rawDl > maxDl || rawDl < -maxDl) return false;
      const dl = rawDl * 0.35;
      const da = A[p] - sa;
      const db = B[p] - sb;
      return dl * dl + da * da + db * db <= tol2;
    };

    // The tapped pixel always seeds the fill, even if it sits on a little noise.
    const start = sy * w + sx;
    visited[start] = 1;
    stack[top++] = start;
    const filled: number[] = [];
    while (top > 0) {
      const p = stack[--top];
      filled.push(p);
      const px = p % w;
      if (px > 0 && accept(p - 1)) stack[top++] = p - 1;
      if (px < w - 1 && accept(p + 1)) stack[top++] = p + 1;
      if (p >= w && accept(p - w)) stack[top++] = p - w;
      if (p < w * (h - 1) && accept(p + w)) stack[top++] = p + w;
    }

    // Ignore taps on tiny areas (a picture frame edge, a light switch).
    if (filled.length < (w * h) / 2500) return 0;

    const lums = new Float32Array(filled.length);
    for (let i = 0; i < filled.length; i++) {
      const p = filled[i];
      owner[p] = id;
      alpha[p] = 255;
      lums[i] = this.Y[p];
    }
    // Soft 1px fringe so edges don't look cut out.
    for (const p of filled) {
      const px = p % w;
      const ns = [px > 0 ? p - 1 : -1, px < w - 1 ? p + 1 : -1, p - w, p + w];
      for (const q of ns) {
        if (q < 0 || q >= w * h || alpha[q] > 0) continue;
        owner[q] = id;
        alpha[q] = 120;
      }
    }
    lums.sort();
    const refLum = Math.max(0.02, lums[Math.floor(lums.length / 2)]);
    this.regions.push({ rgb: hexToLin(hex), refLum, hex });
    return id;
  }

  setColor(id: number, hex: string) {
    const r = this.regions[id];
    if (r) {
      r.rgb = hexToLin(hex);
      r.hex = hex;
    }
  }

  colorOf(id: number) {
    return this.regions[id]?.hex;
  }

  /** Remove the most recent region. Returns the id that is now last (or 0). */
  undo(): number {
    for (let id = this.regions.length - 1; id > 0; id--) {
      if (!this.regions[id]) continue;
      this.regions[id] = null;
      for (let p = 0; p < this.owner.length; p++) {
        if (this.owner[p] === id) {
          this.owner[p] = 0;
          this.alpha[p] = 0;
        }
      }
      this.regions.length = id;
      break;
    }
    for (let id = this.regions.length - 1; id > 0; id--) if (this.regions[id]) return id;
    return 0;
  }

  reset() {
    this.owner.fill(0);
    this.alpha.fill(0);
    this.regions = [null];
  }

  /** Paint the recolored image into `ctx`; `split` 0–1 shows the original left of that point. */
  render(ctx: CanvasRenderingContext2D, split = 0) {
    const { src, owner, alpha, Y, regions } = this;
    const d = this.out.data;
    for (let p = 0, i = 0; p < owner.length; p++, i += 4) {
      const id = owner[p];
      if (id === 0 || !regions[id]) {
        d[i] = src[i];
        d[i + 1] = src[i + 1];
        d[i + 2] = src[i + 2];
        continue;
      }
      const reg = regions[id]!;
      // Keep the wall's light and shadow: scale the paint by relative brightness.
      const k = Math.min(1.8, Math.pow(Y[p] / reg.refLum, 0.92));
      const a = alpha[p] / 255;
      const r = linToSrgb8(Math.min(1, reg.rgb[0] * k));
      const g = linToSrgb8(Math.min(1, reg.rgb[1] * k));
      const b = linToSrgb8(Math.min(1, reg.rgb[2] * k));
      d[i] = src[i] + (r - src[i]) * a;
      d[i + 1] = src[i + 1] + (g - src[i + 1]) * a;
      d[i + 2] = src[i + 2] + (b - src[i + 2]) * a;
    }
    ctx.putImageData(this.out, 0, 0);
    if (split > 0) {
      const sw = Math.round(this.w * split);
      ctx.drawImage(this.original, 0, 0, sw, this.h, 0, 0, sw, this.h);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(sw - 1, 0, 2, this.h);
    }
  }

  /** Recolored image as a JPEG for the estimate email. */
  async toBlob(quality = 0.82): Promise<Blob | null> {
    const c = document.createElement("canvas");
    c.width = this.w;
    c.height = this.h;
    this.render(c.getContext("2d")!);
    return new Promise((res) => c.toBlob(res, "image/jpeg", quality));
  }
}

/** Load a File or URL into something drawable, respecting EXIF orientation. */
export async function loadImage(input: File | string): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof input !== "string" && "createImageBitmap" in window) {
    try {
      return await createImageBitmap(input, { imageOrientation: "from-image" });
    } catch {
      /* fall through */
    }
  }
  const url = typeof input === "string" ? input : URL.createObjectURL(input);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    if (!img.width) {
      img.width = img.naturalWidth || 1200;
      img.height = img.naturalHeight || 800;
    }
    return img;
  } finally {
    if (typeof input !== "string") setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

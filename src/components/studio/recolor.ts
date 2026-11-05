/**
 * In-browser wall recoloring. No upload, no server, no ML model.
 *
 * 1. The photo is drawn to a canvas (longest side ≤ MAX_SIDE) and every
 *    pixel is converted once to CIE Lab plus linear luminance.
 * 2. A tap flood-fills outward from the tapped point while pixels stay close
 *    to the seed color (lightness weighted low, so shadows on a wall still
 *    count as "the wall") and stops at strong edges, which is where walls meet
 *    trim, ceilings and furniture. Edges are found on a vertically "closed"
 *    copy of the lightness (a max then a min filter down each column), which
 *    erases horizontal dark lines thinner than ~7px (lap-siding shadows,
 *    horizontal paneling) but keeps real boundaries and vertical creases. So
 *    a tap paints the whole siding wall, not one board.
 * 3. Rendering swaps each wall pixel's color for the paint color scaled by
 *    the pixel's original brightness relative to the wall's median, so
 *    shading, light falloff and texture survive the color change.
 * 4. A brush and an eraser touch up the selection by hand. Every fill and
 *    every brush stroke is one undo step.
 */

export const MAX_SIDE = 1600;
/** Dark lines thinner than 2·LINE_R+1 px are ignored as edges. */
const LINE_R = 3;

/** Sliding max (or min) over ±r along rows (step 1) or columns (step w). */
function slide(src: Float32Array, dst: Float32Array, w: number, h: number, r: number, vertical: boolean, max: boolean) {
  const lines = vertical ? w : h;
  const len = vertical ? h : w;
  const stride = vertical ? w : 1;
  const jump = vertical ? 1 : w;
  for (let l = 0; l < lines; l++) {
    const base = l * jump;
    for (let i = 0; i < len; i++) {
      let v = src[base + i * stride];
      const a = Math.max(0, i - r);
      const b = Math.min(len - 1, i + r);
      for (let k = a; k <= b; k++) {
        const x = src[base + k * stride];
        if (max ? x > v : x < v) v = x;
      }
      dst[base + i * stride] = v;
    }
  }
}
const MAX_HISTORY = 40;

type Region = { rgb: [number, number, number]; refLum: number; hex: string };
/** One undo step: the pixels it changed and what they were before. */
type Op = { idx: Int32Array; prevOwner: Uint8Array; prevAlpha: Uint8Array; createdRegion: number };
type Stroke = {
  mode: "paint" | "erase";
  id: number;
  createdRegion: number;
  touched: Uint8Array;
  idx: number[];
  prevOwner: number[];
  prevAlpha: number[];
};

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
  private history: Op[] = [];
  private stroke: Stroke | null = null;
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
    // Vertical closing (max then min down each column) removes thin
    // horizontal dark lines (lap siding, horizontal paneling) but keeps steps
    // and every vertical crease (door frames, corners, casing).
    const { w, h } = this;
    const tmp = new Float32Array(n);
    const L = new Float32Array(n);
    slide(this.L, tmp, w, h, LINE_R, true, true);
    slide(tmp, L, w, h, LINE_R, true, false);
    // Sobel magnitude on the closed lightness. Border pixels have no full
    // neighborhood, so they count as edges; otherwise a fill could run along
    // the frame edge and slip into the ceiling or floor.
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

  get canUndo() {
    return this.history.length > 0;
  }

  /** Most recent region still in use (0 if none). */
  get lastRegion(): number {
    for (let id = this.regions.length - 1; id > 0; id--) if (this.regions[id]) return id;
    return 0;
  }

  private pushOp(idx: number[], prevOwner: number[], prevAlpha: number[], createdRegion: number) {
    this.history.push({
      idx: Int32Array.from(idx),
      prevOwner: Uint8Array.from(prevOwner),
      prevAlpha: Uint8Array.from(prevAlpha),
      createdRegion,
    });
    if (this.history.length > MAX_HISTORY) this.history.shift();
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
    // Lighter than the seed: likely a different surface (white trim, doors,
    // ceiling, a cream sofa), so keep this tight. Darker: often just shadow on
    // the same surface (lap lines, corners, falloff), so allow more.
    const maxLighter = 10 + tolerance * 0.6;
    const maxDarker = 26 + tolerance;
    const id = this.regions.length;
    const visited = new Uint8Array(w * h);
    const stack = new Int32Array(w * h);
    let top = 0;
    const sameColor = (p: number) => {
      if (alpha[p] > 200 && owner[p] !== 0) return false; // don't eat another painted wall
      const rawDl = L[p] - sl;
      if (rawDl > maxLighter || rawDl < -maxDarker) return false;
      const dl = rawDl * 0.35;
      const da = A[p] - sa;
      const db = B[p] - sb;
      return dl * dl + da * da + db * db <= tol2;
    };
    const accept = (p: number) => {
      if (visited[p]) return false;
      visited[p] = 1;
      if (edge[p] > edgeMax) return false;
      return sameColor(p);
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

    const changed: number[] = [];
    const prevO: number[] = [];
    const prevA: number[] = [];
    const lums = new Float32Array(filled.length);
    for (let i = 0; i < filled.length; i++) {
      const p = filled[i];
      changed.push(p);
      prevO.push(owner[p]);
      prevA.push(alpha[p]);
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
        changed.push(q);
        prevO.push(owner[q]);
        prevA.push(alpha[q]);
        owner[q] = id;
        alpha[q] = 120;
      }
    }
    lums.sort();
    const refLum = Math.max(0.02, lums[Math.floor(lums.length / 2)]);
    this.regions.push({ rgb: hexToLin(hex), refLum, hex });
    this.pushOp(changed, prevO, prevA, id);
    return id;
  }

  /**
   * Start a brush stroke. "paint" adds to region `id` (or a new region in
   * `hex` when id is 0); "erase" removes paint. Returns the region painted.
   */
  beginStroke(mode: "paint" | "erase", id: number, hex: string): number {
    let createdRegion = 0;
    if (mode === "paint" && (!id || !this.regions[id])) {
      if (this.regions.length >= 255) return 0;
      id = this.regions.length;
      this.regions.push({ rgb: hexToLin(hex), refLum: 0, hex });
      createdRegion = id;
    }
    this.stroke = { mode, id, createdRegion, touched: new Uint8Array(this.w * this.h), idx: [], prevOwner: [], prevAlpha: [] };
    return id;
  }

  /** Stamp the brush at (x, y) in image pixels, with radius `r`. */
  brush(x: number, y: number, r: number) {
    const st = this.stroke;
    if (!st) return;
    const { w, h, owner, alpha } = this;
    const x0 = Math.max(0, Math.floor(x - r));
    const x1 = Math.min(w - 1, Math.ceil(x + r));
    const y0 = Math.max(0, Math.floor(y - r));
    const y1 = Math.min(h - 1, Math.ceil(y + r));
    const soft = Math.max(1, r * 0.25);
    for (let yy = y0; yy <= y1; yy++) {
      for (let xx = x0; xx <= x1; xx++) {
        const d = Math.hypot(xx - x, yy - y);
        if (d > r) continue;
        const p = yy * w + xx;
        if (!st.touched[p]) {
          st.touched[p] = 1;
          st.idx.push(p);
          st.prevOwner.push(owner[p]);
          st.prevAlpha.push(alpha[p]);
        }
        // Soft edge: full strength inside, tapering over the outer quarter.
        const a = d < r - soft ? 255 : Math.round(255 * ((r - d) / soft));
        if (st.mode === "paint") {
          if (owner[p] === st.id) alpha[p] = Math.max(alpha[p], a);
          else if (a >= alpha[p] || owner[p] === 0) {
            owner[p] = st.id;
            alpha[p] = Math.max(a, 1);
          }
        } else {
          const left = Math.max(0, alpha[p] - a);
          alpha[p] = left;
          if (left === 0) owner[p] = 0;
        }
      }
    }
  }

  /** Finish the stroke as one undo step. Returns the region it painted (0 for erase). */
  endStroke(): number {
    const st = this.stroke;
    this.stroke = null;
    if (!st) return 0;
    if (!st.idx.length) {
      if (st.createdRegion) this.regions[st.createdRegion] = null;
      return 0;
    }
    // A brand-new brushed region takes its shading reference from what it covers.
    const reg = this.regions[st.id];
    if (st.mode === "paint" && reg && !reg.refLum) {
      const lums = st.idx.map((p) => this.Y[p]).sort((a, b) => a - b);
      reg.refLum = Math.max(0.02, lums[Math.floor(lums.length / 2)]);
    }
    this.pushOp(st.idx, st.prevOwner, st.prevAlpha, st.createdRegion);
    return st.mode === "paint" ? st.id : 0;
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

  /** Undo the last fill or brush stroke. Returns the region that's now most recent (or 0). */
  undo(): number {
    const op = this.history.pop();
    if (op) {
      for (let i = 0; i < op.idx.length; i++) {
        this.owner[op.idx[i]] = op.prevOwner[i];
        this.alpha[op.idx[i]] = op.prevAlpha[i];
      }
      if (op.createdRegion) {
        this.regions[op.createdRegion] = null;
        while (this.regions.length > 1 && !this.regions[this.regions.length - 1]) this.regions.length--;
      }
    }
    return this.lastRegion;
  }

  reset() {
    this.owner.fill(0);
    this.alpha.fill(0);
    this.regions = [null];
    this.history = [];
    this.stroke = null;
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

  /** Recolored image as a JPEG (estimate email, quote attachment, download). */
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

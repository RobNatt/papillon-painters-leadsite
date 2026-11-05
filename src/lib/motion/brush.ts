/**
 * Paint-brush trail in sections marked `data-paint-section` ("light" | "dark").
 *
 * Mouse/pen: moving the pointer leaves a soft, bristled stroke on a canvas
 * behind the text. Points between pointer events are interpolated so fast
 * moves stay smooth. Each re-entry switches to the next brand color. Strokes
 * fade out over ~1.5s. The canvas (CSS opacity .45) sits under the text.
 *
 * Touch / no hover: one auto-painted stroke sweeps across the headline the
 * first time the section enters view.
 *
 * Palettes are chosen per background so text contrast stays above WCAG AA:
 * light sections get light paints under dark ink text, the navy CTA gets
 * deep or warm paints under white text.
 */
const PALETTES: Record<string, string[]> = {
  light: ["#7a8b6f", "#c9b79c", "#e2a83c"], // Sage Field, Wheat Straw, Wet Ochre
  dark: ["#2f5b46", "#7a8b6f", "#e2a83c", "#2e1f2e"], // Prairie Green, Sage Field, Wet Ochre, Dusk Plum
};
const FADE_MS = 1500;
const RADIUS = 22; // CSS px, half the brush width
const BRISTLES = 16;
const STEP = 3; // px between interpolated points

type Pt = { x: number; y: number };

export function initBrush(): () => void {
  const cleanups: (() => void)[] = [];
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  document.querySelectorAll<HTMLElement>("[data-paint-section]").forEach((section) => {
    const canvas = section.querySelector<HTMLCanvasElement>("[data-paint-canvas]");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const palette = PALETTES[section.dataset.paintSection ?? "light"] ?? PALETTES.light;

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = section.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(section);

    // Bristles: fixed offsets across the brush width, each with its own weight,
    // so the stroke has streaks and a ragged edge.
    let bristles: { off: number; w: number; a: number }[] = [];
    let colorIndex = -1;
    let color = palette[0];
    const nextColor = () => {
      colorIndex = (colorIndex + 1) % palette.length;
      color = palette[colorIndex];
      bristles = Array.from({ length: BRISTLES }, (_, i) => {
        const t = i / (BRISTLES - 1) - 0.5; // -0.5 … 0.5
        const edge = Math.abs(t) * 2; // 0 center → 1 edge
        return {
          off: t * 2 * RADIUS + (Math.random() - 0.5) * 3,
          w: 2.2 + Math.random() * 3.2 * (1 - edge * 0.6),
          a: (0.55 + Math.random() * 0.45) * (1 - edge * edge * 0.55),
        };
      });
    };
    nextColor();

    let visible = false;
    let raf = 0;
    let lastFrame = 0;
    let lastInk = 0;
    let prev: Pt | null = null;
    const queue: Pt[] = [];

    const drawSegment = (a: Pt, b: Pt) => {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy);
      if (len < 0.5) return;
      const nx = -dy / len;
      const ny = dx / len;
      ctx.lineCap = "round";
      ctx.strokeStyle = color;
      for (const br of bristles) {
        ctx.globalAlpha = br.a;
        ctx.lineWidth = br.w;
        ctx.beginPath();
        ctx.moveTo(a.x + nx * br.off, a.y + ny * br.off);
        ctx.lineTo(b.x + nx * br.off, b.y + ny * br.off);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = lastFrame ? Math.min(64, now - lastFrame) : 16;
      lastFrame = now;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      // Fade everything a little each frame (frame-rate independent).
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0,0,0,${1 - Math.pow(0.03, dt / FADE_MS)})`;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      // Draw new points, interpolated so fast moves stay continuous.
      while (queue.length) {
        const p = queue.shift()!;
        if (prev) {
          const d = Math.hypot(p.x - prev.x, p.y - prev.y);
          const steps = Math.max(1, Math.ceil(d / STEP));
          let last = prev;
          for (let i = 1; i <= steps; i++) {
            const q = { x: prev.x + ((p.x - prev.x) * i) / steps, y: prev.y + ((p.y - prev.y) * i) / steps };
            drawSegment(last, q);
            last = q;
          }
        }
        prev = p;
        lastInk = now;
      }

      if (now - lastInk > FADE_MS + 100) {
        // Fully faded: clear the low-alpha residue and stop until the next stroke.
        ctx.clearRect(0, 0, w, h);
        lastFrame = 0;
        return;
      }
      if (visible) raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      if (!raf && visible) raf = requestAnimationFrame(frame);
    };

    const local = (e: PointerEvent): Pt => {
      const r = section.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    // Touch: paint once the headline is really on screen and on top (not still
    // underneath the pinned home hero, which the next section slides under).
    const headlineShowing = () => {
      const head = section.querySelector<HTMLElement>("[data-paint-headline]");
      if (!head) return false;
      const r = head.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight) return false;
      const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return !!top && section.contains(top);
    };
    const tryAuto = () => {
      if (fine || section.dataset.painted || !visible) return;
      if (headlineShowing()) {
        window.removeEventListener("scroll", tryAuto);
        autoStroke();
      }
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) {
        wake();
        if (!fine && !section.dataset.painted) {
          window.addEventListener("scroll", tryAuto, { passive: true });
          tryAuto();
        }
      } else {
        window.removeEventListener("scroll", tryAuto);
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      }
    });
    io.observe(section);

    // Touch / no hover: one sweep across the headline, once.
    let autoRaf = 0;
    const autoStroke = () => {
      section.dataset.painted = "1";
      const head = section.querySelector<HTMLElement>("[data-paint-headline]");
      if (!head) return;
      const s = section.getBoundingClientRect();
      const r = head.getBoundingClientRect();
      const x0 = r.left - s.left - 12;
      const x1 = Math.min(s.width - 8, r.right - s.left + 12);
      const yMid = r.top - s.top + r.height * 0.55;
      const amp = Math.min(18, r.height * 0.15);
      const t0 = performance.now();
      const dur = 900;
      prev = null;
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        queue.push({ x: x0 + (x1 - x0) * eased, y: yMid + Math.sin(eased * Math.PI * 2) * amp });
        wake();
        if (t < 1) autoRaf = requestAnimationFrame(step);
      };
      autoRaf = requestAnimationFrame(step);
    };

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      nextColor();
      prev = local(e);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" || !visible) return;
      // Coalesced events give the in-between points on fast moves.
      const events = e.getCoalescedEvents?.() ?? [e];
      for (const ev of events.length ? events : [e]) queue.push(local(ev));
      wake();
    };
    const onLeave = () => {
      prev = null;
    };
    if (fine) {
      section.addEventListener("pointerenter", onEnter);
      section.addEventListener("pointermove", onMove);
      section.addEventListener("pointerleave", onLeave);
    }

    cleanups.push(() => {
      window.removeEventListener("scroll", tryAuto);
      io.disconnect();
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (autoRaf) cancelAnimationFrame(autoRaf);
      section.removeEventListener("pointerenter", onEnter);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      delete section.dataset.painted;
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

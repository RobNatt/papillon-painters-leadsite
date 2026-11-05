/**
 * Phone/tablet motion: the same calm reveals with no GSAP, no SplitText and no
 * scroll-scrubbed work, which keeps the main thread free (Lighthouse mobile).
 * Split headings reveal as a whole block instead of line by line.
 */
import { inView, MAX_STAGGER_INDEX, REVEAL_ROOT_MARGIN } from "./tokens";

/**
 * Below-the-fold sections start with `content-visibility: auto` on phones
 * (see globals.css) so first load lays out only the hero. Once the page has
 * loaded, render them one per idle period: each is a small task, and every
 * section has its real height before the visitor scrolls back up (Safari has
 * no scroll anchoring to hide a late size change).
 */
function renderDeferredSections(): () => void {
  let stopped = false;
  let handle = 0;
  const ric = "requestIdleCallback" in window;
  const idle = (fn: () => void): number => (ric ? window.requestIdleCallback(fn, { timeout: 2000 }) : window.setTimeout(fn, 50));
  const cancel = (h: number) => (ric ? window.cancelIdleCallback(h) : window.clearTimeout(h));
  const next = () => {
    if (stopped) return;
    const el = document.querySelector<HTMLElement>("main > :not(:first-child):not(.cv-done), body > footer:not(.cv-done)");
    if (!el) return;
    el.classList.add("cv-done");
    handle = idle(next);
  };
  const start = () => (handle = idle(next));
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
  return () => {
    stopped = true;
    window.removeEventListener("load", start);
    cancel(handle);
  };
}

export function initMotionLite(): () => void {
  const root = document.documentElement;
  root.classList.add("motion-live");
  const stopRendering = renderDeferredSections();

  const all = () => document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)");
  if (!root.classList.contains("motion-ok") || !("IntersectionObserver" in window)) {
    all().forEach((el) => el.classList.add("is-in"));
    document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => el.classList.add("is-split"));
    return stopRendering;
  }

  // Read every position first, then write, so the browser lays out once (no thrashing).
  const headings = [...document.querySelectorAll<HTMLElement>("[data-split]:not(.is-split)")];
  const onScreen = headings.map(inView);
  headings.forEach((el, i) => {
    // A heading that's already on screen was visible: keep it, don't hide and replay it.
    if (onScreen[i]) el.classList.add("is-in", "is-instant");
    if (!el.hasAttribute("data-reveal")) el.setAttribute("data-reveal", "");
    el.classList.add("is-split");
  });
  document.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) => {
    group.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el, i) => el.style.setProperty("--i", String(Math.min(i, MAX_STAGGER_INDEX))));
  });

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    },
    { rootMargin: REVEAL_ROOT_MARGIN },
  );
  all().forEach((el) => io.observe(el));
  return () => {
    io.disconnect();
    stopRendering();
  };
}

/**
 * Below-the-fold sections start with `content-visibility: auto` on phones and
 * tablets (see globals.css) so first load lays out only the hero. Once the
 * page has loaded, render them one per idle period: each is a small task, and
 * every section has its real height before the visitor scrolls back up
 * (Safari has no scroll anchoring to hide a late size change).
 *
 * `onDone` runs once everything is rendered, so ScrollTrigger can re-measure
 * with real heights instead of the 900px estimates.
 */
export function renderDeferredSections(onDone?: () => void): () => void {
  let stopped = false;
  let handle = 0;
  const ric = "requestIdleCallback" in window;
  const idle = (fn: () => void): number => (ric ? window.requestIdleCallback(fn, { timeout: 2000 }) : window.setTimeout(fn, 50));
  const cancel = (h: number) => (ric ? window.cancelIdleCallback(h) : window.clearTimeout(h));
  const selector = "main > :not(:first-child):not(.cv-done):not([data-unveil-spacer]), body > footer:not(.cv-done)";
  // Only phones/tablets use content-visibility; on desktop there's nothing to do.
  if (getComputedStyle(document.querySelector("body > footer") ?? document.body).contentVisibility !== "auto") {
    onDone?.();
    return () => {};
  }
  const next = () => {
    if (stopped) return;
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) {
      onDone?.();
      return;
    }
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

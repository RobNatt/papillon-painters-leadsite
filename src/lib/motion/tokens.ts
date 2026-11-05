/**
 * Motion tokens for GSAP. These mirror the CSS custom properties in
 * globals.css (--ease-out, --dur-reveal, ...). Change both together.
 */
export const EASE_OUT = "0.22,1,0.36,1"; // cubic-bezier, things arriving
export const EASE_IN_OUT = "0.65,0,0.35,1"; // cubic-bezier, things changing in place

/** Seconds. */
export const DUR = { micro: 0.24, ui: 0.4, reveal: 0.8, draw: 1.2 } as const;
export const STAGGER = 0.08;
/** Highest stagger index, so a long list never waits more than ~0.5s. */
export const MAX_STAGGER_INDEX = 6;
/** Where scroll reveals trigger: element top crosses 90% of the viewport. */
export const REVEAL_START = "top 90%";
export const REVEAL_ROOT_MARGIN = "0px 0px -10% 0px";

/** True if the element is already on screen (so it should not replay an entrance). */
export function inView(el: Element): boolean {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight * 0.9;
}

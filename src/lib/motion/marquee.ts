/**
 * Infinite marquees (markup: src/components/marquee.tsx).
 *
 * The track moves on the GSAP ticker with a quick setter (no React renders).
 * Scroll velocity from the shared Lenis instance briefly speeds it up and
 * skews it through `gsap.quickTo`, then both ease back to rest. Pauses on
 * hover and keyboard focus, and does no work while offscreen.
 */
import { gsap } from "gsap";
import type Lenis from "lenis";
import { DUR } from "./tokens";

const MAX_BOOST = 5; // up to 6× the resting speed
const MAX_SKEW = 6; // degrees

export function initMarquees(lenis: Lenis | null): () => void {
  const cleanups: (() => void)[] = [];

  document.querySelectorAll<HTMLElement>("[data-marquee]").forEach((root) => {
    const track = root.querySelector<HTMLElement>("[data-marquee-track]");
    const first = track?.querySelector<HTMLElement>(".marquee-group");
    if (!track || !first) return;

    const dir = root.dataset.direction === "right" ? 1 : -1;
    const speed = Number(root.dataset.speed) || 40;
    const extraClones: HTMLElement[] = [];
    let groupW = 0;

    // Enough copies to cover the widest screen plus one set for the wrap.
    const measure = () => {
      groupW = first.getBoundingClientRect().width;
      if (!groupW) return;
      let copies = track.children.length;
      while (groupW * (copies - 1) < root.clientWidth) {
        const clone = first.cloneNode(true) as HTMLElement;
        clone.setAttribute("aria-hidden", "true");
        clone.removeAttribute("aria-label");
        clone.dataset.marqueeClone = "";
        track.append(clone);
        extraClones.push(clone);
        copies++;
      }
    };
    measure();

    const setX = gsap.quickSetter(track, "x", "px") as (v: number) => void;
    const skewTo = gsap.quickTo(track, "skewX", { duration: DUR.ui, ease: "site-out" });
    const state = { boost: 0, run: 1 };
    const boostTo = gsap.quickTo(state, "boost", { duration: DUR.reveal, ease: "site-out" });
    const runTo = gsap.quickTo(state, "run", { duration: DUR.ui, ease: "site-out" });

    let x = 0;
    let visible = false;
    const tick = (_t: number, dt: number) => {
      if (!visible || !groupW) return;
      x += dir * speed * (dt / 1000) * (1 + state.boost) * state.run;
      x = gsap.utils.wrap(-groupW, 0, x);
      setX(x);
    };
    gsap.ticker.add(tick);

    // Scroll velocity: kick, then ease back once scrolling stops.
    let settle = 0;
    const onScroll = ({ velocity }: { velocity: number }) => {
      if (!visible) return;
      boostTo(Math.min(MAX_BOOST, Math.abs(velocity) / 8));
      skewTo(gsap.utils.clamp(-MAX_SKEW, MAX_SKEW, velocity * -0.35 * dir));
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        boostTo(0);
        skewTo(0);
      }, 120);
    };
    lenis?.on("scroll", onScroll);

    // Pause on hover (mouse only) and on keyboard focus inside.
    const pause = (e: Event) => {
      if (e instanceof PointerEvent && e.pointerType !== "mouse") return;
      runTo(0);
    };
    const resume = (e: Event) => {
      if (e instanceof PointerEvent && e.pointerType !== "mouse") return;
      if (root.contains(document.activeElement) && e.type === "pointerleave") return;
      runTo(1);
    };
    root.addEventListener("pointerenter", pause);
    root.addEventListener("pointerleave", resume);
    root.addEventListener("focusin", pause);
    root.addEventListener("focusout", resume);

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(root);
    const ro = new ResizeObserver(() => measure());
    ro.observe(root);

    cleanups.push(() => {
      gsap.ticker.remove(tick);
      lenis?.off("scroll", onScroll);
      window.clearTimeout(settle);
      root.removeEventListener("pointerenter", pause);
      root.removeEventListener("pointerleave", resume);
      root.removeEventListener("focusin", pause);
      root.removeEventListener("focusout", resume);
      io.disconnect();
      ro.disconnect();
      extraClones.forEach((c) => c.remove());
      gsap.killTweensOf([track, state]);
      gsap.set(track, { clearProps: "transform" });
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

/**
 * Motion engine. Loaded lazily by <MotionRoot/> after first paint, then
 * re-run on every route change. Pages opt in with data attributes:
 *
 *   data-reveal[="left"|"right"|"draw"|"draw-y"]  fade/rise once when scrolled into view
 *   data-reveal-group                    children with data-reveal get a stagger index
 *   data-split                           heading split into lines (SplitText) and revealed
 *   data-parallax="0.12"                 slow drift tied to scroll (fraction of height)
 *   data-magnetic                        button follows a fine pointer slightly
 *   data-pin-steps                       pinned 3-step sequence (desktop only)
 *
 * Without JS, or with prefers-reduced-motion, all content is simply visible.
 * Timing and easing come from ./tokens, which mirrors the CSS motion tokens.
 */
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { DUR, EASE_IN_OUT, EASE_OUT, inView, MAX_STAGGER_INDEX, REVEAL_START, STAGGER } from "./tokens";

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
// The same two curves the CSS uses, so GSAP and CSS motion feel identical.
CustomEase.create("site-out", EASE_OUT);
CustomEase.create("site-in-out", EASE_IN_OUT);
gsap.defaults({ ease: "site-out", duration: DUR.reveal });
// Ignore the mobile URL bar showing/hiding, which would otherwise re-measure mid-scroll.
ScrollTrigger.config({ ignoreMobileResize: true });

const root = document.documentElement;
let lenis: Lenis | null = null;

function ensureLenis(): void {
  const wanted =
    window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!wanted || lenis) return;
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: { offset: -96 } });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

export function initMotion(): () => void {
  root.classList.add("motion-live");
  ensureLenis();
  // Next.js resets scroll on navigation; keep Lenis in sync with it.
  lenis?.scrollTo(window.scrollY, { immediate: true, force: true });
  lenis?.resize();

  // If the fallback timer already gave up (slow load), leave everything static.
  if (!root.classList.contains("motion-ok")) {
    markAllIn();
    return () => {};
  }

  const mm = gsap.matchMedia();
  mm.add(
    {
      motion: "(prefers-reduced-motion: no-preference)",
      desktop: "(min-width: 1024px)",
      fine: "(hover: hover) and (pointer: fine)",
    },
    (ctx) => {
      const { motion, desktop, fine } = ctx.conditions as Record<string, boolean>;
      if (!motion) {
        markAllIn();
        return;
      }
      const cleanups: (() => void)[] = [];
      reveals();
      splits(cleanups);
      parallax();
      if (desktop) pinSteps(cleanups);
      if (fine) magnetic(cleanups);
      ScrollTrigger.refresh();
      return () => cleanups.forEach((fn) => fn());
    },
  );

  // Fonts and late images change layout; re-measure once they settle.
  const refresh = () => ScrollTrigger.refresh();
  document.fonts?.ready.then(refresh);
  window.addEventListener("load", refresh, { once: true });

  return () => {
    mm.revert();
    window.removeEventListener("load", refresh);
  };
}

function markAllIn() {
  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => el.classList.add("is-in"));
  document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => el.classList.add("is-split"));
}

function reveals() {
  document.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) => {
    group
      .querySelectorAll<HTMLElement>("[data-reveal]")
      .forEach((el, i) => el.style.setProperty("--i", String(Math.min(i, MAX_STAGGER_INDEX))));
  });
  // One batched observer instead of a trigger per element: less work while scrolling.
  ScrollTrigger.batch("[data-reveal]:not(.is-in)", {
    start: REVEAL_START,
    once: true,
    onEnter: (els) => els.forEach((el) => el.classList.add("is-in")),
  });
}

function splits(cleanups: (() => void)[]) {
  // Read every position before SplitText starts writing, so layout runs once.
  const headings = [...document.querySelectorAll<HTMLElement>("[data-split]:not(.is-split)")];
  const onScreen = headings.map(inView);
  headings.forEach((el, i) => {
    // Already on screen (e.g. reloaded mid-page): it was visible, so don't hide and replay it.
    let played = onScreen[i];
    const split = SplitText.create(el, {
      type: "lines",
      mask: "lines",
      linesClass: "split-line",
      autoSplit: true,
      onSplit(self) {
        el.classList.add("is-split");
        if (played) return;
        return gsap.from(self.lines, {
          yPercent: 105,
          duration: DUR.reveal,
          ease: "site-out",
          stagger: STAGGER,
          scrollTrigger: { trigger: el, start: REVEAL_START, once: true, onEnter: () => (played = true) },
        });
      },
    });
    cleanups.push(() => split.revert());
  });
}

function parallax() {
  document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
    const amount = Number(el.dataset.parallax) || 0.12;
    const trigger = el.closest<HTMLElement>("[data-parallax-root]") ?? el.parentElement ?? el;
    gsap.fromTo(
      el,
      { yPercent: 0 },
      {
        yPercent: amount * 100,
        ease: "none",
        // A short scrub lag smooths wheel steps without feeling detached.
        scrollTrigger: { trigger, start: "top top", end: "bottom top", scrub: 0.3 },
      },
    );
  });
}

function pinSteps(cleanups: (() => void)[]) {
  document.querySelectorAll<HTMLElement>("[data-pin-steps]").forEach((section) => {
    const steps = gsap.utils.toArray<HTMLElement>(section.querySelectorAll(".pin-step"));
    const bar = section.querySelector<HTMLElement>("[data-pin-progress]");
    const counter = section.querySelector<HTMLElement>("[data-pin-counter]");
    if (steps.length < 2) return;
    let shown = 0;

    section.classList.add("is-pinned");
    gsap.set(steps, { autoAlpha: 0, y: 20 });
    gsap.set(steps[0], { autoAlpha: 1, y: 0 });
    if (bar) gsap.set(bar, { scaleY: 0, transformOrigin: "top center" });

    const tl = gsap.timeline({
      defaults: { ease: "site-in-out", duration: 0.5 },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${steps.length * 85}%`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate(self) {
          if (!counter) return;
          const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
          if (idx === shown) return; // write to the DOM only when the step changes
          shown = idx;
          counter.textContent = String(idx + 1).padStart(2, "0");
        },
      },
    });
    if (bar) tl.to(bar, { scaleY: 1, ease: "none", duration: steps.length }, 0);
    steps.forEach((step, i) => {
      if (i === 0) return;
      tl.to(steps[i - 1], { autoAlpha: 0, y: -20 }, i - 0.25).to(step, { autoAlpha: 1, y: 0 }, i - 0.05);
    });
    cleanups.push(() => {
      section.classList.remove("is-pinned");
      gsap.set(steps, { clearProps: "all" });
    });
  });
}

function magnetic(cleanups: (() => void)[]) {
  document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
    const xTo = gsap.quickTo(el, "x", { duration: DUR.ui, ease: "site-out" });
    const yTo = gsap.quickTo(el, "y", { duration: DUR.ui, ease: "site-out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.2);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.2);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    cleanups.push(() => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      gsap.set(el, { clearProps: "transform" });
    });
  });
}

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
 *   data-zoom-scroll                     ZoomImage: gentle scroll-linked zoom-out
 *   data-marquee                         infinite marquee (./marquee)
 *   data-paint-section                   paint-brush trail (./brush)
 *   data-hero-unveil                     home hero scroll sequence (./hero-unveil)
 *
 * One scroll system on every device: a single Lenis instance drives
 * ScrollTrigger through the GSAP ticker. Wheel scrolling is smoothed on
 * desktop; touch scrolling stays native (Lenis still reports it).
 *
 * Without JS, or with prefers-reduced-motion, all content is simply visible.
 * Timing and easing come from ./tokens, which mirrors the CSS motion tokens.
 */
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { renderDeferredSections } from "./deferred";
import { initMarquees } from "./marquee";
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

/** The one Lenis instance, created once and kept across route changes. */
function ensureLenis(): void {
  if (lenis || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 1,
    syncTouch: false, // native touch scrolling, still reported to ScrollTrigger
    anchors: { offset: -96, duration: DUR.draw },
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

export function initMotion(): () => void {
  root.classList.add("motion-live");
  // Rendering deferred phone sections changes heights; re-measure after.
  const stopDeferred = renderDeferredSections(() => ScrollTrigger.refresh());

  // If the fallback timer already gave up (slow load), leave everything static.
  if (!root.classList.contains("motion-ok")) {
    markAllIn();
    return stopDeferred;
  }

  ensureLenis();
  // Next.js resets scroll on navigation; keep Lenis in sync with it.
  lenis?.scrollTo(window.scrollY, { immediate: true, force: true });
  lenis?.resize();

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
      let alive = true;
      cleanups.push(() => (alive = false));
      // Line-by-line SplitText only where there's room and a fine pointer;
      // elsewhere headings reveal as one block (much less main-thread work).
      const richText = desktop && fine;
      if (!richText) blockHeadings();
      reveals();
      if (richText) splits(cleanups);
      parallax();
      zoomScroll();
      cleanups.push(initMarquees(lenis));
      if (desktop) pinSteps(cleanups);
      if (fine) magnetic(cleanups);

      // Feature modules load only on pages that use them.
      const lazy = (load: () => Promise<() => void>) =>
        load().then((stop) => {
          if (alive) cleanups.push(stop);
          else stop();
          ScrollTrigger.refresh();
        });
      if (document.querySelector("[data-hero-unveil]")) {
        lazy(() => import("./hero-unveil").then(({ initHeroUnveil }) => initHeroUnveil({ lenis, fine, splitLines: richText })));
      }
      if (document.querySelector("[data-paint-section]")) {
        lazy(() => import("./brush").then(({ initBrush }) => initBrush()));
      }

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
    stopDeferred();
    window.removeEventListener("load", refresh);
  };
}

/** Phones/tablets: split headings reveal as one block instead of line by line. */
function blockHeadings() {
  const headings = [...document.querySelectorAll<HTMLElement>("[data-split]:not(.is-split)")];
  // Read every position first, then write, so the browser lays out once.
  const onScreen = headings.map(inView);
  headings.forEach((el, i) => {
    // Already on screen: it was visible, so keep it rather than hide and replay it.
    if (onScreen[i]) el.classList.add("is-in", "is-instant");
    if (!el.hasAttribute("data-reveal")) el.setAttribute("data-reveal", "");
    el.classList.add("is-split");
  });
}

/** ZoomImage: a gentle zoom-out while the photo scrolls past (scale stays ≥ 1). */
function zoomScroll() {
  document.querySelectorAll<HTMLElement>("[data-zoom-scroll]").forEach((el) => {
    const frame = el.closest<HTMLElement>("[data-zoom]") ?? el;
    gsap.fromTo(
      el,
      { scale: 1.08 },
      { scale: 1, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } },
    );
  });
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

/**
 * Home hero scroll sequence (markup: src/components/hero-unveil.tsx).
 *
 * The pin starts only after the whole hero (including the quote form) has
 * been scrolled through, so the form is never part of the animation while
 * someone is using it. From there, scrubbed to scroll:
 *
 *   0.00–0.32  photo scales up, overlay ramps to near-black, headline lines
 *              and the rest of the hero drift out
 *   0.30–0.64  the statement rises in; photos follow the cursor (or play on a
 *              timer on touch screens), max 6 on screen, recycled from a pool
 *   0.62–0.86  statement out, the dark hero scales down and fades to reveal
 *              the next section, which has slid up underneath; then unpin
 *
 * pinSpacing is off, and a spacer after the hero (120% of the viewport) lets
 * the next section travel up under the pinned hero for the full distance.
 */
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import type Lenis from "lenis";
import { DUR } from "./tokens";

const SCROLL_LENGTH = 2.2; // × viewport height
const MAX_ON_SCREEN = 6;
const TRAIL_SPACING = 110; // px of pointer travel between photos
const AUTO_INTERVAL = 650; // ms between photos on touch screens

export function initHeroUnveil({ lenis, fine, splitLines }: { lenis: Lenis | null; fine: boolean; splitLines: boolean }): () => void {
  const wrap = document.querySelector<HTMLElement>("[data-hero-unveil]");
  const pinSpacer = document.querySelector<HTMLElement>("[data-unveil-pin]");
  const after = document.querySelector<HTMLElement>("[data-unveil-spacer]");
  const hero = wrap?.querySelector<HTMLElement>("[data-unveil-hero]");
  const bg = wrap?.querySelector<HTMLElement>("[data-unveil-bg]");
  const dark = wrap?.querySelector<HTMLElement>("[data-unveil-dark]");
  const stage = wrap?.querySelector<HTMLElement>("[data-unveil-stage]");
  const statement = wrap?.querySelector<HTMLElement>("[data-unveil-statement]");
  const pool = wrap?.querySelector<HTMLElement>("[data-unveil-pool]");
  if (!wrap || !pinSpacer || !after || !hero || !bg || !dark || !stage || !statement || !pool) return () => {};

  const lines = gsap.utils.toArray<HTMLElement>(wrap.querySelectorAll(".hero-line"));
  const fades = gsap.utils.toArray<HTMLElement>(wrap.querySelectorAll("[data-unveil-fade]"));
  const items = gsap.utils.toArray<HTMLElement>(pool.querySelectorAll(":scope > li"));

  // The hero's CSS entrance animations own `transform`/`opacity` until they
  // finish. Hand those properties to GSAP once they're done.
  wrap.querySelectorAll<HTMLElement>(".hero-line > span, .hero-fade").forEach((el) => {
    el.getAnimations().forEach((a) => a.finished.then(() => a.cancel(), () => {}));
  });

  const setSpacer = () => (after.style.height = `${Math.round(window.innerHeight * (SCROLL_LENGTH - 1))}px`);
  setSpacer();

  let split: SplitText | null = null;
  let statementLines: HTMLElement[] = [statement];
  if (splitLines) {
    split = SplitText.create(statement, { type: "lines", mask: "lines", linesClass: "unveil-line" });
    statementLines = split.lines as HTMLElement[];
  }

  /* ---------- photo trail ---------- */
  let active = false;
  let armed = false;
  let next = 0;
  let onScreen = 0;
  let last: { x: number; y: number } | null = null;
  let timer = 0;

  const arm = () => {
    if (armed) return;
    armed = true;
    pool.setAttribute("aria-hidden", "true"); // decorative while animated
    pool.classList.add("is-armed"); // images start loading now (lazy → visible)
  };
  const spawn = (x: number, y: number) => {
    if (onScreen >= MAX_ON_SCREEN || !items.length) return;
    const el = items[next++ % items.length];
    gsap.killTweensOf(el);
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    gsap.set(el, { x: x - w / 2, y: y - h / 2, rotation: gsap.utils.random(-7, 7) });
    onScreen++;
    gsap
      .timeline({ onComplete: () => onScreen-- })
      // Capped below full opacity so the white statement stays readable over bright photos.
      .fromTo(el, { autoAlpha: 0, scale: 0.72 }, { autoAlpha: 0.72, scale: 1, duration: DUR.ui, ease: "site-out" })
      .to(el, { autoAlpha: 0, scale: 0.92, duration: DUR.reveal, ease: "site-in-out" }, `+=${DUR.ui}`);
  };
  const onPointer = (e: PointerEvent) => {
    if (!active || e.pointerType === "touch") return;
    const r = stage.getBoundingClientRect();
    const p = { x: e.clientX - r.left, y: e.clientY - r.top };
    if (last && Math.hypot(p.x - last.x, p.y - last.y) < TRAIL_SPACING) return;
    last = p;
    spawn(p.x, p.y);
  };
  const autoSpawn = () => {
    const r = stage.getBoundingClientRect();
    spawn(gsap.utils.random(r.width * 0.15, r.width * 0.85), gsap.utils.random(r.height * 0.18, r.height * 0.82));
  };
  const setActive = (on: boolean) => {
    if (on === active) return;
    active = on;
    if (!fine) {
      window.clearInterval(timer);
      if (on) {
        autoSpawn();
        timer = window.setInterval(autoSpawn, AUTO_INTERVAL);
      }
    }
    if (!on) last = null;
  };
  if (fine) window.addEventListener("pointermove", onPointer, { passive: true });

  // Load the pool's photos as soon as the visitor starts scrolling, well
  // before stage 2, but never during first load.
  const onFirstScroll = () => {
    if (window.scrollY > 4) arm();
  };
  if (lenis) lenis.on("scroll", onFirstScroll);
  else window.addEventListener("scroll", onFirstScroll, { passive: true });

  /* ---------- the scrubbed sequence ---------- */
  gsap.set(stage, { autoAlpha: 0 });
  const tl = gsap.timeline({
    defaults: { ease: "none", immediateRender: false },
    scrollTrigger: {
      trigger: wrap,
      pin: wrap,
      pinSpacer,
      pinSpacing: false,
      start: "bottom bottom",
      end: () => `+=${window.innerHeight * SCROLL_LENGTH}`,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefresh: setSpacer,
      onUpdate: (self) => setActive(self.progress > 0.3 && self.progress < 0.64),
      // Drops the header blur while pinned (see globals.css).
      onToggle: (self) => document.documentElement.classList.toggle("unveil-pinned", self.isActive),
      // A jump past either end (anchor links, "Get a free quote" in the header)
      // snaps to the final state, so the scrub never replays the dark stage
      // while the hero isn't pinned.
      onLeave: (self) => {
        self.getTween()?.progress(1);
        setActive(false);
      },
      onLeaveBack: (self) => {
        self.getTween()?.progress(1);
        setActive(false);
      },
    },
  });
  // Explicit start values everywhere, so scrubbing back always lands on the
  // exact original hero.
  tl.fromTo(bg, { scale: 1 }, { scale: 1.35, duration: 0.32 }, 0)
    .fromTo(dark, { opacity: 0 }, { opacity: 0.94, duration: 0.3 }, 0)
    .fromTo(lines, { yPercent: 0, opacity: 1 }, { yPercent: -60, opacity: 0, stagger: 0.025, duration: 0.16 }, 0.03)
    .fromTo(fades, { y: 0, opacity: 1 }, { y: -32, opacity: 0, stagger: 0.02, duration: 0.16 }, 0.02)
    .fromTo(stage, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.04 }, 0.28)
    .fromTo(statementLines, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.03, duration: 0.14, ease: "site-out" }, 0.3)
    .fromTo(statementLines, { yPercent: 0, opacity: 1 }, { yPercent: -40, opacity: 0, stagger: 0.02, duration: 0.08 }, 0.62)
    // autoAlpha: once faded, the hero is visibility:hidden, not just transparent.
    .fromTo(hero, { scale: 1, autoAlpha: 1 }, { scale: 0.92, autoAlpha: 0, duration: 0.16, ease: "site-in-out" }, 0.7)
    .fromTo(stage, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.06 }, 0.7)
    // After the pin, ScrollTrigger leaves the (now invisible) hero translated
    // over the next section. Let clicks and taps pass through it; scrolling
    // back up reverts this.
    .fromTo(wrap, { pointerEvents: "auto" }, { pointerEvents: "none", duration: 0.001 }, 0.78)
    .set({}, {}, 1);

  return () => {
    document.documentElement.classList.remove("unveil-pinned");
    setActive(false);
    window.removeEventListener("pointermove", onPointer);
    lenis?.off("scroll", onFirstScroll);
    window.removeEventListener("scroll", onFirstScroll);
    tl.scrollTrigger?.kill();
    tl.kill();
    split?.revert();
    gsap.killTweensOf(items);
    gsap.set([wrap, bg, dark, hero, stage, ...lines, ...fades, ...items], { clearProps: "all" });
    pool.classList.remove("is-armed");
    pool.removeAttribute("aria-hidden");
    after.style.height = "";
  };
}

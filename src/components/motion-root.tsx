"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Set once the visitor has touched, scrolled or typed: later routes load right away. */
let engaged = false;
const WAKE_EVENTS = ["scroll", "wheel", "touchstart", "pointerdown", "keydown"] as const;

/**
 * Loads the motion engine (GSAP, ScrollTrigger, SplitText, Lenis) without
 * ever competing with first paint or the hero form, then re-runs it on each
 * route. The same engine runs on every device; it scales its work down on
 * phones.
 *
 *   - Mouse/trackpad devices: when the browser is idle after hydration.
 *   - Touch devices: on the first touch, scroll or key press. Nothing below
 *     the hero needs motion before the visitor scrolls, and the hero only
 *     pins after the whole form has been scrolled past, so the engine is
 *     always ready in time, while a phone's first seconds stay free for the
 *     form. Anything already on screen is revealed immediately.
 */
export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    // JS is running: tell the boot script's fallback not to give up on motion.
    root.classList.add("motion-armed");

    let cancelled = false;
    let cleanup: (() => void) | undefined;
    let idleHandle = 0;
    const ric = "requestIdleCallback" in window;
    const run = () => {
      if (cancelled) return;
      import("@/lib/motion/init").then(({ initMotion }) => {
        if (!cancelled) cleanup = initMotion();
      });
    };
    const runWhenIdle = () => {
      idleHandle = ric ? window.requestIdleCallback(run, { timeout: 1000 }) : window.setTimeout(run, 200);
    };
    const wake = () => {
      engaged = true;
      WAKE_EVENTS.forEach((t) => window.removeEventListener(t, wake));
      runWhenIdle();
    };

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (fine || engaged || window.scrollY > 0 || window.location.hash) {
      runWhenIdle();
    } else {
      // Reveal whatever is already on screen now, so nothing visible waits.
      if (root.classList.contains("motion-ok")) {
        const els = [...document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)")];
        const onScreen = els.map((el) => el.getBoundingClientRect().top < window.innerHeight);
        els.forEach((el, i) => onScreen[i] && el.classList.add("is-in"));
      }
      WAKE_EVENTS.forEach((t) => window.addEventListener(t, wake, { passive: true }));
    }

    return () => {
      cancelled = true;
      WAKE_EVENTS.forEach((t) => window.removeEventListener(t, wake));
      if (ric) window.cancelIdleCallback(idleHandle);
      else window.clearTimeout(idleHandle);
      cleanup?.();
    };
  }, [pathname]);

  return null;
}

/**
 * Runs before first paint. Enables the motion styles only for visitors who
 * haven't asked for reduced motion. If no JavaScript has started within 4
 * seconds (blocked or failed scripts), it removes them again, so nothing can
 * stay hidden.
 */
export const motionBootScript = `(function(){var d=document.documentElement;try{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('motion-ok');setTimeout(function(){if(!d.classList.contains('motion-live')&&!d.classList.contains('motion-armed')){d.classList.remove('motion-ok')}},4000)}catch(e){}})();`;

"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Loads the motion engine (GSAP, ScrollTrigger, SplitText, Lenis) after the
 * page has painted and the browser is idle, then re-runs it on each route.
 * Nothing here blocks first paint or hides the hero.
 */
export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    // Full engine (GSAP, Lenis, pinning) only on desktop with a mouse or trackpad.
    const full = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches;
    const run = () =>
      full
        ? import("@/lib/motion/init").then(({ initMotion }) => {
            if (!cancelled) cleanup = initMotion();
          })
        : import("@/lib/motion/lite").then(({ initMotionLite }) => {
            if (!cancelled) cleanup = initMotionLite();
          });

    // Wait for idle time: by then React has finished hydrating the page, so the
    // engines never touch the DOM mid-hydration, and they never compete with first
    // paint. The lite engine is tiny, so it gets a shorter cap.
    const ric = "requestIdleCallback" in window;
    const cap = full ? 1000 : 500;
    const handle = ric ? window.requestIdleCallback(() => void run(), { timeout: cap }) : window.setTimeout(run, 200);
    return () => {
      cancelled = true;
      if (ric) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      cleanup?.();
    };
  }, [pathname]);

  return null;
}

/**
 * Runs before first paint. Enables the motion styles only for visitors who
 * haven't asked for reduced motion, and removes them again if the motion
 * script hasn't started within 4 seconds, so nothing can stay hidden.
 */
export const motionBootScript = `(function(){var d=document.documentElement;try{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('motion-ok');setTimeout(function(){if(!d.classList.contains('motion-live')){d.classList.remove('motion-ok')}},4000)}catch(e){}})();`;

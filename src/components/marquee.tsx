import type { ReactNode } from "react";

/**
 * Seamless infinite marquee. Server-rendered: the items are in the HTML once
 * for real and once as an `aria-hidden` copy for the loop. The motion engine
 * (src/lib/motion/marquee.ts) moves the track, adds more hidden copies if the
 * screen is wider than one set, speeds up and skews briefly with scroll
 * velocity, and pauses on hover or keyboard focus.
 *
 * Reduced motion / no JS: one static row that wraps.
 *
 * `children` must be <li> elements.
 */
export function Marquee({
  children,
  label,
  direction = "left",
  speed = 40,
  className = "",
  groupClassName = "",
}: {
  children: ReactNode;
  /** Accessible name for the list. */
  label: string;
  direction?: "left" | "right";
  /** Pixels per second at rest. */
  speed?: number;
  className?: string;
  groupClassName?: string;
}) {
  return (
    <div className={`marquee ${className}`} data-marquee data-direction={direction} data-speed={speed}>
      <div className="marquee-track" data-marquee-track>
        <ul className={`marquee-group ${groupClassName}`} aria-label={label}>
          {children}
        </ul>
        <ul className={`marquee-group ${groupClassName}`} aria-hidden="true" data-marquee-clone>
          {children}
        </ul>
      </div>
    </div>
  );
}

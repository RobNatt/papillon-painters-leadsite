import type { PhotoSlot } from "@/content/images";
import { Photo } from "./photo";

/**
 * Content photo in a fixed frame. The frame (sized by the parent or by
 * `className`) never changes size, so nothing shifts.
 *
 *   - On enter: the photo eases from scale 1.15 to 1 and fades in (CSS, via the
 *     shared `data-reveal` system).
 *   - While scrolling past: a gentle scroll-linked zoom-out (engine:
 *     `data-zoom-scroll`), always at scale ≥ 1 so the frame edges never show.
 *   - `priority` (above the fold): no fade, so it can never delay first paint.
 *
 * Reduced motion / no JS: a plain, static photo.
 */
export function ZoomImage({
  slot,
  sizes,
  priority = false,
  decorative = false,
  className = "",
}: {
  slot: PhotoSlot;
  sizes: string;
  priority?: boolean;
  decorative?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`} data-zoom>
      <div className="absolute inset-0" data-zoom-scroll>
        <div className={`absolute inset-0 ${priority ? "hero-settle" : ""}`} data-reveal={priority ? undefined : "zoom"}>
          <Photo slot={slot} sizes={sizes} priority={priority} decorative={decorative} />
        </div>
      </div>
    </div>
  );
}

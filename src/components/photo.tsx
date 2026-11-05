import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import type { PhotoSlot, Tone } from "@/content/images";

const toneBg: Record<Tone, string> = {
  navy: "bg-chip-navy",
  forest: "bg-chip-forest",
  plum: "bg-chip-plum",
  charcoal: "bg-chip-charcoal",
};

/** Checked at build time (pages are static), so a dropped-in file just works. */
const hasFile = (file: string) => existsSync(join(process.cwd(), "public", file));

/**
 * Renders a photo slot with next/image (`fill`, so it always covers its
 * parent and never sets the layout), or a paint-chip placeholder (soft
 * brush-stroke bands) when the slot's file hasn't been added yet. The parent
 * must be positioned and sized.
 */
export function Photo({
  slot,
  priority = false,
  sizes = "100vw",
  className = "",
  decorative = false,
}: {
  slot: PhotoSlot;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** Hide from assistive tech (backgrounds, motion-only photos). */
  decorative?: boolean;
}) {
  if (hasFile(slot.file)) {
    return (
      <Image
        src={slot.file}
        alt={decorative ? "" : slot.alt}
        fill
        sizes={sizes}
        preload={priority}
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <div
      role={decorative ? "presentation" : "img"}
      aria-label={decorative ? undefined : `${slot.alt} (placeholder)`}
      className={`absolute inset-0 overflow-hidden ${toneBg[slot.tone]} ${className}`}
    >
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`pp-sheen-${slot.tone}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.10" />
            <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.22" />
          </linearGradient>
        </defs>
        <g fill="#fff" fillOpacity="0.045">
          <path d="M-20 40 C 80 20, 200 60, 420 30 L 420 78 C 260 98, 120 70, -20 96 Z" />
          <path d="M-20 130 C 120 110, 240 150, 420 120 L 420 160 C 280 186, 140 150, -20 178 Z" />
          <path d="M-20 222 C 100 204, 260 240, 420 210 L 420 250 C 250 276, 110 244, -20 268 Z" />
        </g>
        <rect width="400" height="300" fill={`url(#pp-sheen-${slot.tone})`} />
      </svg>
    </div>
  );
}

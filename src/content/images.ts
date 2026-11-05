/**
 * Photo slots. Each slot points at a file under /public. Until that file
 * exists, the slot renders a paint-chip placeholder in its `tone`, so
 * layouts and motion never depend on the photo being there.
 *
 * Current photos are AI-generated placeholders ("placeholder-*.webp").
 * To swap one: replace the file (same name), or point `file` at a new one,
 * and rebuild. Don't caption stock or AI images as anyone's real work.
 */
export type Tone = "navy" | "forest" | "plum" | "charcoal";

export type PhotoSlot = {
  /** Public path. The photo is used automatically once this file exists. */
  file: string;
  alt: string;
  tone: Tone;
};

export const images = {
  heroHome: {
    file: "/images/placeholder-exterior-craftsman-navy.webp",
    alt: "A craftsman house with navy siding, white trim and a front porch in late-afternoon sun",
    tone: "navy",
  },
  heroCost: {
    file: "/images/placeholder-hallway-trim.webp",
    alt: "A freshly painted hallway with white doors, trim and a stair railing",
    tone: "plum",
  },
  interior: {
    file: "/images/placeholder-living-room-sage.webp",
    alt: "A living room with freshly painted sage green walls and white trim",
    tone: "plum",
  },
  exterior: {
    file: "/images/placeholder-visualizer-sample-house.webp",
    alt: "A two-story house with grey siding, white trim and a white garage door",
    tone: "forest",
  },
} satisfies Record<string, PhotoSlot>;

/** Photos for the dark "story" stage of the home hero (cursor trail / timed sequence). */
export const storyImages: PhotoSlot[] = [
  { file: "/images/placeholder-brush-cut-in-navy.webp", alt: "Close-up of a brush cutting in navy paint along white trim", tone: "navy" },
  { file: "/images/placeholder-kitchen-navy-cabinets.webp", alt: "A kitchen with cabinets painted navy", tone: "navy" },
  { file: "/images/placeholder-texture-brush-strokes.webp", alt: "Close-up of sage and white brush-stroke texture", tone: "charcoal" },
  { file: "/images/placeholder-front-door-ochre.webp", alt: "A front door painted a warm ochre yellow", tone: "navy" },
  { file: "/images/placeholder-dining-plum-accent.webp", alt: "A dining room with a deep plum accent wall", tone: "plum" },
  { file: "/images/placeholder-texture-roller.webp", alt: "Close-up of fresh ochre paint with roller texture", tone: "charcoal" },
  { file: "/images/placeholder-bedroom-wheat.webp", alt: "A bedroom with warm wheat-colored walls", tone: "plum" },
  { file: "/images/placeholder-deck-stain.webp", alt: "A freshly stained wood deck and railing", tone: "forest" },
];

/** Real photo for the visualizer's "Sample house" (src/components/studio/estimate-studio.tsx). */
export const visualizerSampleHouse = "/images/placeholder-visualizer-sample-house.webp";

/**
 * Photo slots. Until a photo is added, each slot renders a paint-chip
 * placeholder in its `tone`, so layouts and motion are final already.
 *
 * To add a photo: put the file in /public/images/ and set `src`
 * (e.g. "/images/hero-home.jpg") plus the real `width` / `height`.
 * Use licensed stock or your own photos. Don't caption stock as anyone's work.
 */
export type Tone = "navy" | "forest" | "plum" | "charcoal";

export type PhotoSlot = {
  src?: string;
  width: number;
  height: number;
  alt: string;
  tone: Tone;
};

export const images = {
  heroHome: {
    width: 2400,
    height: 1600,
    alt: "A two-story house with freshly painted siding and white trim on a sunny afternoon",
    tone: "navy",
  },
  heroCost: {
    width: 2400,
    height: 1600,
    alt: "A painter rolling a fresh coat of paint onto a living room wall",
    tone: "plum",
  },
  interior: {
    width: 1600,
    height: 2000,
    alt: "A bright living room with newly painted walls",
    tone: "plum",
  },
  exterior: {
    width: 1600,
    height: 2000,
    alt: "A house exterior with new paint on the siding and trim",
    tone: "forest",
  },
  cabinets: {
    width: 1600,
    height: 1200,
    alt: "Kitchen cabinets painted in a deep blue",
    tone: "navy",
  },
  deck: {
    width: 1600,
    height: 1200,
    alt: "A freshly stained wood deck",
    tone: "forest",
  },
} satisfies Record<string, PhotoSlot>;

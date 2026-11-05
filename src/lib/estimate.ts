/**
 * Planning-estimate model. Pure functions, shared by the browser and the
 * server action (the server recomputes; it never trusts a client total).
 *
 * Base rates are calibrated to published national ranges (see `costSources`):
 *  - Interior: $2–$6 per sq ft of home (Angi via NerdWallet); typical room
 *    $364–$965 (Thumbtack). A 12×12 room with walls, ceiling and trim lands
 *    at about $410–$860 here.
 *  - Exterior: about $1,800–$4,500 for a typical job (Angi/NerdWallet),
 *    $2.20–$4.37 per sq ft of painted surface (HomeWyse), up to ~$11,600 for
 *    a full repaint of a larger home (Fixr). A 2,000 sq ft one-story vinyl
 *    home in good shape lands at about $2,650–$5,500 here.
 * These are national figures, not Papillion quotes. The output is a range,
 * and the copy always says the painter's on-site quote is the real price.
 */

export type Scope = "interior" | "exterior";

export type InteriorInput = {
  scope: "interior";
  rooms: number; // 1–15
  roomSize: "small" | "medium" | "large" | "open";
  ceilingHeight: "standard" | "tall" | "vaulted";
  ceilings: boolean;
  trim: boolean;
  doors: number; // 0–30
  condition: "good" | "minor" | "major";
  colorChange: boolean;
  premiumPaint: boolean;
};

export type ExteriorInput = {
  scope: "exterior";
  homeSqft: number; // 600–8000 finished sq ft
  stories: "1" | "2" | "3";
  siding: "vinyl" | "wood" | "fiber-cement" | "stucco" | "brick" | "metal";
  condition: "good" | "minor" | "major";
  trimOnly: boolean;
  frontDoor: boolean;
  garageDoors: number; // 0–4
  deckSqft: number; // 0–2000
  premiumPaint: boolean;
};

export type EstimateInput = InteriorInput | ExteriorInput;

export type LineItem = { label: string; low: number; high: number };
export type Estimate = {
  scope: Scope;
  low: number;
  high: number;
  items: LineItem[];
  assumptions: string[];
};

const ROOM_FLOOR_SQFT: Record<InteriorInput["roomSize"], number> = {
  small: 100, // about 10×10: bedroom, office, bath
  medium: 150, // about 12×12
  large: 240, // about 15×16: primary bedroom, family room
  open: 400, // open-plan living/kitchen area
};

export const roomSizeLabels: Record<InteriorInput["roomSize"], string> = {
  small: "Small (about 10×10 ft)",
  medium: "Medium (about 12×12 ft)",
  large: "Large (about 15×16 ft)",
  open: "Open-plan area (400 sq ft or more)",
};

const HEIGHT_FACTOR = { standard: 1, tall: 1.15, vaulted: 1.35 } as const;
const CONDITION_FACTOR = { good: 1, minor: 1.12, major: 1.3 } as const;
// Exterior prep (scraping, priming bare wood, caulking) moves price more than interior patching.
const EXTERIOR_CONDITION_FACTOR = { good: 1, minor: 1.15, major: 1.35 } as const;
const STORY_FACTOR = { "1": 1, "2": 1.15, "3": 1.32 } as const;
const SIDING_FACTOR = {
  vinyl: 0.95,
  metal: 0.95,
  "fiber-cement": 1,
  stucco: 1.08,
  brick: 1.12,
  wood: 1.18,
} as const;

export const sidingLabels: Record<ExteriorInput["siding"], string> = {
  vinyl: "Vinyl",
  wood: "Wood or cedar",
  "fiber-cement": "Fiber cement (e.g. Hardie)",
  stucco: "Stucco",
  brick: "Brick (painted or to be painted)",
  metal: "Aluminum or steel",
};

export const conditionLabels: Record<InteriorInput["condition"], string> = {
  good: "Good: clean, little patching",
  minor: "Some repairs: nail holes, small cracks, light peeling",
  major: "Heavy prep: peeling, stains, damaged areas",
};

const INTERIOR_MIN = { low: 400, high: 650 };
const EXTERIOR_MIN = { low: 1500, high: 2400 };

const round50 = (n: number) => Math.round(n / 50) * 50;
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export function estimate(input: EstimateInput): Estimate {
  return input.scope === "interior" ? estimateInterior(input) : estimateExterior(input);
}

function estimateInterior(i: InteriorInput): Estimate {
  const rooms = clamp(Math.round(i.rooms), 1, 15);
  const floor = ROOM_FLOOR_SQFT[i.roomSize] * rooms;
  const perimeterFt = 4 * Math.sqrt(ROOM_FLOOR_SQFT[i.roomSize]) * rooms;
  const height = HEIGHT_FACTOR[i.ceilingHeight];
  const condition = CONDITION_FACTOR[i.condition];
  const coats = i.colorChange ? 1.15 : 1;
  const paint = i.premiumPaint ? 1.08 : 1;
  const mult = condition * coats * paint;

  const items: LineItem[] = [
    { label: `Walls, ${rooms} room${rooms > 1 ? "s" : ""}`, low: floor * 1.75 * height * mult, high: floor * 3.5 * height * mult },
  ];
  if (i.ceilings) items.push({ label: "Ceilings", low: floor * 0.75 * height * paint, high: floor * 1.5 * height * paint });
  if (i.trim) items.push({ label: "Baseboards and window/door casing", low: perimeterFt * 1, high: perimeterFt * 3 });
  const doors = clamp(Math.round(i.doors), 0, 30);
  if (doors > 0) items.push({ label: `${doors} door${doors > 1 ? "s" : ""} (both sides)`, low: doors * 75, high: doors * 150 });

  return finish("interior", items, INTERIOR_MIN, [
    `${rooms} × ${roomSizeLabels[i.roomSize].toLowerCase()}`,
    i.ceilingHeight === "standard" ? "8 ft ceilings" : i.ceilingHeight === "tall" ? "9–10 ft ceilings" : "Vaulted or two-story ceilings",
    conditionLabels[i.condition],
    i.colorChange ? "Big color change (extra coat allowed for)" : "Similar color (two coats)",
    i.premiumPaint ? "Premium paint line" : "Mid-grade paint",
  ]);
}

function estimateExterior(e: ExteriorInput): Estimate {
  const sqft = clamp(Math.round(e.homeSqft), 600, 8000);
  const stories = STORY_FACTOR[e.stories];
  const siding = SIDING_FACTOR[e.siding];
  const condition = EXTERIOR_CONDITION_FACTOR[e.condition];
  const paint = e.premiumPaint ? 1.08 : 1;
  const mult = stories * siding * condition * paint;

  const items: LineItem[] = [];
  if (e.trimOnly) {
    items.push({ label: "Trim, soffits and fascia only", low: sqft * 0.45 * stories * condition * paint, high: sqft * 0.95 * stories * condition * paint });
  } else {
    items.push({ label: "Body, trim, soffits and fascia", low: sqft * 1.4 * mult, high: sqft * 2.9 * mult });
  }
  if (e.frontDoor) items.push({ label: "Front door", low: 150, high: 350 });
  const garage = clamp(Math.round(e.garageDoors), 0, 4);
  if (garage > 0) items.push({ label: `${garage} garage door${garage > 1 ? "s" : ""}`, low: garage * 200, high: garage * 450 });
  const deck = clamp(Math.round(e.deckSqft), 0, 2000);
  if (deck > 0) items.push({ label: `Deck stain, ${deck} sq ft`, low: deck * 2, high: deck * 4.5 });

  return finish("exterior", items, EXTERIOR_MIN, [
    `${sqft.toLocaleString("en-US")} sq ft home, ${e.stories} stor${e.stories === "1" ? "y" : "ies"}`,
    `${sidingLabels[e.siding]} siding`,
    conditionLabels[e.condition],
    e.premiumPaint ? "Premium exterior paint line" : "Mid-grade exterior paint",
  ]);
}

function finish(scope: Scope, raw: LineItem[], min: { low: number; high: number }, assumptions: string[]): Estimate {
  const items = raw.map((it) => ({ ...it, low: round50(it.low), high: round50(it.high) }));
  const low = Math.max(min.low, items.reduce((s, it) => s + it.low, 0));
  const high = Math.max(min.high, items.reduce((s, it) => s + it.high, 0));
  return { scope, low: round50(low), high: round50(high), items, assumptions };
}

export const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/** Parse and validate estimator fields from a FormData (server) or plain record. */
export function parseEstimateInput(get: (k: string) => string | null): EstimateInput | null {
  const scope = get("scope");
  const num = (k: string, fallback = 0) => {
    const v = Number(get(k));
    return Number.isFinite(v) ? v : fallback;
  };
  const bool = (k: string) => get(k) === "on" || get(k) === "true";
  const pick = <T extends string>(k: string, allowed: readonly T[], fallback: T): T => {
    const v = get(k) as T | null;
    return v && allowed.includes(v) ? v : fallback;
  };

  if (scope === "interior") {
    return {
      scope,
      rooms: clamp(num("rooms", 1), 1, 15),
      roomSize: pick("roomSize", ["small", "medium", "large", "open"] as const, "medium"),
      ceilingHeight: pick("ceilingHeight", ["standard", "tall", "vaulted"] as const, "standard"),
      ceilings: bool("ceilings"),
      trim: bool("trim"),
      doors: clamp(num("doors", 0), 0, 30),
      condition: pick("condition", ["good", "minor", "major"] as const, "good"),
      colorChange: bool("colorChange"),
      premiumPaint: bool("premiumPaint"),
    };
  }
  if (scope === "exterior") {
    return {
      scope,
      homeSqft: clamp(num("homeSqft", 1800), 600, 8000),
      stories: pick("stories", ["1", "2", "3"] as const, "2"),
      siding: pick("siding", ["vinyl", "wood", "fiber-cement", "stucco", "brick", "metal"] as const, "vinyl"),
      condition: pick("condition", ["good", "minor", "major"] as const, "good"),
      trimOnly: bool("trimOnly"),
      frontDoor: bool("frontDoor"),
      garageDoors: clamp(num("garageDoors", 0), 0, 4),
      deckSqft: clamp(num("deckSqft", 0), 0, 2000),
      premiumPaint: bool("premiumPaint"),
    };
  }
  return null;
}

/** Published figures the model and the cost guide cite. */
export const costSources = [
  {
    id: "nerdwallet",
    name: "NerdWallet, Cost to Paint a House in 2026 (citing Angi 2026 data)",
    url: "https://www.nerdwallet.com/home-ownership/home-improvement/learn/save-on-cost-to-paint-a-house",
  },
  {
    id: "angi-interior",
    name: "Angi, How Much Does It Cost to Paint the Interior of a House?",
    url: "https://www.angi.com/articles/how-much-does-it-cost-paint-interior-house.htm",
  },
  {
    id: "angi-room",
    name: "Angi, How Much Does It Cost to Paint a Room?",
    url: "https://www.angi.com/articles/how-much-does-it-cost-paint-room.htm",
  },
  {
    id: "homewyse",
    name: "HomeWyse, Cost to Paint House Exterior",
    url: "https://www.homewyse.com/services/cost_to_paint_house_exterior.html",
  },
] as const;

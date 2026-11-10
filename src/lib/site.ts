/**
 * Site-wide facts. Everything a buyer or renter of the site would change
 * lives here or in environment variables (see .env.example).
 */
export const site = {
  name: "Papillion Painters",
  domain: "papillionpainters.com",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://papillionpainters.com").replace(/\/$/, ""),
  city: "Papillion",
  state: "Nebraska",
  stateCode: "NE",
  county: "Sarpy County",
  zips: ["68046", "68133"],
  /** Public contact address (privacy page, Organization schema). Mailbox confirmed 2026-11-10. */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@ntechdigitalsolutions.com",
  /** Painter-facing "Book a call" link. Override with NEXT_PUBLIC_BOOKING_URL. */
  bookingUrl:
    process.env.NEXT_PUBLIC_BOOKING_URL ||
    "https://calendar.ntechdigitalsolutions.com/widget/booking/hWquGYSIsA9rDZFT0PAF",
  /** Date the painter articles were last reviewed. Update when the content changes. */
  lastReviewed: "2026-11-04",
  /** The company that runs this site. Shown in the footer and in the Organization schema. */
  operator: {
    name: "N-Tech Digital Solutions",
    url: "https://ntechdigital.solutions",
  },
} as const;

/** Footer "Who runs this site" text. Keep it factual; don't add vetting claims until they're real. */
export const operatorNote =
  "Papillion Painters is run by N-Tech Digital Solutions, a web design and SEO company. We built this site to connect Papillion homeowners with local painters, and to show painting companies the kind of search results we can get them. The painters we refer you to are independent businesses, not N-Tech employees, and some may also be N-Tech clients.";

export const disclosure =
  "Papillion Painters is a referral service. We are not a painting company and we don't do any painting. When you request a quote, we pass your details to an independent local painter, who contacts you directly. You decide whether to hire them.";

export type ServiceKey =
  | "interior"
  | "exterior"
  | "cabinets"
  | "deck-fence"
  | "trim-doors"
  | "drywall"
  | "commercial"
  | "other";

/** The project types offered on the homeowner quote form. */
export const projectTypes = [
  { key: "interior", name: "Interior" },
  { key: "exterior", name: "Exterior" },
  { key: "cabinets", name: "Cabinets" },
  { key: "other", name: "Other" },
] as const;

export const timelines = ["As soon as possible", "Within 1–2 months", "In 3+ months", "Just getting prices"] as const;

/** Shown directly under the quote button. */
export const smsConsent =
  "By submitting, you agree that one independent local painter, and Papillion Painters, may contact you by text and phone about your request. Message and data rates may apply. Reply STOP to opt out.";

export const services: { key: ServiceKey; name: string; blurb: string }[] = [
  { key: "interior", name: "Interior painting", blurb: "Walls, ceilings, trim and doors, one room or the whole house." },
  { key: "exterior", name: "Exterior painting", blurb: "Siding, trim, soffits, fascia and front doors." },
  { key: "cabinets", name: "Cabinet painting", blurb: "Kitchen and bath cabinets, sprayed or brushed." },
  { key: "deck-fence", name: "Deck and fence staining", blurb: "Cleaning, sealing and staining wood outdoors." },
  { key: "trim-doors", name: "Trim, doors and railings", blurb: "Baseboards, casing, stair rails and doors." },
  { key: "drywall", name: "Drywall repair before painting", blurb: "Patches, cracks and nail pops fixed before paint." },
  { key: "commercial", name: "Small commercial", blurb: "Offices, rentals and storefronts." },
  { key: "other", name: "Something else", blurb: "Tell us what you need." },
];

export const nav = {
  home: { href: "/", label: "Home" },
  cost: { href: "/interior-exterior-painting-papillion", label: "Painting costs" },
  painterWebsites: { href: "/websites-for-painting-companies", label: "Websites for painters" },
  painterLeads: { href: "/how-to-get-painting-leads", label: "How to get painting leads" },
  privacy: { href: "/privacy", label: "Privacy" },
} as const;

/**
 * Publish and update dates for each indexable page (YYYY-MM-DD).
 * The sitemap's <lastmod> and the Article schema's dateModified both read
 * from here, so bump `updated` once, whenever a page's content meaningfully
 * changes (for example after adding a ranking-log row).
 */
export const pageDates: Record<string, { published: string; updated: string }> = {
  "/": { published: "2026-11-05", updated: "2026-11-09" },
  "/interior-exterior-painting-papillion": { published: "2026-11-05", updated: "2026-11-09" },
  "/websites-for-painting-companies": { published: "2026-11-05", updated: "2026-11-09" },
  "/how-to-get-painting-leads": { published: "2026-11-05", updated: "2026-11-09" },
  "/privacy": { published: "2026-11-05", updated: "2026-11-09" },
};

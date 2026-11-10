import type { MetadataRoute } from "next";
import { pageDates } from "@/lib/page-dates";
import { site } from "@/lib/site";

/**
 * XML sitemap, served at /sitemap.xml and referenced from /robots.txt.
 *
 * Dates come from `src/lib/page-dates.ts`. Bump a page's `updated` date there
 * whenever its content meaningfully changes (Google uses <lastmod> to decide
 * when to re-crawl, and ignores it if it's always "today"). changefreq and
 * priority are left out because Google ignores both. Only indexable pages
 * belong here: the quote thank-you page is noindex and deliberately left out.
 *
 * URLs use the canonical domain (site.url), not the vercel.app address.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return Object.entries(pageDates).map(([path, d]) => ({
    url: `${site.url}${path}`,
    lastModified: d.updated,
  }));
}

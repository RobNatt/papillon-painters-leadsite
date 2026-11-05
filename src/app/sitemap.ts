import type { MetadataRoute } from "next";
import { nav, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = site.lastReviewed;
  return [
    { url: `${site.url}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}${nav.cost.href}`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}${nav.painterWebsites.href}`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}${nav.painterLeads.href}`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}${nav.privacy.href}`, lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];
}

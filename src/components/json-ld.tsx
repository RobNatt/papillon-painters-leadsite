import { pageDates } from "@/lib/page-dates";
import { site } from "@/lib/site";

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const orgId = `${site.url}/#organization`;

/**
 * Organization, not LocalBusiness: we have no storefront address and we don't
 * perform the work. The description says plainly that this is a referral service.
 */
export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": orgId,
  name: site.name,
  url: site.url,
  description:
    "A referral service that connects homeowners in Papillion, Nebraska with independent local painters. Papillion Painters is not a painting company and does not perform painting work. It is run by N-Tech Digital Solutions.",
  logo: `${site.url}/icon`,
  email: site.contactEmail,
  parentOrganization: {
    "@type": "Organization",
    name: site.operator.name,
    url: site.operator.url,
  },
  areaServed: [
    {
      "@type": "City",
      name: "Papillion",
      containedInPlace: { "@type": "AdministrativeArea", name: "Sarpy County, Nebraska" },
    },
    { "@type": "AdministrativeArea", name: "Sarpy County, Nebraska" },
  ],
  knowsAbout: ["Painting contractor referrals", "Painting costs in Nebraska", "Local SEO for painting companies"],
};

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  url: site.url,
  name: site.name,
  publisher: { "@id": orgId },
  inLanguage: "en-US",
};

export function faqLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.path}`,
    })),
  };
}

/**
 * Article node for a content page. Dates come from `pageDates`, the image is
 * the page's generated Open Graph card, and the description should match the
 * page's meta description.
 */
export function articleLd(opts: {
  path: string;
  headline: string;
  description: string;
  about?: string[];
  citation?: string[];
}) {
  const url = `${site.url}${opts.path}`;
  const dates = pageDates[opts.path];
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: opts.headline,
    description: opts.description,
    ...(opts.about ? { about: opts.about } : {}),
    image: `${url}/opengraph-image`,
    author: { "@id": orgId },
    publisher: { "@id": orgId },
    datePublished: dates.published,
    dateModified: dates.updated,
    mainEntityOfPage: { "@type": "WebPage", "@id": url, isPartOf: { "@id": `${site.url}/#website` } },
    ...(opts.citation ? { citation: opts.citation } : {}),
  };
}

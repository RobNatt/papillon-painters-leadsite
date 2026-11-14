import Link from "next/link";
import { disclosure, nav, operatorNote, site } from "@/lib/site";
import { Wordmark } from "./site-header";

/** Strip for painting-company owners, above the footer on homeowner pages. */
export function PainterStrip() {
  return (
    <aside aria-labelledby="painter-strip" className="on-chip bg-chip-charcoal text-white">
      <div className="mx-auto grid max-w-site gap-8 px-gutter py-section-sm md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="label text-white/70" data-reveal>For painting companies</p>
          <h2 id="painter-strip" className="mt-4 text-h2 wdth-104" data-split>
            You found this page. Your customers could find yours.
          </h2>
        </div>
        <div className="grid gap-4 md:col-span-5" data-reveal-group>
          <p className="text-white/80" data-reveal>
            We built this site to rank for Papillion painting searches. We do the same for painting companies.
          </p>
          <p data-reveal>
            <Link className="tlink text-white" href={nav.painterWebsites.href}>
              See how we build websites for painters →
            </Link>
          </p>
        </div>
      </div>
    </aside>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-primer-deep">
      <div className="mx-auto grid max-w-site gap-12 px-gutter py-16 md:grid-cols-12">
        <div className="grid content-start gap-5 md:col-span-5">
          <Wordmark />
          <p className="max-w-measure text-small text-graphite">{disclosure}</p>
          <section aria-labelledby="who-runs-this-site" className="grid gap-2">
            <h2 id="who-runs-this-site" className="label text-graphite">Who runs this site</h2>
            <p className="max-w-measure text-small text-graphite">
              {operatorNote}{" "}
              <a className="tlink" href={site.operator.url} rel="noopener">
                Visit {site.operator.name}
              </a>
            </p>
          </section>
        </div>
        <nav aria-label="Homeowners" className="grid content-start gap-0 text-small md:col-span-3 md:col-start-7">
          <p className="label mb-2 text-graphite">Homeowners</p>
          <Link className="tlink tap justify-self-start" href="/">Painters in Papillion, NE</Link>
          <Link className="tlink tap justify-self-start" href={nav.cost.href}>Interior &amp; exterior painting costs</Link>
          <Link className="tlink tap justify-self-start" href={`${nav.cost.href}#estimator`}>Room color visualizer &amp; estimate</Link>
          <Link className="tlink tap justify-self-start" href="/#quote">Request a free quote</Link>
          <Link className="tlink tap justify-self-start" href="/blog">House painting guides</Link>
        </nav>
        <nav aria-label="Painting companies" className="grid content-start gap-0 text-small md:col-span-3">
          <p className="label mb-2 text-graphite">Painting companies</p>
          <Link className="tlink tap justify-self-start" href={nav.painterWebsites.href}>Websites for painting companies</Link>
          <Link className="tlink tap justify-self-start" href={nav.painterLeads.href}>How to get painting leads</Link>
          <Link className="tlink tap justify-self-start" href={nav.privacy.href}>Privacy</Link>
        </nav>
      </div>
      <div className="mx-auto flex max-w-site flex-wrap justify-between gap-4 border-t border-line px-gutter py-6 text-small text-graphite">
        <p>{site.domain} · Serving {site.city}, {site.stateCode} and nearby Sarpy County</p>
        <p>Not a painting contractor. No work is performed by this site.</p>
      </div>
    </footer>
  );
}

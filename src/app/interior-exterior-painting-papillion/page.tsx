import type { Metadata } from "next";
import Link from "next/link";
import { FaqList, type Faq } from "@/components/faq";
import { breadcrumbLd, JsonLd, orgId } from "@/components/json-ld";
import { PageTransition } from "@/components/page-transition";
import { ZoomImage } from "@/components/zoom-image";
import { QuoteForm } from "@/components/quote-form";
import { PainterStrip } from "@/components/site-footer";
import { EstimateStudio } from "@/components/studio/estimate-studio";
import { ButtonLink, Container, HeroHeadline, SectionHead } from "@/components/ui";
import { images } from "@/content/images";
import { costSources } from "@/lib/estimate";
import { nav, site } from "@/lib/site";

const path = nav.cost.href;

export const metadata: Metadata = {
  title: { absolute: "Exterior Painting Cost in Papillion, NE (2026) | Interior Prices Too" },
  description:
    "What exterior and interior painting costs in Papillion, Nebraska: published price ranges, what drives the price, and a free photo color visualizer that emails you a planning estimate.",
  alternates: { canonical: path },
};


function Cite({ id, n }: { id: (typeof costSources)[number]["id"]; n: number }) {
  return (
    <sup>
      <a href={`#source-${id}`} className="ml-0.5 font-mono text-[0.7em] no-underline" aria-label={`Source ${n}`}>
        [{n}]
      </a>
    </sup>
  );
}

/** Whole-job totals on one shared dollar axis. One series, so one hue and direct labels. */
const ranges = [
  { label: "Exterior repaint, typical home", low: 1819, high: 4551, avg: 3178, cite: "nerdwallet" as const, n: 1 },
  { label: "Interior, whole house", low: 1000, high: 3000, avg: 2021, cite: "nerdwallet" as const, n: 1, note: "“just under $1,000 to over $3,000”" },
];
const AXIS_MAX = 5000;

const faqs: Faq[] = [
  {
    q: "How much does exterior painting cost?",
    a: "A typical professional exterior paint job costs about $1,800 to $4,550 nationally. The average is around $3,180 (Angi data reported by NerdWallet). By painted surface, HomeWyse estimates about $2.20 to $4.37 per square foot. Two stories, wood siding and heavy scraping push it up.",
  },
  {
    q: "How much does it cost to paint a room?",
    a: "Interior painting typically runs $2 to $6 per square foot (Angi). Labor is often $20 to $50 an hour. A medium bedroom with walls, ceiling and trim usually lands in the mid hundreds. Our estimator gives a range for your rooms.",
  },
  {
    q: "Why do painting quotes vary so much?",
    a: "Most of a quote is labor, and most labor is prep: moving furniture, patching, scraping, caulking and priming. Quotes can also assume different coats or paint lines. Ask each painter to list prep, coats and the exact product. Then compare.",
  },
  {
    q: "Can vinyl siding be painted?",
    a: "Usually, yes, with a paint made for vinyl. Watch the color. Dark colors absorb heat and can warp vinyl. Paint makers publish vinyl-safe color lists. Ask the painter which colors are safe before you choose.",
  },
  {
    q: "Is the estimate from your visualizer a quote?",
    a: "No. It's a planning range from national pricing data and the details you enter. A painter sets the real price after seeing the job. Papillion Painters is a referral service and doesn't paint.",
  },
];

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Exterior painting cost in Papillion, NE, plus interior prices",
  about: ["Exterior painting cost", "Interior painting cost", "Papillion, Nebraska"],
  author: { "@id": orgId },
  publisher: { "@id": orgId },
  dateModified: site.lastReviewed,
  mainEntityOfPage: `${site.url}${path}`,
  citation: costSources.map((s) => s.url),
};

export default function CostPage() {
  return (
    <PageTransition>
      {/* ---------------- Hero ---------------- */}
      <section aria-labelledby="hero-title" className="overflow-hidden" data-parallax-root>
        <Container className="grid gap-12 pb-section-sm pt-14 lg:grid-cols-12 lg:gap-8 lg:pt-20">
          <div className="grid content-start gap-8 lg:col-span-7">
            <nav aria-label="Breadcrumb" className="label hero-fade text-graphite">
              <Link className="tlink" href="/">Home</Link> <span aria-hidden="true">/</span> Painting costs
            </nav>
            <HeroHeadline lines={["Exterior painting", "cost in Papillion,", "and interior too."]} className="text-h1 wdth-112" />
            <p className="hero-fade max-w-[44ch] text-lead text-graphite" style={{ "--i": 3 } as React.CSSProperties}>
              Published price ranges and what moves them. Plus a free tool that tries colors on your room and emails you
              an estimate.
            </p>
            {/* Short answer first: what searchers and AI answers need. */}
            <div className="hero-fade grid gap-3 border-l-4 border-tape bg-chalk p-6" style={{ "--i": 4 } as React.CSSProperties}>
              <p className="label text-graphite">Short answer</p>
              <p>
                A typical exterior repaint costs about <strong>$1,800 to $4,550</strong>. The average is about $3,180.
                <Cite id="nerdwallet" n={1} /> Interior painting runs about <strong>$2 to $6 per square foot</strong>.
                <Cite id="angi-interior" n={2} /> A whole-house interior averages about $2,020.<Cite id="nerdwallet" n={1} />{" "}
                These are national figures. A Papillion painter&rsquo;s on-site quote is the real number.
              </p>
            </div>
            <div className="hero-fade flex flex-wrap gap-4" style={{ "--i": 5 } as React.CSSProperties}>
              <ButtonLink href="#estimator">Get my estimate</ButtonLink>
            </div>
          </div>
          <div aria-hidden="true" className="relative hidden aspect-[4/5] overflow-hidden lg:col-span-5 lg:block">
            <div className="absolute inset-x-0 -top-[8%] h-[116%] lg:will-change-transform" data-parallax="0.1">
              <ZoomImage slot={images.heroCost} priority sizes="(min-width: 1024px) 40vw, 1px" decorative className="h-full w-full" />
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------- Price ranges ---------------- */}
      <section aria-labelledby="ranges-title" className="bg-primer-deep py-section">
        <Container className="grid gap-12">
          <SectionHead
            eyebrow="Published price ranges"
            id="ranges-title"
            title="What painting jobs cost nationally"
            intro={<p>Most online numbers are national. Use them to check a quote, not to replace one.</p>}
          />
          <figure className="grid gap-6 bg-chalk p-6 sm:p-8" data-reveal>
            <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-h3 wdth-104">Typical total cost, whole job</span>
              <span className="text-small text-graphite">US dollars · bar = typical range · tick = average</span>
            </figcaption>
            <div className="grid gap-8" data-reveal-group>
              {ranges.map((r) => (
                <div key={r.label} className="grid gap-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-semibold">{r.label}</span>
                    <span className="text-small">
                      ${r.low.toLocaleString()} – ${r.high.toLocaleString()}
                      <span className="text-graphite"> · avg ${r.avg.toLocaleString()}</span>
                      <Cite id={r.cite} n={r.n} />
                    </span>
                  </div>
                  <div className="relative h-3 bg-primer-deep" title={`${r.label}: $${r.low.toLocaleString()} to $${r.high.toLocaleString()}, average $${r.avg.toLocaleString()}`}>
                    <div
                      data-reveal="draw"
                      className="absolute inset-y-0 rounded-[4px] bg-chip-navy"
                      style={{ left: `${(r.low / AXIS_MAX) * 100}%`, width: `${((r.high - r.low) / AXIS_MAX) * 100}%` }}
                    />
                    <div className="absolute -inset-y-1.5 w-0.5 bg-tape" style={{ left: `${(r.avg / AXIS_MAX) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div aria-hidden="true" className="flex justify-between border-t border-line pt-2 font-mono text-[0.7rem] text-graphite">
              <span>$0</span>
              <span>$1,000</span>
              <span>$2,000</span>
              <span>$3,000</span>
              <span>$4,000</span>
              <span>$5,000</span>
            </div>
          </figure>
          <dl className="grid gap-5 sm:grid-cols-3" data-reveal-group>
            {[
              { k: "Exterior, per sq ft of painted surface", v: "$2.20 – $4.37", id: "homewyse" as const, n: 4 },
              { k: "Interior, per sq ft of home", v: "$2 – $6", id: "angi-interior" as const, n: 2 },
              { k: "Painter labor, per hour", v: "$20 – $50", id: "angi-room" as const, n: 3 },
            ].map((s) => (
              <div key={s.k} className="grid gap-2 border-t-2 border-ink pt-5" data-reveal>
                <dt className="text-small text-graphite">{s.k}</dt>
                <dd className="text-h2 wdth-104">
                  {s.v}
                  <Cite id={s.id} n={s.n} />
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ---------------- Interior vs exterior ---------------- */}
      <section aria-labelledby="drivers-title" className="py-section">
        <Container className="grid gap-12">
          <SectionHead
            eyebrow="What drives the price"
            id="drivers-title"
            title="Prep is most of the price"
            intro={<p>Paint is the smaller part of a quote. Hours are the bigger part. These set the hours.</p>}
          />
          <div className="grid gap-5 lg:grid-cols-2">
            <article id="exterior" aria-labelledby="ext-title" className="on-chip relative grid scroll-mt-24 gap-6 overflow-hidden bg-chip-forest p-8 text-white sm:p-10" data-reveal="left">
              <span className="label text-white/75">PP-02 · Exterior</span>
              <h3 id="ext-title" className="text-h2 wdth-104">Exterior painting cost drivers</h3>
              <ul className="grid gap-4 pr-16 text-white/90">
                <li><strong className="text-white">Height and stories.</strong> A two-story home or walkout basement means ladders, lifts and slower work.</li>
                <li><strong className="text-white">Siding type.</strong> Rough cedar soaks up paint. Vinyl is quicker but needs vinyl-safe colors.</li>
                <li><strong className="text-white">Condition.</strong> Peeling paint, failed caulk and bare wood need scraping, sealing and primer first.</li>
                <li><strong className="text-white">Trim detail.</strong> Soffits, fascia, shutters and window trim are slow, careful brush work.</li>
                <li><strong className="text-white">Paint line.</strong> Premium paint costs more per gallon. It can also last longer.</li>
              </ul>
              <span aria-hidden="true" className="text-vertical absolute bottom-6 right-4 text-[clamp(3rem,6vw,5rem)] font-semibold leading-[0.9] text-white/20 wdth-72">Exterior</span>
            </article>
            <article id="interior" aria-labelledby="int-title" className="on-chip relative grid scroll-mt-24 gap-6 overflow-hidden bg-chip-plum p-8 text-white sm:p-10" data-reveal="right">
              <span className="label text-white/75">PP-03 · Interior</span>
              <h3 id="int-title" className="text-h2 wdth-104">Interior painting cost drivers</h3>
              <ul className="grid gap-4 pr-16 text-white/90">
                <li><strong className="text-white">What&rsquo;s included.</strong> Walls only, or ceilings, trim and doors too. Each adds hours.</li>
                <li><strong className="text-white">Ceiling height.</strong> Vaulted living rooms and stairwells need tall ladders or scaffolding.</li>
                <li><strong className="text-white">Repairs.</strong> Nail holes are quick. Cracks, stains and patches need primer first.</li>
                <li><strong className="text-white">Color change.</strong> Deep red to off-white, or the reverse, can take an extra coat.</li>
                <li><strong className="text-white">Furniture and access.</strong> A furnished room takes longer to protect than an empty one.</li>
              </ul>
              <span aria-hidden="true" className="text-vertical absolute bottom-6 right-4 text-[clamp(3rem,6vw,5rem)] font-semibold leading-[0.9] text-white/20 wdth-72">Interior</span>
            </article>
          </div>
        </Container>
      </section>

      {/* ---------------- Estimator ---------------- */}
      <section id="estimator" aria-labelledby="estimator-title" className="scroll-mt-20 border-y border-line bg-chalk py-section">
        <Container className="grid gap-12">
          <SectionHead
            eyebrow="Free color visualizer + estimate"
            id="estimator-title"
            title="Try a color on your room, then get your price range"
            intro={
              <p>
                Photograph the room or your house. Tap the walls and try colors. Then describe the job, and we&rsquo;ll
                email you a price range. Your photo stays on your device unless you send it.
              </p>
            }
          />
          <EstimateStudio />
        </Container>
      </section>

      {/* ---------------- Prep checklist ---------------- */}
      <section aria-labelledby="compare-title" className="py-section">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead eyebrow="Comparing quotes" id="compare-title" title="What a good painting estimate spells out" />
            <p className="mt-6 max-w-measure text-graphite" data-reveal>
              Quotes that are far apart usually cover different work. Ask every painter to write these down. Then
              you&rsquo;re comparing the same job.
            </p>
          </div>
          <ol className="grid gap-0 border-t border-line lg:col-span-6 lg:col-start-7" data-reveal-group>
            {[
              ["Surfaces included", "Walls, ceilings, trim, doors, soffits, fascia: listed one by one."],
              ["Prep steps", "Washing, scraping, sanding, caulking, patching and spot-priming."],
              ["Product and coats", "The exact paint line and sheen, and how many coats."],
              ["Protection and cleanup", "How floors, furniture, plants and fixtures are covered, and daily cleanup."],
              ["Schedule and weather", "Start date, how many days, and what happens if it rains."],
              ["Warranty and insurance", "Warranty terms in writing, plus proof of liability insurance."],
              ["Lead-safe practices", "For homes built before 1978, the painter's EPA Lead-Safe certification."],
            ].map(([t, b], i) => (
              <li key={t} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-4 border-b border-line py-5" data-reveal>
                <span className="font-mono text-small text-graphite">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <strong className="block">{t}</strong>
                  <span className="text-graphite">{b}</span>
                </span>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <FaqList faqs={faqs} title="Painting cost questions" />

      {/* ---------------- Quote ---------------- */}
      <section id="quote" aria-labelledby="quote-title" className="on-chip scroll-mt-20 bg-chip-navy py-section text-white">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="grid content-start gap-6 lg:col-span-5">
            <p className="label text-white/70" data-reveal>Get the real number</p>
            <h2 id="quote-title" className="text-h1 wdth-108" data-split>
              Ask a Papillion painter for an exact price
            </h2>
            <p className="max-w-[36ch] text-lead text-white/80" data-reveal>
              One local painter sets up a free walk-through. You get a written quote.
            </p>
          </div>
          <div className="bg-chalk p-6 text-ink sm:p-8 lg:col-span-6 lg:col-start-7" data-reveal>
            <QuoteForm source="cost-guide" headingLevel="h3" />
          </div>
        </Container>
      </section>

      {/* ---------------- Sources ---------------- */}
      <section aria-labelledby="sources-title" className="py-section-sm">
        <Container className="grid gap-4">
          <h2 id="sources-title" className="label text-graphite">Sources</h2>
          <ol className="grid gap-2 text-small text-graphite">
            {costSources.map((s, i) => (
              <li key={s.id} id={`source-${s.id}`} className="scroll-mt-24">
                [{i + 1}] <a className="underline decoration-tape underline-offset-2" href={s.url} rel="noopener" target="_blank">{s.name}</a>
              </li>
            ))}
          </ol>
          <p className="max-w-measure text-small text-graphite">
            Figures checked {new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(site.lastReviewed))}.
            Prices are national ranges. They aren&rsquo;t quotes, and they aren&rsquo;t specific to Papillion.
          </p>
        </Container>
      </section>

      <PainterStrip />
      <JsonLd
        data={[
          articleLd,
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Painting costs", path },
          ]),
        ]}
      />
    </PageTransition>
  );
}

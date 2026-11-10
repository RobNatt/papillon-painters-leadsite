import type { Metadata } from "next";
import Link from "next/link";
import { FaqList, type Faq } from "@/components/faq";
import { HowItWorks } from "@/components/how-it-works";
import { HeroUnveil } from "@/components/hero-unveil";
import { JsonLd, orgId } from "@/components/json-ld";
import { Marquee } from "@/components/marquee";
import { PageTransition } from "@/components/page-transition";
import { PainterStrip } from "@/components/site-footer";
import { TrustBar } from "@/components/trust-bar";
import { ButtonLink, Container, SectionHead } from "@/components/ui";
import { ZoomImage } from "@/components/zoom-image";
import { images } from "@/content/images";
import { nav, services, site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Painters in Papillion, NE | Free Referral, Not a Contractor" },
  description:
    "Free referral service, not a contractor. Describe your interior or exterior job once and one independent painter in Papillion, NE contacts you with a quote.",
  alternates: { canonical: "/" },
};

const faqs: Faq[] = [
  {
    q: "Are you a painting company?",
    a: "No. Papillion Painters is a referral service. We don't employ painters or do any painting. We pass your request to an independent local painter. They quote, schedule and do the work, and your contract is with them.",
  },
  {
    q: "What does it cost to use this site?",
    a: "Nothing. A quote request is free, and you never have to hire anyone. Painters may pay us for introductions. That never changes the price you're quoted.",
  },
  {
    q: "How many painters will contact me?",
    a: "One. We send each request to a single local painter. We don't sell it to a list, so your phone won't ring all week.",
  },
  {
    q: "How much does it cost to paint a house in Papillion?",
    a: "National figures put a typical exterior repaint at about $1,800 to $4,500. Larger and two-story homes run higher. Interior work runs about $2 to $6 per square foot. Prep, height, siding and paint choice move the price most. Our cost guide and estimator give you a planning range first.",
  },
  {
    q: "When is the best time to paint a house exterior in Nebraska?",
    a: "Usually late spring through early fall. Most exterior paint needs about 50°F or warmer and a dry forecast while it cures. Some products are rated lower. Spring and fall calendars fill first, so ask early.",
  },
  {
    q: "My house was built before 1978. Does that matter?",
    a: "Yes. Homes built before 1978 may have lead-based paint. The EPA's Renovation, Repair and Painting rule covers work that disturbs it. Painters must be EPA Lead-Safe certified and follow lead-safe practices. Ask to see the certification.",
  },
  {
    q: "What should I check before hiring a painter?",
    a: "Ask for proof of liability insurance, plus workers' compensation if they have employees. Get a written estimate that lists the prep and the paint product. Get the warranty in writing. Nebraska contractors must register with the Department of Labor, and you can look them up on its website.",
  },
];

const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${site.url}/#homeowner-referral`,
  url: `${site.url}/`,
  name: "Painter referral service in Papillion, NE",
  serviceType: "Referral to independent residential painters",
  provider: { "@id": orgId },
  audience: { "@type": "Audience", audienceType: "Homeowners" },
  areaServed: {
    "@type": "City",
    name: "Papillion",
    containedInPlace: { "@type": "AdministrativeArea", name: "Sarpy County, Nebraska" },
  },
  description:
    "Free referral service: homeowners in Papillion describe their painting job once, and the request is passed to one independent local painter who provides the quote and performs the work. Papillion Painters does not paint.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Free for homeowners" },
};

export default function Home() {
  return (
    <PageTransition>
      {/* ---------------- Hero (three-stage scroll sequence) ---------------- */}
      <HeroUnveil />

      <TrustBar />

      {/* ---------------- Referral statement ---------------- */}
      <section aria-labelledby="who-title" className="relative isolate overflow-hidden py-section" data-paint-section="light">
        <canvas className="paint-canvas" aria-hidden="true" data-paint-canvas />
        <Container className="relative z-[1] grid gap-10 lg:grid-cols-12">
          <p className="label text-graphite lg:col-span-3" data-reveal>Who we are</p>
          <div className="grid gap-8 lg:col-span-8">
            <h2 id="who-title" className="text-h1 wdth-108" data-split data-paint-headline>
              We&rsquo;re not painters. We know which painter to call.
            </h2>
            <div className="grid max-w-measure gap-5 text-lead text-graphite" data-reveal>
              <p>
                Most quote sites sell your request to six companies. We send it to <strong className="text-ink">one</strong>{" "}
                independent painter who works in Papillion and Sarpy County.
              </p>
              <p>They quote, schedule and do the work. We never touch a brush. We never charge homeowners.</p>
            </div>
          </div>
        </Container>
      </section>

      <HowItWorks />

      {/* ---------------- Services ---------------- */}
      <section aria-labelledby="services-title" className="py-section">
        <Container className="grid gap-14">
          <SectionHead
            eyebrow="What painters quote"
            id="services-title"
            title="Interior, exterior and everything in between"
            intro={<p>Most requests are walls or siding. Painters also take cabinets, decks, trim and small commercial jobs.</p>}
          />

          <div className="grid gap-5 md:grid-cols-2" data-reveal-group>
            <ServiceBlock
              href={`${nav.cost.href}#interior`}
              chip="PP-03"
              name="Interior"
              tone="bg-chip-plum"
              slot={images.interior}
              lines={["Walls, ceilings, trim and doors", "One room or the whole house", "Color changes and drywall touch-ups"]}
              reveal="left"
            />
            <ServiceBlock
              href={`${nav.cost.href}#exterior`}
              chip="PP-02"
              name="Exterior"
              tone="bg-chip-forest"
              slot={images.exterior}
              lines={["Siding, trim, soffits and fascia", "Scraping, caulking and priming", "Front doors and garage doors"]}
              reveal="right"
            />
          </div>

          <ul className="grid border-t border-line sm:grid-cols-2 lg:grid-cols-3" data-reveal-group>
            {services
              .filter((s) => !["interior", "exterior", "other"].includes(s.key))
              .map((s) => (
                <li key={s.key} className="grid gap-1 border-b border-line py-6 pr-6" data-reveal>
                  <h3 className="text-h3 wdth-104">{s.name}</h3>
                  <p className="text-graphite">{s.blurb}</p>
                </li>
              ))}
          </ul>
        </Container>
      </section>

      {/* ---------------- Project types band ---------------- */}
      <section aria-label="Project types painters quote" className="border-y border-line py-8 lg:py-10">
        <Marquee label="Project types painters quote" speed={36} groupClassName="gap-8 pr-8 lg:gap-12 lg:pr-12">
          {["Interior", "Exterior", "Cabinets", "Decks", "Trim", "Small commercial"].map((w) => (
            <li key={w} className="flex items-center gap-8 whitespace-nowrap text-h1 font-semibold wdth-112 lg:gap-12">
              <span>{w}</span>
              <span aria-hidden="true" className="h-3 w-3 flex-none rounded-full bg-tape" />
            </li>
          ))}
        </Marquee>
      </section>

      {/* ---------------- Visualizer teaser ---------------- */}
      <section aria-labelledby="viz-title" className="bg-primer-deep py-section">
        <Container className="grid items-center gap-12 lg:grid-cols-12">
          <div className="grid gap-6 lg:col-span-6">
            <p className="label text-graphite" data-reveal>Before you call anyone</p>
            <h2 id="viz-title" className="text-h1 wdth-108" data-split>
              See the color on your own walls. Then see the price.
            </h2>
            <p className="max-w-measure text-lead text-graphite" data-reveal>
              Upload a photo. Tap a wall. Try a color. Answer a few questions and we&rsquo;ll email you a price range.
              Your photo stays on your device unless you send it.
            </p>
            <div data-reveal>
              <ButtonLink href={`${nav.cost.href}#estimator`}>Try the visualizer</ButtonLink>
            </div>
          </div>
          <FanDeck />
        </Container>
      </section>

      {/* ---------------- Painting in Papillion ---------------- */}
      <section aria-labelledby="local-title" className="pt-section">
        <Container className="grid gap-14">
          <SectionHead
            eyebrow="Painting in Papillion"
            id="local-title"
            title="What Nebraska weather does to paint"
            intro={<p>Hot, humid summers. Hard freezes. Spring hail. Good painters plan around all three.</p>}
          />
          <div className="grid gap-x-8 gap-y-12 md:grid-cols-3" data-reveal-group>
            {[
              {
                t: "Freeze and thaw",
                b: "Water gets behind failed caulk, freezes and pushes paint off. That's why most of an exterior quote is prep: scraping, sealing and priming.",
              },
              {
                t: "A short exterior season",
                b: "Most exterior paint needs about 50°F and a dry forecast to cure. Here, that means late spring to early fall. Good painters book up early.",
              },
              {
                t: "HOA color rules",
                b: "Many newer Papillion neighborhoods approve exterior colors. Get written approval before the painter orders paint.",
              },
            ].map((x) => (
              <div key={x.t} className="grid content-start gap-3 border-t-2 border-ink pt-6" data-reveal>
                <h3 className="text-h3 wdth-104">{x.t}</h3>
                <p className="text-graphite">{x.b}</p>
              </div>
            ))}
          </div>
          <p className="max-w-measure text-graphite" data-reveal>
            Wondering what your job costs?{" "}
            <Link className="tlink text-ink" href={nav.cost.href}>Read the painting cost guide</Link>.
          </p>
        </Container>
      </section>

      <FaqList faqs={faqs} tight />

      {/* ---------------- Closing CTA ---------------- */}
      <section aria-labelledby="cta-title" className="on-chip relative isolate overflow-hidden bg-chip-navy text-white" data-paint-section="dark">
        <canvas className="paint-canvas" aria-hidden="true" data-paint-canvas />
        <Container className="relative z-[1] grid gap-8 py-section lg:grid-cols-12 lg:items-end">
          <h2 id="cta-title" className="text-h1 wdth-108 lg:col-span-8" data-split data-paint-headline>
            Ready for a real price? Ask a Papillion painter.
          </h2>
          <div className="flex flex-wrap gap-4 lg:col-span-4 lg:justify-end" data-reveal>
            <ButtonLink href="#quote">Get my free quote</ButtonLink>
          </div>
        </Container>
      </section>

      <PainterStrip />
      <JsonLd data={serviceLd} />
    </PageTransition>
  );
}

function ServiceBlock({
  href,
  chip,
  name,
  tone,
  slot,
  lines,
  reveal,
}: {
  href: string;
  chip: string;
  name: string;
  tone: string;
  slot: (typeof images)[keyof typeof images];
  lines: string[];
  reveal: "left" | "right";
}) {
  return (
    <Link href={href} className={`zoom-card on-chip group relative grid min-h-[30rem] overflow-hidden text-white ${tone}`} data-reveal={reveal}>
      <div aria-hidden="true" className="zoom-media absolute inset-0 opacity-60">
        <ZoomImage slot={slot} sizes="(min-width: 768px) 50vw, 100vw" decorative className="h-full w-full" />
      </div>
      <div aria-hidden="true" className={`absolute inset-0 ${tone} opacity-40`} />
      <span className="label absolute left-6 top-6 text-white/80">{chip}</span>
      <span aria-hidden="true" className="text-vertical absolute bottom-6 right-4 text-[clamp(3.5rem,8vw,6.5rem)] font-semibold leading-[0.9] wdth-72">
        {name}
      </span>
      <div className="relative grid content-end gap-4 p-6 pr-28">
        <h3 className="text-h2 wdth-104">{name} painting</h3>
        <ul className="grid gap-1 text-white/85">
          {lines.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
        <span className="inline-flex items-center gap-2 font-semibold">
          Costs and what drives them <span className="arrow" aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}

/** A fanned paint deck: the brand's own visual vocabulary. Decorative. */
function FanDeck() {
  const chips = [
    { c: "#1f2a4d", n: "Platte Navy" },
    { c: "#2f5b46", n: "Prairie Green" },
    { c: "#7a8b6f", n: "Sage Field" },
    { c: "#c9b79c", n: "Wheat Straw" },
    { c: "#e2a83c", n: "Wet Ochre" },
    { c: "#2e1f2e", n: "Dusk Plum" },
  ];
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[30rem] lg:col-span-5 lg:col-start-8" data-reveal>
      {chips.map((chip, i) => (
        <div
          key={chip.n}
          className="absolute bottom-[8%] left-[38%] h-[78%] w-[24%] origin-[50%_92%] shadow-[0_18px_40px_-18px_rgb(20_26_46/0.5)]"
          style={{ background: chip.c, transform: `rotate(${(i - 2.5) * 13}deg)` }}
        >
          <span
            className="text-vertical absolute right-2 top-3 text-[0.8rem] font-semibold wdth-72"
            style={{ color: i === 3 || i === 4 ? "#141a2e" : "#fff" }}
          >
            {chip.n}
          </span>
        </div>
      ))}
      <div className="absolute bottom-[5%] left-[48.5%] h-4 w-4 -translate-x-1/2 rounded-full bg-ink" />
    </div>
  );
}

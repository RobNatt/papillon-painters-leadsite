import type { Metadata } from "next";
import Link from "next/link";
import { FaqList, type Faq } from "@/components/faq";
import { breadcrumbLd, JsonLd, orgId } from "@/components/json-ld";
import { PageTransition } from "@/components/page-transition";
import { makeCite, PainterContact, SourceList } from "@/components/painter-shared";
import { ButtonLink, Container, HeroHeadline, SectionHead } from "@/components/ui";
import type { LeadSourceId } from "@/content/lead-sources";
import { nav, site } from "@/lib/site";

const path = nav.painterWebsites.href;

export const metadata: Metadata = {
  title: { absolute: "Painting Leads for Free: SEO, Google Business Profile & Reviews" },
  description:
    "How painting companies get leads for free: a website that ranks, an optimized Google Business Profile, and a steady flow of real reviews. What each one takes, and how we set them up.",
  alternates: { canonical: path },
};

const order: LeadSourceId[] = ["googleLocalRanking", "googleReviewPolicy", "ftcReviews"];
const Cite = makeCite(order);

const faqs: Faq[] = [
  {
    q: "Are free painting leads really free?",
    a: "There's no per-lead fee, but they take work. A website, a profile and reviews cost time, or a build plus upkeep. Unlike paid leads, the work compounds. A page that ranks this year usually ranks next year. Every review keeps working.",
  },
  {
    q: "How long does SEO take for a painting company?",
    a: "It depends on the market. In a smaller city, a well-built site can show for local searches within a few months. Big metros take longer. Profile changes and new reviews can show sooner. Anyone who guarantees a ranking or a timeline is guessing.",
  },
  {
    q: "Do I need a website if I have a Google Business Profile?",
    a: "Yes, if you want the profile to work hard. Google ranks on relevance and prominence. Your website shows which services and areas you cover. It's also the only lead channel you fully own.",
  },
  {
    q: "Can I pay for or filter reviews?",
    a: "No. Google prohibits rewards for reviews. It also prohibits asking only happy customers (review gating). Since 2024, the FTC's rule bans buying fake reviews. Ask every customer, make it easy, and reply to every review.",
  },
];

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Painting leads for free: SEO, Google Business Profile and reviews",
  author: { "@id": orgId },
  publisher: { "@id": orgId },
  dateModified: site.lastReviewed,
  mainEntityOfPage: `${site.url}${path}`,
};

const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Websites, local SEO and Google Business Profile setup for painting companies",
  serviceType: "Marketing services for painting contractors",
  provider: { "@id": orgId },
  audience: { "@type": "BusinessAudience", audienceType: "Painting companies" },
};

export default function PainterWebsitesPage() {
  return (
    <PageTransition>
      {/* ---------------- Hero (charcoal register) ---------------- */}
      <section aria-labelledby="hero-title" className="on-chip bg-chip-charcoal text-white">
        <Container className="grid gap-10 pb-section-sm pt-14 lg:grid-cols-12 lg:pb-section lg:pt-20">
          <div className="grid content-start gap-8 lg:col-span-8">
            <nav aria-label="Breadcrumb" className="label hero-fade text-white/70">
              <Link className="tlink" href="/">Home</Link> <span aria-hidden="true">/</span> For painting companies
            </nav>
            <HeroHeadline lines={["Painting leads", "for free, from", "the channels", "you own."]} className="text-display wdth-112" />
            <p className="hero-fade max-w-[46ch] text-lead text-white/80" style={{ "--i": 3 } as React.CSSProperties}>
              &ldquo;Free&rdquo; means no fee per lead. It doesn&rsquo;t mean no work. Three channels do most of it: a
              website that ranks, a complete Google Business Profile and real reviews.
            </p>
            <div className="hero-fade flex flex-wrap gap-4" style={{ "--i": 4 } as React.CSSProperties}>
              <ButtonLink href={site.bookingUrl} target="_blank" rel="noopener">Book a call</ButtonLink>
            </div>
          </div>
          <ol className="hero-fade grid content-end gap-0 self-end border-t border-white/20 lg:col-span-4" style={{ "--i": 5 } as React.CSSProperties}>
            {[
              ["01", "Website + local SEO", "#website"],
              ["02", "Google Business Profile", "#gbp"],
              ["03", "Reviews", "#reviews"],
            ].map(([n, t, href]) => (
              <li key={n} className="border-b border-white/20">
                <a href={href} className="flex items-baseline gap-4 py-4 text-white hover:text-tape">
                  <span className="font-mono text-small text-white/60">{n}</span>
                  <span className="text-h3 wdth-104">{t}</span>
                </a>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ---------------- Why owned channels ---------------- */}
      <section aria-labelledby="why-title" className="py-section">
        <Container className="grid gap-10 lg:grid-cols-12">
          <p className="label text-graphite lg:col-span-3" data-reveal>Why these three</p>
          <div className="grid gap-8 lg:col-span-8">
            <h2 id="why-title" className="text-h1 wdth-108" data-split>
              Paid leads stop when you stop paying. These don&rsquo;t.
            </h2>
            <div className="prose-site max-w-measure text-lead text-graphite" data-reveal>
              <p>
                Lead marketplaces charge for every contact. They often send the same homeowner to several companies. A
                homeowner who finds <em>you</em> on Google isn&rsquo;t shared with anyone.
              </p>
              <p>
                Google ranks local results on relevance, distance and prominence.<Cite id="googleLocalRanking" /> You
                can&rsquo;t move closer to every customer. These three channels improve the other two. We compare paid
                options in <Link href={nav.painterLeads.href}>how to get painting leads</Link>.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------- 01 Website ---------------- */}
      <section id="website" aria-labelledby="website-title" className="scroll-mt-20 border-t border-line py-section">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="grid content-start gap-8 lg:col-span-5">
            <SectionHead eyebrow="01 · Website + local SEO" id="website-title" title="A website that answers what homeowners search" />
            <div className="prose-site max-w-measure text-graphite" data-reveal>
              <p>
                Homeowners don&rsquo;t search for your name. They search for the job: <em>exterior painting cost</em>,{" "}
                <em>cabinet painters near me</em>, <em>professional painters in Papillion</em>. A site that ranks has a
                real page for each one.
              </p>
              <ul>
                <li><strong className="text-ink">One page per service</strong>: interior, exterior, cabinets, decks. Not one list on a &ldquo;Services&rdquo; page.</li>
                <li><strong className="text-ink">Pages for the cities you serve.</strong> Each says something true about that area. No swapped town names.</li>
                <li><strong className="text-ink">Pricing content.</strong> &ldquo;What does it cost&rdquo; is a top search. Our <Link href={nav.cost.href}>Papillion painting cost guide</Link> is an example.</li>
                <li><strong className="text-ink">Fast on a phone</strong>, with a short quote form near the top of every page.</li>
                <li><strong className="text-ink">Readable by search engines.</strong> Real text in the HTML, clear titles and structured data. Search Console shows what&rsquo;s working.</li>
              </ul>
            </div>
          </div>

          {/* A site assembling itself, part by part, as you scroll */}
          <figure aria-label="Diagram of a painting company website: header, hero with quote form, service pages, reviews and cost guide" className="self-center lg:col-span-6 lg:col-start-7">
            <div className="overflow-hidden border border-line bg-chalk shadow-[0_30px_80px_-40px_rgb(20_26_46/0.45)]">
              <div className="flex items-center gap-2 border-b border-line bg-primer px-4 py-3" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-line" />
                <span className="h-2.5 w-2.5 rounded-full bg-line" />
                <span className="h-2.5 w-2.5 rounded-full bg-line" />
                <span className="ml-3 flex-1 truncate rounded-pill bg-chalk px-3 py-1 font-mono text-[0.7rem] text-graphite">yourpaintingco.com</span>
              </div>
              <div className="grid gap-3 p-4 sm:p-6" data-reveal-group aria-hidden="true">
                <div className="flex items-center justify-between" data-reveal>
                  <span className="h-3 w-28 bg-ink" />
                  <span className="h-7 w-24 rounded-pill bg-tape" />
                </div>
                <div className="grid grid-cols-5 gap-3 bg-chip-navy p-4" data-reveal>
                  <div className="col-span-3 grid content-start gap-2">
                    <span className="h-4 w-11/12 bg-white/90" />
                    <span className="h-4 w-8/12 bg-white/90" />
                    <span className="mt-2 h-2 w-10/12 bg-white/40" />
                    <span className="h-2 w-9/12 bg-white/40" />
                  </div>
                  <div className="col-span-2 grid gap-1.5 bg-chalk p-2">
                    <span className="h-3 bg-primer-deep" />
                    <span className="h-3 bg-primer-deep" />
                    <span className="h-3 bg-primer-deep" />
                    <span className="h-4 w-3/4 rounded-pill bg-tape" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3" data-reveal>
                  <span className="grid h-20 content-end bg-chip-plum p-2"><span className="h-2 w-3/4 bg-white/80" /></span>
                  <span className="grid h-20 content-end bg-chip-forest p-2"><span className="h-2 w-3/4 bg-white/80" /></span>
                  <span className="grid h-20 content-end bg-chip-navy p-2"><span className="h-2 w-3/4 bg-white/80" /></span>
                </div>
                <div className="flex gap-3" data-reveal>
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="grid flex-1 gap-1.5 border border-line p-2">
                      <span className="font-mono text-[0.65rem] text-tape-hover">★★★★★</span>
                      <span className="h-1.5 bg-primer-deep" />
                      <span className="h-1.5 w-3/4 bg-primer-deep" />
                    </span>
                  ))}
                </div>
                <div className="grid gap-1.5 border-l-4 border-tape bg-primer p-3" data-reveal>
                  <span className="h-2.5 w-1/2 bg-ink" />
                  <span className="h-1.5 bg-line" />
                  <span className="h-1.5 w-10/12 bg-line" />
                </div>
              </div>
            </div>
            <figcaption className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 text-small text-graphite sm:grid-cols-3">
              <span>Header + quote button</span>
              <span>Hero with the form</span>
              <span>A page per service</span>
              <span>Real reviews</span>
              <span>Cost content</span>
            </figcaption>
          </figure>
        </Container>
      </section>

      {/* ---------------- 02 GBP ---------------- */}
      <section id="gbp" aria-labelledby="gbp-title" className="scroll-mt-20 bg-primer-deep py-section">
        <Container className="grid gap-14">
          <SectionHead
            eyebrow="02 · Google Business Profile"
            id="gbp-title"
            title="The profile that decides the map results"
            intro={<p>For &ldquo;painters near me,&rdquo; the map often shows before any website. A complete, active profile is the fastest free win.</p>}
          />
          <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3" data-reveal-group>
            {[
              ["Pick the right primary category", "Choose the most specific one. For most companies, that's Painter. Add others only for work you really do."],
              ["Set it up as a service-area business", "Customers don't visit your shop? Hide the address. List the cities and ZIP codes you serve."],
              ["Fill in every service", "Interior, exterior, cabinets and the rest, each with a short description. Google uses it to judge relevance."],
              ["Add real job photos, often", "Before-and-after shots from your own jobs. No stock photos. No one else's work."],
              ["Post updates", "A finished job, a seasonal tip, your fall schedule. Regular posts show you're open."],
              ["Keep your details identical everywhere", "Same name, phone and website on Google, your site, Bing, Apple and Facebook."],
            ].map(([t, b]) => (
              <div key={t} className="grid content-start gap-3 border-t-2 border-ink pt-5" data-reveal>
                <h3 className="text-h3 wdth-104">{t}</h3>
                <p className="text-graphite">{b}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- 03 Reviews ---------------- */}
      <section id="reviews" aria-labelledby="reviews-title" className="scroll-mt-20 py-section">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead eyebrow="03 · Reviews" id="reviews-title" title="Reviews are the prominence you can earn" />
          </div>
          <div className="prose-site max-w-measure text-graphite lg:col-span-6 lg:col-start-7" data-reveal>
            <p>
              Google counts reviews toward local prominence.<Cite id="googleLocalRanking" /> Homeowners also read them
              before they call. The system that works is simple:
            </p>
            <ol>
              <li><strong className="text-ink">Ask every customer</strong> in person at the final walk-through.</li>
              <li><strong className="text-ink">Text the review link</strong> the same day. It should take 30 seconds.</li>
              <li><strong className="text-ink">Reply to every review</strong>, good or bad. Mention the job (&ldquo;the cedar trim on your ranch&rdquo;).</li>
              <li><strong className="text-ink">Follow up once</strong> a week later, then stop.</li>
            </ol>
            <p>
              Don&rsquo;t offer rewards for reviews. Don&rsquo;t ask only happy customers. Google prohibits both.
              <Cite id="googleReviewPolicy" /> The FTC&rsquo;s 2024 rule bans buying or writing fake reviews.
              <Cite id="ftcReviews" /> That&rsquo;s why this site shows no reviews. It isn&rsquo;t a painting company, so
              it has none.
            </p>
          </div>
        </Container>
      </section>

      {/* ---------------- Other free channels ---------------- */}
      <section aria-labelledby="more-title" className="border-t border-line py-section-sm">
        <Container className="grid gap-10 lg:grid-cols-12">
          <h2 id="more-title" className="text-h2 wdth-104 lg:col-span-4" data-split>
            Other free channels worth an hour a month
          </h2>
          <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:col-span-7 lg:col-start-6" data-reveal-group>
            {[
              ["Bing Places and Apple Business Connect", "Google's profile, for Bing and iPhone Maps. AI assistants read them too."],
              ["Nextdoor and neighborhood groups", "Neighbors recommend painters. Have a business page so they can tag you."],
              ["Realtors and property managers", "They need fast, tidy repaints between listings and tenants."],
              ["Yard signs and truck lettering", "A sign on a finished job reaches the whole street."],
            ].map(([t, b]) => (
              <li key={t} className="grid gap-1 border-t border-line pt-4" data-reveal>
                <strong>{t}</strong>
                <span className="text-graphite">{b}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---------------- Offer ---------------- */}
      <section aria-labelledby="offer-title" className="on-chip bg-chip-navy py-section text-white">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="grid content-start gap-6 lg:col-span-6">
            <p className="label text-white/70" data-reveal>What we do for painting companies</p>
            <h2 id="offer-title" className="text-h1 wdth-108" data-split>
              We set up all three, and show you the numbers.
            </h2>
            <p className="max-w-[40ch] text-lead text-white/80" data-reveal>
              The proof is this site. We built it to rank for Papillion painting searches. We publish its{" "}
              <Link className="tlink text-white" href={`${nav.painterLeads.href}#found`}>real ranking data</Link> as it
              grows.
            </p>
          </div>
          <ol className="grid gap-0 border-t border-white/20 lg:col-span-5 lg:col-start-8" data-reveal-group>
            {[
              ["A website built to rank", "Service and city pages, cost content and a quote form on every page. Fast on phones."],
              ["Google Business Profile, done properly", "Categories, service areas, services, photos and a posting schedule."],
              ["A review system", "A simple ask-and-text routine your crew can actually follow."],
              ["Monthly reporting", "Search Console and profile numbers. What's ranking, and what's calling."],
            ].map(([t, b]) => (
              <li key={t} className="grid gap-1 border-b border-white/20 py-5" data-reveal>
                <strong className="text-h3 wdth-104">{t}</strong>
                <span className="text-white/75">{b}</span>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <FaqList faqs={faqs} title="Free painting lead questions" />

      <PainterContact source="painter-websites" title="Want leads that aren’t shared with four other painters?" />

      <SourceList order={order} />

      <JsonLd
        data={[
          articleLd,
          serviceLd,
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Websites for painting companies", path },
          ]),
        ]}
      />
    </PageTransition>
  );
}

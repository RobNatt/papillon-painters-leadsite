import type { Metadata } from "next";
import Link from "next/link";
import { FaqList, type Faq } from "@/components/faq";
import { breadcrumbLd, JsonLd, articleLd as buildArticleLd } from "@/components/json-ld";
import { PageTransition } from "@/components/page-transition";
import { makeCite, PainterContact, SourceList } from "@/components/painter-shared";
import { ButtonLink, Container, SectionHead } from "@/components/ui";
import type { LeadSourceId } from "@/content/lead-sources";
import { launchDate, rankingLog } from "@/content/ranking-log";
import { nav, site } from "@/lib/site";

const path = nav.painterLeads.href;
const QUERY = "how to get painting leads";

export const metadata: Metadata = {
  title: { absolute: "How to Get Painting Leads: The Best Free and Paid Strategies" },
  description:
    "How to get painting leads, free and paid: Angi, Thumbtack, Google ads, agencies and SEO compared. What each costs, whether leads are shared, what you own.",
  alternates: { canonical: path },
};

const order: LeadSourceId[] = ["calls99", "housecall", "thumbtackCost", "webtonic", "googleLocalRanking"];
const Cite = makeCite(order);

type Row = { channel: string; pay: string; shared: string; cost: React.ReactNode; own: string; anchor: string };
const rows: Row[] = [
  { channel: "Angi (incl. HomeAdvisor)", pay: "Per lead, plus optional ads", shared: "Often sent to several pros", cost: <>≈ $15–$85 per lead<Cite id="calls99" /></>, own: "No", anchor: "angi" },
  { channel: "Thumbtack", pay: "Per lead, within a weekly budget", shared: "Homeowners often contact several pros", cost: <>≈ $25–$75 per lead<Cite id="thumbtackCost" /></>, own: "No", anchor: "thumbtack" },
  { channel: "Google Local Services Ads", pay: "Per lead (call or message)", shared: "Not resold, but competitors sit beside you", cost: <>≈ $48 median per lead for painters<Cite id="webtonic" /></>, own: "No", anchor: "lsa" },
  { channel: "Google Search Ads", pay: "Per click", shared: "No", cost: <>≈ $174 median per lead for painters<Cite id="webtonic" /></>, own: "No", anchor: "ppc" },
  { channel: "Marketing agency", pay: "Monthly retainer", shared: "Depends", cost: "Varies widely", own: "Depends on the contract", anchor: "agency" },
  { channel: "SEO + Google Business Profile", pay: "Time, or a build plus upkeep", shared: "No", cost: "No per-lead fee", own: "Yes", anchor: "seo" },
  { channel: "AEO (AI answers)", pay: "Same work as SEO", shared: "No", cost: "No per-lead fee", own: "Yes", anchor: "aeo" },
];

const faqs: Faq[] = [
  {
    q: "What is the best way to get painting leads?",
    a: "For most local painting companies, the strongest long-term channel is their own website, a complete Google Business Profile and steady reviews. Those leads aren't shared, and they don't stop when spending stops. Paid channels like Local Services Ads or Thumbtack can fill the calendar meanwhile.",
  },
  {
    q: "Are Angi and HomeAdvisor the same?",
    a: "They're owned by the same company, Angi Inc. Painters deal with one lead program. You pay per lead, and a lead can go to more than one company.",
  },
  {
    q: "How much do painting leads cost?",
    a: "Third-party estimates put shared Angi leads at about $15 to $85. Thumbtack runs about $25 to $75 for many trades. Google Local Services Ads run about $48 per lead for painters (median). Google Search Ads run higher, about $174 median in one 2026 benchmark. Your market will differ.",
  },
  {
    q: "What is AEO?",
    a: "Answer engine optimization: making your business easy for AI assistants and AI search to find, understand and cite. It's the same foundation as good local SEO. Clear pages that answer real questions. Consistent business details. Real reviews. Each passage should stand on its own as an answer.",
  },
];

const articleLd = buildArticleLd({
  path,
  headline: "How to get painting leads: the best free and paid strategies",
  description: metadata.description as string,
});

const fmtDate = (d: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(d));

export default function PaintingLeadsPage() {
  return (
    <PageTransition>
      {/* ---------------- Hero: the search types itself ---------------- */}
      <section aria-labelledby="hero-title" className="py-section-sm lg:pt-24">
        <Container className="grid gap-10">
          <nav aria-label="Breadcrumb" className="label hero-fade text-graphite">
            <Link className="tlink" href="/">Home</Link> <span aria-hidden="true">/</span> For painting companies
          </nav>
          <div className="hero-fade flex max-w-[44rem] items-center gap-4 overflow-hidden rounded-pill border border-line bg-chalk px-6 py-4 shadow-[0_20px_50px_-30px_rgb(20_26_46/0.45)]" style={{ "--i": 0 } as React.CSSProperties}>
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" className="flex-none text-graphite"><circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M13 13l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            <p className="min-w-0 font-mono text-[clamp(0.9rem,2.4vw,1.15rem)]">
              <span className="sr-only">Search: </span>
              <span className="type-wrap" style={{ "--n": QUERY.length } as React.CSSProperties}>
                <span className="type-line">{QUERY}</span>
                <span className="type-cursor" aria-hidden="true" />
              </span>
            </p>
          </div>
          <h1 id="hero-title" className="max-w-[18ch] text-h1 wdth-112">
            <span className="hero-line" style={{ "--i": 1 } as React.CSSProperties}><span>How to get painting leads:</span></span>{" "}
            <span className="hero-line" style={{ "--i": 2 } as React.CSSProperties}><span>the best free and</span></span>{" "}
            <span className="hero-line" style={{ "--i": 3 } as React.CSSProperties}><span>paid strategies</span></span>
          </h1>
          <div className="grid gap-8 lg:grid-cols-12">
            <p className="hero-fade max-w-[46ch] text-lead text-graphite lg:col-span-7" style={{ "--i": 4 } as React.CSSProperties}>
              Angi, HomeAdvisor, Thumbtack, Google ads, agencies, SEO and AEO. Compared on how you pay, whether leads are
              shared, and what you keep when you stop.
            </p>
            <div className="hero-fade grid content-start gap-4 lg:col-span-4 lg:col-start-9" style={{ "--i": 5 } as React.CSSProperties}>
              <p className="text-small text-graphite">
                Found this page on Google? That&rsquo;s the demonstration.{" "}
                <a className="tlink text-ink" href="#found">See how this site got found ↓</a>
              </p>
              <p>
                <ButtonLink href={site.bookingUrl} target="_blank" rel="noopener">Book a call about your leads</ButtonLink>
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------- Short answer ---------------- */}
      <section aria-labelledby="tldr-title" className="py-section-sm">
        <Container>
          <div className="grid gap-4 border-l-4 border-tape bg-chalk p-6 sm:p-8" data-reveal>
            <h2 id="tldr-title" className="label text-graphite">Short answer</h2>
            <p className="max-w-[62ch] text-lead">
              Marketplaces and Google ads buy leads <em>now</em>. You usually pay per lead, and leads are often shared.
              Your own website, profile and reviews take longer. But they cost nothing per lead, aren&rsquo;t shared, and
              keep working. Most healthy companies run one paid channel while they build the owned ones.
            </p>
          </div>
        </Container>
      </section>

      {/* ---------------- Comparison table ---------------- */}
      <section aria-labelledby="compare-title" className="py-section-sm">
        <Container className="grid gap-10">
          <SectionHead eyebrow="Side by side" id="compare-title" title="Every major painting lead source, compared" />
          <div className="-mx-gutter overflow-x-auto px-gutter" data-reveal>
            <table className="w-full min-w-[52rem] border-collapse text-left text-small">
              <caption className="sr-only">Painting lead sources compared by payment model, sharing, reported cost and ownership</caption>
              <thead>
                <tr className="border-b-2 border-ink">
                  <th scope="col" className="py-3 pr-4 font-semibold">Channel</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">How you pay</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">Lead shared?</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">Reported cost</th>
                  <th scope="col" className="py-3 font-semibold">Yours if you stop paying?</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.channel} className={`border-b border-line ${r.own === "Yes" ? "bg-chalk" : ""}`}>
                    <th scope="row" className="py-4 pr-4 font-semibold">
                      <a className="tlink" href={`#${r.anchor}`}>{r.channel}</a>
                    </th>
                    <td className="py-4 pr-4 text-graphite">{r.pay}</td>
                    <td className="py-4 pr-4 text-graphite">{r.shared}</td>
                    <td className="py-4 pr-4">{r.cost}</td>
                    <td className="py-4 font-semibold">{r.own}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="max-w-measure text-small text-graphite" data-reveal>
            Costs are published ranges and averages. Several come from companies that sell alternatives. Sources are at
            the end of the page.
          </p>
        </Container>
      </section>

      {/* ---------------- Article body ---------------- */}
      <article aria-labelledby="compare-title" className="py-section">
        <Container className="grid gap-12 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <nav aria-label="On this page" className="sticky top-28 grid gap-2 text-small">
              <p className="label mb-2 text-graphite">On this page</p>
              {rows.map((r) => (
                <a key={r.anchor} className="tlink justify-self-start text-graphite hover:text-ink" href={`#${r.anchor}`}>{r.channel}</a>
              ))}
              <a className="tlink justify-self-start text-graphite hover:text-ink" href="#choose">Which to choose</a>
              <a className="tlink justify-self-start text-graphite hover:text-ink" href="#found">How this site got found</a>
            </nav>
          </aside>

          <div className="prose-site max-w-measure lg:col-span-8 lg:col-start-5">
            <h2 id="paid">Paid lead marketplaces</h2>

            <h3 id="angi" className="scroll-mt-24">Angi and HomeAdvisor</h3>
            <p>
              Angi and HomeAdvisor are owned by the same company, Angi Inc. You pay for leads that match your services and
              area. One homeowner request can go to several companies. Third-party estimates put shared leads at about
              $15 to $85 each.<Cite id="calls99" /> Angi doesn&rsquo;t publish a price list. Ask your rep for the cost
              per lead in your category and ZIP codes first.
            </p>
            <p>
              <strong>Good for:</strong> filling gaps fast, especially in a new market. <strong>Watch for:</strong> speed.
              The first painter to call usually wins a shared lead.
            </p>

            <h3 id="thumbtack" className="scroll-mt-24">Thumbtack</h3>
            <p>
              Thumbtack charges per lead. You set a weekly budget and the jobs you want.<Cite id="housecall" />{" "}
              Third-party estimates for most trades run about $25 to $75 per lead.<Cite id="thumbtackCost" /> Homeowners
              often message several pros. Real job photos and fast replies decide who gets hired.
            </p>

            <h2 id="google-paid">Paying Google</h2>

            <h3 id="lsa" className="scroll-mt-24">Google Local Services Ads</h3>
            <p>
              Local Services Ads sit at the top of many &ldquo;painters near me&rdquo; searches, with a Google badge.
              You pay per lead (a call or message), not per click. One 2026 benchmark puts the median for painters at about $48 per
              lead.<Cite id="webtonic" /> Reviews affect how often you show. One more reason the free work matters.
            </p>

            <h3 id="ppc" className="scroll-mt-24">Google Search Ads</h3>
            <p>
              Pay-per-click ads give you full control of keywords and landing pages. The click is yours alone.
              They&rsquo;re also the priciest option here. The same benchmark puts painters at about $174 per lead,
              median.<Cite id="webtonic" /> Point them at a strong page on your site, not your homepage.
            </p>

            <h2 id="agency" className="scroll-mt-24">Marketing agencies</h2>
            <p>
              An agency can run any channel above, or build the owned ones. Price and quality vary more than anything
              else here. Judge the contract, not the pitch:
            </p>
            <ul>
              <li>If you leave, who owns the website, domain and Google profile?</li>
              <li>Will they show Search Console and call data, not just &ldquo;impressions&rdquo;?</li>
              <li>Can you cancel monthly, or are you locked in for a year?</li>
              <li>Are they promising rankings? Nobody can guarantee a position on Google.</li>
            </ul>

            <h2 id="free">Free painting leads: the channels you own</h2>

            <h3 id="seo" className="scroll-mt-24">SEO and your Google Business Profile</h3>
            <p>
              Google ranks local results on relevance, distance and prominence.<Cite id="googleLocalRanking" /> A page for
              each service and area makes you relevant. A complete profile and steady reviews make you prominent. No
              per-lead cost. No shared leads. The trade-off is time: months, not days. Here&rsquo;s{" "}
              <Link href={nav.painterWebsites.href}>how a website for your painting company brings in leads</Link>.
            </p>

            <h3 id="aeo" className="scroll-mt-24">AEO: showing up in AI answers</h3>
            <p>
              More homeowners ask an AI assistant, or read an AI summary on Google, before they click. Answer engine
              optimization (AEO) means being the source those answers use. It&rsquo;s mostly careful SEO:
            </p>
            <ul>
              <li>Answer the question in the first lines, like our <Link href={nav.cost.href}>painting cost guide</Link> does.</li>
              <li>Use plain facts a machine can lift: prices with sources, service areas, what&rsquo;s included.</li>
              <li>Keep your business name, phone and website identical everywhere they appear.</li>
              <li>Earn real reviews and mentions; assistants weigh what other people say about you.</li>
            </ul>

            <h2 id="choose" className="scroll-mt-24">Which should you choose?</h2>
            <ul>
              <li><strong>New company, empty calendar:</strong> one paid channel (Local Services Ads or Thumbtack) for cash flow. Start the website and profile on day one.</li>
              <li><strong>Established, tired of shared leads:</strong> invest in reviews and your site. Cut the marketplace budget as organic calls replace it.</li>
              <li><strong>Busy season already full:</strong> keep reviews, photos and a weekly post going. Next spring starts warm.</li>
            </ul>
          </div>
        </Container>
      </article>

      {/* ---------------- The one dark moment ---------------- */}
      <section id="found" aria-labelledby="found-title" className="on-chip scroll-mt-16 bg-chip-charcoal py-section text-white">
        <Container className="grid gap-14">
          <div className="grid gap-6 lg:grid-cols-12">
            <p className="label text-white/60 lg:col-span-3" data-reveal>How this site got found</p>
            <h2 id="found-title" className="text-h1 wdth-108 lg:col-span-8" data-split>
              You searched for painting leads. This page is the proof of concept.
            </h2>
          </div>

          <div className="grid gap-10 lg:grid-cols-12">
            <div className="grid content-start gap-5 lg:col-span-5">
              <p className="text-lead text-white/80" data-reveal>
                {site.domain} is a real site, built the way we build sites for painters. Here&rsquo;s what we did. Below
                it is what Google Search Console says.
              </p>
            </div>
            <ol className="relative grid gap-8 pl-8 lg:col-span-6 lg:col-start-7" data-reveal-group>
              <span aria-hidden="true" className="absolute bottom-2 left-[5px] top-2 w-0.5 origin-top bg-white/15">
                <span data-reveal="draw-y" className="absolute inset-0 bg-tape" />
              </span>
              {[
                ["Mapped the searches", "One target search per page: “painters papillion ne”, “exterior painting cost papillion ne”, “websites for painting companies” and this one."],
                ["Answered them properly", "Each page opens with a direct answer. It cites its numbers and links to the others."],
                ["Built it to be read", "Real text in the HTML, fast on a phone, and structured data on every page."],
                ["Stayed honest", "No fake reviews. No invented address. A plain statement that it's a referral service."],
                ["Track it in public", "Search Console data, posted below as it comes in."],
              ].map(([t, b], i) => (
                <li key={t} className="relative grid gap-1" data-reveal>
                  <span aria-hidden="true" className="absolute -left-8 top-1.5 h-3 w-3 rounded-full border-2 border-tape bg-chip-charcoal" />
                  <span className="label text-white/60">Step {String(i + 1).padStart(2, "0")}</span>
                  <strong className="text-h3 wdth-104">{t}</strong>
                  <span className="text-white/75">{b}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid gap-5 border-t border-white/15 pt-10" data-reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-h3 wdth-104">Ranking log</h3>
              <p className="text-small text-white/60">Source: Google Search Console · average position, last 28 days</p>
            </div>
            {rankingLog.length === 0 ? (
              <p className="max-w-measure text-white/75">
                The site launched on {fmtDate(launchDate)}. New sites take time to collect search data. The first
                Search Console snapshot appears here when Google has some. Real numbers only, slow ones included.
              </p>
            ) : (
              <div className="-mx-gutter overflow-x-auto px-gutter">
                <table className="w-full min-w-[36rem] border-collapse text-left text-small">
                  <thead>
                    <tr className="border-b border-white/30">
                      <th scope="col" className="py-3 pr-4 font-semibold">Date</th>
                      <th scope="col" className="py-3 pr-4 font-semibold">Search</th>
                      <th scope="col" className="py-3 pr-4 text-right font-semibold">Avg. position</th>
                      <th scope="col" className="py-3 pr-4 text-right font-semibold">Clicks</th>
                      <th scope="col" className="py-3 text-right font-semibold">Impressions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankingLog.map((r) => (
                      <tr key={`${r.date}-${r.query}`} className="border-b border-white/10">
                        <td className="py-3 pr-4 whitespace-nowrap">{fmtDate(r.date)}</td>
                        <td className="py-3 pr-4">
                          {r.query}
                          {r.note ? <span className="block text-white/60">{r.note}</span> : null}
                        </td>
                        <td className="py-3 pr-4 text-right font-mono">{r.position.toFixed(1)}</td>
                        <td className="py-3 pr-4 text-right font-mono">{r.clicks ?? "–"}</td>
                        <td className="py-3 text-right font-mono">{r.impressions ?? "–"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4" data-reveal>
            <ButtonLink href={site.bookingUrl} target="_blank" rel="noopener">Book a call</ButtonLink>
          </div>
        </Container>
      </section>

      <FaqList faqs={faqs} title="Painting lead questions" />

      <PainterContact source="painting-leads-article" title="Book a call. Get found the same way." />

      <SourceList order={order} />

      <JsonLd
        data={[
          articleLd,
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "How to get painting leads", path },
          ]),
        ]}
      />
    </PageTransition>
  );
}

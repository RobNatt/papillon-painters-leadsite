import { leadSources, type LeadSourceId } from "@/content/lead-sources";
import { site } from "@/lib/site";
import { PainterInquiryForm } from "./painter-inquiry";
import { Container } from "./ui";

/** Numbered citation; `order` is the page's source order. */
export function makeCite(order: LeadSourceId[]) {
  return function Cite({ id }: { id: LeadSourceId }) {
    const n = order.indexOf(id) + 1;
    return (
      <sup>
        <a href={`#src-${id}`} className="-my-3 ml-0.5 inline-block px-1 py-3 font-mono text-[0.8em] !no-underline" aria-label={`Source ${n}`}>
          [{n}]
        </a>
      </sup>
    );
  };
}

export function SourceList({ order }: { order: LeadSourceId[] }) {
  return (
    <section aria-labelledby="sources-title" className="py-section-sm">
      <Container className="grid gap-4">
        <h2 id="sources-title" className="label text-graphite">Sources</h2>
        <ol className="grid gap-2 text-small text-graphite">
          {order.map((id, i) => (
            <li key={id} id={`src-${id}`} className="scroll-mt-24">
              [{i + 1}]{" "}
              <a className="underline decoration-tape underline-offset-2" href={leadSources[id].url} rel="noopener" target="_blank">
                {leadSources[id].name}
              </a>
            </li>
          ))}
        </ol>
        <p className="max-w-measure text-small text-graphite">
          Lead prices vary by market and change often. Several figures come from vendors who sell alternatives. Treat
          them as ranges to check. Last reviewed{" "}
          {new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(site.lastReviewed))}.
        </p>
      </Container>
    </section>
  );
}

/** Book-a-call block: the booking link when it's configured, plus the inquiry form. */
export function PainterContact({ source, title }: { source: string; title: string }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-20 bg-primer-deep py-section">
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="grid content-start gap-6 lg:col-span-5">
          <p className="label text-graphite" data-reveal>For painting companies</p>
          <h2 id="contact-title" className="text-h1 wdth-108" data-split>
            {title}
          </h2>
          <p className="max-w-[38ch] text-lead text-graphite" data-reveal>
            Pick a time. We&rsquo;ll review your website and Google profile first. The call is about your numbers, not
            a pitch.
          </p>
          <div data-reveal>
            <a href={site.bookingUrl} className="btn btn-primary" data-magnetic="" rel="noopener" target="_blank">
              Book a call <span className="arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        {/* One clear action: booking. Email stays available, one tap away. */}
        <details className="contact-alt self-start bg-chalk lg:col-span-6 lg:col-start-7" data-reveal>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 font-semibold sm:px-8">
            Prefer email? Send us a note
            <span className="plus font-mono text-xl" aria-hidden="true">+</span>
          </summary>
          <div className="px-6 pb-6 sm:px-8 sm:pb-8">
            <PainterInquiryForm source={source} />
          </div>
        </details>
      </Container>
    </section>
  );
}

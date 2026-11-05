import { faqLd, JsonLd } from "./json-ld";

export type Faq = { q: string; a: string };

export function FaqList({
  faqs,
  id = "faq",
  title = "Questions homeowners ask",
  tight = false,
}: {
  faqs: Faq[];
  id?: string;
  title?: string;
  /** Smaller top padding, for when the section above already ends with its own. */
  tight?: boolean;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`mx-auto grid max-w-site gap-12 px-gutter pb-section lg:grid-cols-12 ${tight ? "pt-section-sm" : "pt-section"}`}
    >
      <div className="lg:col-span-4">
        <p className="label text-graphite" data-reveal>FAQ</p>
        <h2 id={`${id}-title`} className="mt-5 text-h2 wdth-104" data-split>
          {title}
        </h2>
      </div>
      <div className="faq lg:col-span-7 lg:col-start-6" data-reveal>
        {faqs.map((f) => (
          <details key={f.q}>
            <summary>
              {f.q}
              <span className="plus" aria-hidden="true">+</span>
            </summary>
            <p className="max-w-measure pb-6 text-graphite">{f.a}</p>
          </details>
        ))}
      </div>
      <JsonLd data={faqLd(faqs)} />
    </section>
  );
}

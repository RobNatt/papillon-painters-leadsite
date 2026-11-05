import { ButtonLink } from "./ui";

const steps = [
  {
    n: "01",
    title: "Tell us about the job",
    body: "Two minutes, no account. Say what needs painting and when.",
  },
  {
    n: "02",
    title: "We pass it to one local painter",
    body: "An independent painter in Papillion or Sarpy County gets your request. Nobody else does.",
  },
  {
    n: "03",
    title: "They contact you to quote",
    body: "They set up a free walk-through and give you a written price. Hire them only if it fits.",
  },
];

/**
 * Pinned on desktop (GSAP adds .is-pinned and scrubs the steps); on mobile,
 * with reduced motion, or without JS it's a normal ordered list.
 */
export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="pin-steps bg-chip-navy text-white on-chip" data-pin-steps>
      <div className="mx-auto grid lg:min-h-svh max-w-site content-center gap-12 px-gutter py-section lg:grid-cols-12 lg:gap-8">
        <div className="grid content-start gap-6 lg:col-span-5">
          <p className="label text-white/70">How it works</p>
          <h2 id="how-title" className="text-h1 wdth-108">
            One request. One local painter.
          </h2>
          <p className="max-w-[34ch] text-lead text-white/80">
            No bidding war. No phone ringing all week. Here&rsquo;s what happens next.
          </p>
          <div>
            <ButtonLink href="/#quote">Start my request</ButtonLink>
          </div>
          <p aria-hidden="true" className="hidden font-mono text-h2 text-tape lg:block">
            <span data-pin-counter>01</span>
            <span className="text-white/40"> / 03</span>
          </p>
        </div>

        <div className="grid grid-cols-[3px_minmax(0,1fr)] gap-6 lg:col-span-6 lg:col-start-7 lg:gap-10">
          <div aria-hidden="true" className="relative hidden bg-white/15 lg:block">
            <div data-pin-progress className="absolute inset-0 origin-top bg-tape" />
          </div>
          <ol className="pin-list col-span-2 grid gap-12 lg:col-span-1">
            {steps.map((s) => (
              <li key={s.n} className="pin-step grid content-center gap-4">
                <span className="label text-white/60">Step {s.n}</span>
                <h3 className="text-h2 wdth-104">{s.title}</h3>
                <p className="max-w-[44ch] text-lead text-white/80">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

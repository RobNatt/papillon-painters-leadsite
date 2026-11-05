import { images, storyImages } from "@/content/images";
import { site } from "@/lib/site";
import { Photo } from "./photo";
import { QuoteForm } from "./quote-form";
import { Container, HeroHeadline } from "./ui";

/**
 * Home hero as a three-stage scroll sequence (engine: src/lib/motion/hero-unveil.ts).
 *
 *   1. The hero as it was: headline, subtext and the quote form, fully usable.
 *   2. Once the whole hero has been scrolled through, it pins, zooms into
 *      darkness, and a short statement appears with photos that follow the
 *      cursor (or play on a timer on touch screens).
 *   3. The darkness zooms back out to reveal the next section, then unpins.
 *
 * The pin wrapper (`pin-spacer`) is rendered here, so creating the pin never
 * moves the form in the DOM (which would drop focus mid-typing).
 *
 * Reduced motion / no JS: no pin. The statement and photos are a normal
 * section under the hero.
 */
export function HeroUnveil() {
  return (
    <>
      <div className="pin-spacer" data-unveil-pin>
        <div className="hero-unveil relative z-10" data-hero-unveil>
          <section
            aria-labelledby="hero-title"
            className="on-chip relative min-h-svh overflow-hidden bg-chip-navy text-white"
            data-unveil-hero
          >
            <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 origin-[50%_70%]" data-unveil-bg>
                <div className="hero-settle absolute inset-0">
                  <Photo slot={images.heroHome} priority sizes="100vw" decorative />
                </div>
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(100deg,rgb(31_42_77/0.94)_0%,rgb(31_42_77/0.82)_45%,rgb(31_42_77/0.45)_100%)]" />
              <div className="unveil-dark absolute inset-0 bg-[#090b12]" data-unveil-dark />
            </div>

            <Container className="relative grid gap-12 pb-section-sm pt-16 lg:grid-cols-12 lg:gap-8 lg:pb-section lg:pt-24">
              <div className="grid content-start gap-8 lg:col-span-7">
                <p className="label hero-fade text-white/75" style={{ "--i": 0 } as React.CSSProperties} data-unveil-fade>
                  {site.city}, {site.stateCode} · {site.zips.join(" · ")}
                </p>
                <HeroHeadline
                  lines={["Professional", "painters in", "Papillion, one", "request away."]}
                  className="text-display wdth-112"
                />
                <p className="hero-fade max-w-[38ch] text-lead text-white/85" style={{ "--i": 3 } as React.CSSProperties} data-unveil-fade>
                  Tell us about the job once. One independent Papillion painter contacts you with a free on-site quote.
                </p>
                <ul className="hero-fade grid gap-2 text-small text-white/80 sm:grid-cols-3" style={{ "--i": 4 } as React.CSSProperties} data-unveil-fade>
                  <li className="border-t border-white/25 pt-3">Free for homeowners</li>
                  <li className="border-t border-white/25 pt-3">One painter, not a bidding list</li>
                  <li className="border-t border-white/25 pt-3">Referral service, not a contractor</li>
                </ul>
              </div>

              <div id="quote" className="scroll-mt-24 lg:col-span-5" data-unveil-fade>
                <div className="hero-fade bg-chalk p-6 text-ink sm:p-8" style={{ "--i": 4 } as React.CSSProperties}>
                  <QuoteForm source="home-hero" />
                </div>
              </div>
            </Container>
          </section>

          {/* Stage 2. With motion it overlays the pinned view; otherwise it's a normal section. */}
          <section aria-labelledby="story-title" className="unveil-stage on-chip bg-[#090b12] py-section text-white" data-unveil-stage>
            <Container className="unveil-stage-inner grid gap-10">
              <h2 id="story-title" className="max-w-[16ch] text-center text-display wdth-112 lg:mx-auto" data-unveil-statement>
                Every wall in Papillion has a story.
              </h2>
            </Container>
            <ul className="unveil-pool mx-auto mt-10 max-w-site px-gutter" data-unveil-pool>
              {storyImages.map((slot) => (
                <li key={slot.file}>
                  <Photo slot={slot} sizes="(min-width: 768px) 25vw, 50vw" />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
      {/* Lets the next section slide up underneath the pinned hero (motion only). */}
      <div aria-hidden="true" data-unveil-spacer />
    </>
  );
}

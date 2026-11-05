import type { Metadata } from "next";
import { PageTransition } from "@/components/page-transition";
import { ButtonLink, Container, HeroHeadline } from "@/components/ui";
import { nav } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request received",
  robots: { index: false, follow: true },
};

export default function ThanksPage() {
  return (
    <PageTransition>
      <section aria-labelledby="hero-title" className="py-section">
        <Container className="grid max-w-4xl gap-8">
          <p className="label hero-fade text-graphite">Request received</p>
          <HeroHeadline lines={["Thanks. A local painter", "will be in touch."]} className="text-h1 wdth-112" />
          <div className="hero-fade grid max-w-measure gap-4 text-lead text-graphite" style={{ "--i": 2 } as React.CSSProperties}>
            <p>
              We&rsquo;ve passed your request to an independent painter who works in Papillion. They&rsquo;ll contact
              you by phone or email to set up a free on-site quote.
            </p>
            <p className="text-body">
              While you wait: write down which rooms or sides of the house you want done, and if you have an HOA, find
              its approved color list. It makes the walk-through quicker.
            </p>
          </div>
          <div className="hero-fade flex flex-wrap gap-4" style={{ "--i": 3 } as React.CSSProperties}>
            <ButtonLink href={`${nav.cost.href}#estimator`}>Preview colors on your room</ButtonLink>
            <ButtonLink href="/" variant="ghost">Back to home</ButtonLink>
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}

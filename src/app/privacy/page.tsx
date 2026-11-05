import type { Metadata } from "next";
import { PageTransition } from "@/components/page-transition";
import { Container } from "@/components/ui";
import { disclosure, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Papillion Painters collects through its forms, why, and who it's shared with.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const updated = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(site.lastReviewed));
  return (
    <PageTransition>
      <section aria-labelledby="privacy-title" className="py-section">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label text-graphite">Last updated {updated}</p>
            <h1 id="privacy-title" className="mt-5 text-h1 wdth-112">Privacy</h1>
          </div>
          <div className="prose-site max-w-measure lg:col-span-7 lg:col-start-6">
            <p>{disclosure}</p>

            <h2>What we collect</h2>
            <ul>
              <li><strong>Quote requests:</strong> your name, email, phone, ZIP code, the type of work and anything you write in the details box.</li>
              <li><strong>Estimates:</strong> your name, email, optional phone and ZIP, the job details you choose, and the color you picked.</li>
              <li><strong>Room photos:</strong> the color visualizer runs entirely in your browser. A photo you upload is only sent to us if you then email yourself the estimate, and it&rsquo;s attached to that email.</li>
              <li><strong>Painting company inquiries:</strong> your name, company, contact details and what you tell us.</li>
            </ul>
            <p>We don&rsquo;t use advertising trackers, and we don&rsquo;t sell your information.</p>

            <h2>Why, and who sees it</h2>
            <ul>
              <li>A <strong>quote request</strong> is shared with one independent local painter so they can contact you about the job. You agree to this with the checkbox on the form.</li>
              <li>An <strong>estimate</strong> is emailed to you. It&rsquo;s shared with a painter only if you tick &ldquo;have a local painter contact me&rdquo;, and your room preview goes with it only in that case.</li>
              <li>We keep a copy of each request so we can follow up and handle problems.</li>
              <li>We use <a href="https://resend.com" rel="noopener" target="_blank">Resend</a> to send email and Vercel to host the site. They process data on our behalf.</li>
            </ul>

            <h2>Your choices</h2>
            <p>
              To see, correct or delete what we hold about you, email{" "}
              <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. If a painter has already contacted you,
              they have their own records; ask them directly too.
            </p>
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}

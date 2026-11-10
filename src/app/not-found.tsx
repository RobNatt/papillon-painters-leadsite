import type { Metadata } from "next";
import { ButtonLink, Container } from "@/components/ui";
import { nav, site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `Page not found | ${site.name}` },
  description: "This page doesn't exist. Find a Papillion painter or check painting costs instead.",
  robots: { index: false, follow: true },
  openGraph: { title: `Page not found | ${site.name}` },
};

export default function NotFound() {
  return (
    <main id="main" className="py-section">
      <Container className="grid gap-8">
        <p className="label text-graphite">404 · Page not found</p>
        <h1 className="max-w-[16ch] text-h1 wdth-112">This wall hasn&rsquo;t been painted yet.</h1>
        <p className="max-w-measure text-lead text-graphite">The page you&rsquo;re looking for isn&rsquo;t here. Try one of these instead.</p>
        <div className="flex flex-wrap gap-4">
          <ButtonLink href="/">Find a Papillion painter</ButtonLink>
          <ButtonLink href={nav.cost.href} variant="ghost">Painting costs</ButtonLink>
        </div>
      </Container>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbLd, JsonLd } from "@/components/json-ld";
import { PageTransition } from "@/components/page-transition";
import { Container } from "@/components/ui";
import { blogPath, postPath, posts, type Post } from "@/content/posts";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `House Painting Guides for Papillion & Omaha | ${site.name}` },
  description:
    "Plain answers on house painting costs, timing and choosing a painter in Papillion and Omaha, NE, plus guides for painting-company owners.",
  alternates: { canonical: blogPath },
};

function List({ items }: { items: Post[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {items.map((p) => (
        <li key={p.slug} className="grid gap-2 border-t border-line pt-4">
          <Link className="tlink text-lead font-medium" href={postPath(p.slug)}>
            {p.title}
          </Link>
          <p className="text-small text-graphite">{p.excerpt}</p>
        </li>
      ))}
    </ul>
  );
}

export default function BlogIndex() {
  const homeowner = posts.filter((p) => p.audience === "homeowner");
  const painter = posts.filter((p) => p.audience === "painter");
  return (
    <PageTransition>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Guides", path: blogPath },
        ])}
      />
      <section aria-labelledby="blog-title" className="pb-section pt-14 lg:pt-20">
        <Container className="grid gap-12">
          <div className="grid gap-5">
            <nav aria-label="Breadcrumb" className="label text-graphite">
              <Link className="tlink" href="/">Home</Link> <span aria-hidden="true">/</span> Guides
            </nav>
            <h1 id="blog-title" className="max-w-[20ch] text-h1 wdth-112">
              House painting guides for Papillion and Omaha
            </h1>
            <p className="max-w-measure text-lead text-graphite">
              Straight answers to the questions people ask Google before they hire a painter. Every figure links to
              its source. {site.name} is a referral service, not a painting company.
            </p>
          </div>
          {homeowner.length > 0 ? (
            <div className="grid gap-6">
              <h2 className="text-h3">For homeowners</h2>
              <List items={homeowner} />
            </div>
          ) : null}
          {painter.length > 0 ? (
            <div className="grid gap-6">
              <h2 className="text-h3">For painting companies</h2>
              <List items={painter} />
            </div>
          ) : null}
        </Container>
      </section>
    </PageTransition>
  );
}

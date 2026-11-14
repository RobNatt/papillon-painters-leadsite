import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InlineText } from "@/components/inline-text";
import { articleLd, breadcrumbLd, JsonLd } from "@/components/json-ld";
import { PageTransition } from "@/components/page-transition";
import { ButtonLink, Container, Disclosure } from "@/components/ui";
import { blogPath, getPost, postCitations, postPath, posts, readingMinutes } from "@/content/posts";
import { nav, site } from "@/lib/site";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: { absolute: `${post.title} | ${site.name}` },
    description: post.excerpt,
    alternates: { canonical: postPath(post.slug) },
    openGraph: { type: "article", title: post.title, description: post.excerpt, url: postPath(post.slug) },
  };
}

const fmtDate = (d: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
    new Date(d),
  );

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const path = postPath(post.slug);
  const forPainters = post.audience === "painter";
  const others = posts.filter((p) => p.slug !== post.slug && p.audience === post.audience).slice(0, 3);

  return (
    <PageTransition>
      <JsonLd
        data={[
          articleLd({ path, headline: post.title, description: post.excerpt, citation: postCitations(post) }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Guides", path: blogPath },
            { name: post.title, path },
          ]),
        ]}
      />

      <section aria-labelledby="post-title" className="pb-8 pt-14 lg:pt-20">
        <Container className="grid gap-6">
          <nav aria-label="Breadcrumb" className="label text-graphite">
            <Link className="tlink" href="/">Home</Link> <span aria-hidden="true">/</span>{" "}
            <Link className="tlink" href={blogPath}>Guides</Link>
          </nav>
          <h1 id="post-title" className="max-w-[22ch] text-h1 wdth-112">
            {post.title}
          </h1>
          <p className="text-small text-graphite">
            By {site.name}, run by {site.operator.name} · Published {fmtDate(post.date)}
            {post.dateModified !== post.date ? ` · Updated ${fmtDate(post.dateModified)}` : ""} ·{" "}
            {readingMinutes(post)} min read
          </p>
        </Container>
      </section>

      <section className="pb-section-sm">
        <Container>
          <article className="prose-site max-w-measure">
            {post.body.map((b, i) => {
              if (b.type === "h2") return <h2 key={i}>{b.text}</h2>;
              if (b.type === "ul")
                return (
                  <ul key={i}>
                    {b.items.map((item, j) => (
                      <li key={j}>
                        <InlineText text={item} />
                      </li>
                    ))}
                  </ul>
                );
              return (
                <p key={i}>
                  <InlineText text={b.text} />
                </p>
              );
            })}
          </article>
        </Container>
      </section>

      <section aria-labelledby="next-title" className="pb-section-sm">
        <Container>
          <div className="grid gap-5 border-l-4 border-tape bg-chalk p-6 sm:p-8">
            {forPainters ? (
              <>
                <h2 id="next-title" className="text-h3">Run a painting company?</h2>
                <p className="max-w-[60ch] text-graphite">
                  This site is how we show painting companies the search results we can get them. See what a site like
                  this would look like for your business.
                </p>
                <p>
                  <ButtonLink href={nav.painterWebsites.href}>Websites for painting companies</ButtonLink>
                </p>
              </>
            ) : (
              <>
                <h2 id="next-title" className="text-h3">Want a price for your own project?</h2>
                <p className="max-w-[60ch] text-graphite">
                  Tell us about the job and one independent local painter contacts you with a quote. You decide whether
                  to hire them.
                </p>
                <p>
                  <ButtonLink href="/#quote">Get a free quote</ButtonLink>
                </p>
                <Disclosure />
              </>
            )}
          </div>
        </Container>
      </section>

      {others.length > 0 ? (
        <section aria-labelledby="more-title" className="pb-section">
          <Container className="grid gap-6">
            <h2 id="more-title" className="label text-graphite">More guides</h2>
            <ul className="grid gap-4 sm:grid-cols-3">
              {others.map((p) => (
                <li key={p.slug} className="grid gap-2 border-t border-line pt-4">
                  <Link className="tlink font-medium" href={postPath(p.slug)}>
                    {p.title}
                  </Link>
                  <p className="text-small text-graphite">{p.excerpt}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </PageTransition>
  );
}

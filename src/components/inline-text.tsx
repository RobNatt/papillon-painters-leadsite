import Link from "next/link";

/**
 * Renders post text with [words](url) links. Internal paths use next/link;
 * outside sources open in the same tab with rel="noopener".
 */
export function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)\s]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
        if (!m) return part;
        const [, label, href] = m;
        return href.startsWith("/") ? (
          <Link key={i} href={href}>
            {label}
          </Link>
        ) : (
          <a key={i} href={href} rel="noopener">
            {label}
          </a>
        );
      })}
    </>
  );
}

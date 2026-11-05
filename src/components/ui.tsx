import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/** Arrow button rendered as a Link. Magnetic on fine pointers. */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  magnetic = true,
  className = "",
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  magnetic?: boolean;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">) {
  return (
    <Link
      href={href}
      className={`btn btn-${variant} ${className}`}
      data-magnetic={magnetic ? "" : undefined}
      {...rest}
    >
      {children} <span className="arrow" aria-hidden="true">→</span>
    </Link>
  );
}

/**
 * Hero headline split into lines on the server. Each line is a real text
 * node; CSS raises it out of a mask on first paint. Screen readers and
 * crawlers read one plain heading.
 */
export function HeroHeadline({
  lines,
  as: Tag = "h1",
  className = "",
}: {
  lines: string[];
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="hero-line" style={{ "--i": i } as React.CSSProperties}>
          <span>{line}</span>
          {i < lines.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

/** Section eyebrow + heading pair used across pages. */
export function SectionHead({
  eyebrow,
  title,
  intro,
  id,
  className = "",
  invert = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
  className?: string;
  invert?: boolean;
}) {
  return (
    <div className={`grid gap-5 ${className}`}>
      {eyebrow ? (
        <p className={`label ${invert ? "text-white/75" : "text-graphite"}`} data-reveal>
          {eyebrow}
        </p>
      ) : null}
      <h2 id={id} className="text-h2 wdth-104 max-w-[22ch]" data-split>
        {title}
      </h2>
      {intro ? (
        <div className={`max-w-measure text-lead ${invert ? "text-white/85" : "text-graphite"}`} data-reveal>
          {intro}
        </div>
      ) : null}
    </div>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-site px-gutter ${className}`}>{children}</div>;
}

/** Plain-language referral disclosure shown next to every form. */
export function Disclosure({ invert = false, className = "" }: { invert?: boolean; className?: string }) {
  return (
    <p className={`text-small ${invert ? "text-white/75" : "text-graphite"} ${className}`}>
      Papillion Painters is a referral service, not a painting company. We pass your request to an
      independent local painter, who contacts you directly. You decide whether to hire them.
    </p>
  );
}

/** Honeypot field. Hidden from people and assistive tech; bots fill it in. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this empty
        <input type="text" name="website_hp" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

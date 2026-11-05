import { Marquee } from "./marquee";

/** Only things that are true about this site. No ratings, counts or badges. */
const items = [
  { label: "Free for homeowners", icon: "tag" },
  { label: "One painter, not a bidding list", icon: "person" },
  { label: "Papillion & Sarpy County", icon: "pin" },
  { label: "Free on-site quotes", icon: "clipboard" },
  { label: "No account needed", icon: "check" },
] as const;

type Icon = (typeof items)[number]["icon"];

/** 20px line icons, decorative. */
function TrustIcon({ name }: { name: Icon }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className: "flex-none text-tape-hover",
  };
  switch (name) {
    case "tag":
      return (
        <svg {...common}>
          <path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z" />
          <circle cx="8" cy="8" r="1.5" />
        </svg>
      );
    case "person":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common}>
          <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
          <circle cx="12" cy="9.5" r="2.5" />
        </svg>
      );
    case "clipboard":
      return (
        <svg {...common}>
          <rect x="5" y="4" width="14" height="17" rx="1.5" />
          <path d="M9 4V3h6v1M9 11h6M9 15h4" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12.5l2.7 2.7L16 10" />
        </svg>
      );
  }
}

function Item({ label, icon, className = "", reveal = false }: { label: string; icon: Icon; className?: string; reveal?: boolean }) {
  return (
    <li className={`flex items-center gap-3 text-small font-medium whitespace-nowrap ${className}`} data-reveal={reveal ? "" : undefined}>
      <TrustIcon name={icon} />
      <span>{label}</span>
    </li>
  );
}

/**
 * Slim trust bar under the hero. Desktop: one row with thin dividers that
 * fades up once. Phones and tablets: the same items as a slow marquee.
 */
export function TrustBar() {
  return (
    <section aria-label="Why homeowners use Papillion Painters" className="relative border-b border-line bg-chalk">
      <ul className="mx-auto hidden max-w-site items-center justify-between px-gutter py-5 lg:flex" data-reveal-group>
        {items.map((it, i) => (
          <Item key={it.label} {...it} reveal className={i > 0 ? "border-l border-line pl-6" : ""} />
        ))}
      </ul>
      <div className="py-4 lg:hidden">
        <Marquee label="Why homeowners use Papillion Painters" speed={28} groupClassName="gap-10 pr-10">
          {items.map((it) => (
            <Item key={it.label} {...it} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}

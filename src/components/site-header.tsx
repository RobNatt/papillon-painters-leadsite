import Link from "next/link";
import { nav } from "@/lib/site";
import { MobileMenu } from "./mobile-menu";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Three paint chips, the brand mark */}
      <span aria-hidden="true" className="flex h-5 items-stretch gap-[3px]">
        <span className="w-[7px] bg-chip-navy" />
        <span className="w-[7px] bg-chip-forest" />
        <span className="w-[7px] bg-tape" />
      </span>
      <span className="whitespace-nowrap text-[0.9375rem] font-semibold tracking-[-0.01em] wdth-112 min-[380px]:text-[1.0625rem]">Papillion Painters</span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-primer/90 backdrop-blur-md" style={{ viewTransitionName: "site-header" }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-chalk focus:px-4 focus:py-2">
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-site items-center justify-between gap-2 px-gutter min-[400px]:gap-3 md:gap-6 lg:h-20">
        <Link href="/" aria-label="Papillion Painters home" className="tap">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 text-small md:flex">
          <Link className="tlink tap" href="/#how-it-works">How it works</Link>
          <Link className="tlink tap" href={nav.cost.href}>Costs &amp; estimator</Link>
          <Link className="tlink tap" href="/#faq">FAQ</Link>
          <Link className="tlink tap" href="/blog">Guides</Link>
          <Link className="tlink tap" href={nav.painterWebsites.href}>For painters</Link>
          <Link href="/#quote" className="btn btn-primary min-h-11 px-5 py-2.5 text-small" data-magnetic="">
            Get a free quote
          </Link>
        </nav>

        {/* Mobile: the quote button stays in view, plus a no-JS disclosure menu */}
        <div className="flex flex-none items-center gap-1.5 min-[400px]:gap-2 md:hidden">
          <Link href="/#quote" className="btn btn-primary min-h-11 whitespace-nowrap px-3 py-2 text-small min-[400px]:px-4">
            Free quote
          </Link>
          <MobileMenu>
          <nav aria-label="Main" className="absolute right-0 top-[calc(100%+0.5rem)] grid w-[min(20rem,calc(100vw-2rem))] gap-1 bg-chalk p-3 shadow-[0_20px_60px_-20px_rgb(20_26_46/0.35)]">
            <Link className="px-3 py-3 font-medium" href="/#how-it-works">How it works</Link>
            <Link className="px-3 py-3 font-medium" href={nav.cost.href}>Costs &amp; estimator</Link>
            <Link className="px-3 py-3 font-medium" href="/#faq">FAQ</Link>
            <Link className="px-3 py-3 font-medium" href="/blog">Guides</Link>
            <Link className="px-3 py-3 font-medium" href={nav.painterWebsites.href}>For painters</Link>
            <Link className="btn btn-primary mt-2" href="/#quote">Get a free quote</Link>
          </nav>
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}

"use client";

import type { ReactNode } from "react";
import { useRef } from "react";

/** <details> menu that works without JS, and closes after a link is tapped when JS is on. */
export function MobileMenu({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  return (
    <details
      ref={ref}
      className="group relative md:hidden"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) ref.current?.removeAttribute("open");
      }}
    >
      <summary className="flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center gap-2 rounded-pill border border-ink/20 px-3 text-small font-semibold min-[420px]:px-4 [&::-webkit-details-marker]:hidden">
        {/* Narrow phones show just the icon; the word stays for screen readers. */}
        <span className="sr-only min-[420px]:not-sr-only">Menu</span>
        <span aria-hidden="true" className="font-mono transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      {children}
    </details>
  );
}

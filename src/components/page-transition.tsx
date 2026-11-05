import { ViewTransition, type ReactNode } from "react";

/**
 * Wrap each page's content (not the layout) so navigations fade the old page
 * out and raise the new one in. Form and state updates inside don't animate.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      <main id="main">{children}</main>
    </ViewTransition>
  );
}

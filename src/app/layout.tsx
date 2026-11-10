import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { JsonLd, organizationLd, websiteLd } from "@/components/json-ld";
import { MotionRoot, motionBootScript } from "@/components/motion-root";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: "500",
  // Labels and citations only. Preloaded so it's normally ready for first paint;
  // "optional" means it is never swapped in late, so it can't shift text.
  display: "optional",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Painters in Papillion, NE | Free Referral, Not a Contractor",
    template: "%s | Papillion Painters",
  },
  description:
    "A referral service that connects Papillion, Nebraska homeowners with local professional painters. We are not a painting company.",
  applicationName: site.name,
  openGraph: { siteName: site.name, locale: "en_US", type: "website" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#ecedf0",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-US"
      className={`${archivo.variable} ${plexMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Runs before first paint: enables motion styles unless reduced motion is requested. */}
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
      </head>
      <body className="min-h-dvh">
        <SiteHeader />
        {children}
        <SiteFooter />
        <MotionRoot />
        <JsonLd data={[organizationLd, websiteLd]} />
      </body>
    </html>
  );
}

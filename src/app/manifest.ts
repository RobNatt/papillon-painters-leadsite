import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: "A free referral service that connects Papillion, NE homeowners with an independent local painter.",
    start_url: "/",
    display: "browser",
    background_color: "#ecedf0",
    theme_color: "#ecedf0",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}

import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Painting leads for free, from the channels you own";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "For painters", title: "Painting leads for free, from the channels you own", tone: "charcoal" });
}

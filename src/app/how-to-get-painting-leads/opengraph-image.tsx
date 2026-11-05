import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "How to get painting leads: the best free and paid strategies";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "For painters", title: "How to get painting leads: the best free and paid strategies", tone: "charcoal" });
}

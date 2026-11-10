import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Painters in Papillion, NE, one request away";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Papillion, NE", title: "Painters in Papillion, NE, one request away", tone: "navy" });
}

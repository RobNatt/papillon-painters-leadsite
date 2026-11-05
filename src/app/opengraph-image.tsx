import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Professional painters in Papillion, one request away";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Papillion, NE", title: "Professional painters in Papillion, one request away", tone: "navy" });
}

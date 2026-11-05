import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Exterior painting cost in Papillion, and interior too";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Cost guide", title: "Exterior painting cost in Papillion, and interior too", tone: "forest" });
}

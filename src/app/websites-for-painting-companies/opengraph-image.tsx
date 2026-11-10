import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Websites for painting companies that bring in leads";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "For painters", title: "Websites for painting companies that bring in leads", tone: "charcoal" });
}

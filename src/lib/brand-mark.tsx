import { ImageResponse } from "next/og";

/**
 * The brand mark (three paint chips: navy, green, ochre) on the page
 * background, rendered as a PNG. Used for the favicon PNG, the Apple touch
 * icon and the web manifest, and as the Organization logo.
 */
export function renderBrandMark(px: number) {
  const chipW = Math.round(px * 0.15);
  const gap = Math.round(px * 0.06);
  const chipH = Math.round(px * 0.5);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap,
          background: "#ecedf0",
        }}
      >
        <div style={{ width: chipW, height: chipH, background: "#1f2a4d" }} />
        <div style={{ width: chipW, height: chipH, background: "#2f5b46" }} />
        <div style={{ width: chipW, height: chipH, background: "#e2a83c" }} />
      </div>
    ),
    { width: px, height: px },
  );
}

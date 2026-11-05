import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const chips = { navy: "#1f2a4d", forest: "#2f5b46", plum: "#2e1f2e", charcoal: "#1d1b20" } as const;

/** Share image: a paint-chip card with the page's headline. */
export function renderOg({ eyebrow, title, tone }: { eyebrow: string; title: string; tone: keyof typeof chips }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#ecedf0", padding: 48 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: chips[tone],
            color: "#fff",
            padding: 56,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26 }}>
            <div style={{ display: "flex", gap: 4 }}>
              <div style={{ width: 10, height: 30, background: "#fff" }} />
              <div style={{ width: 10, height: 30, background: "#9daa8f" }} />
              <div style={{ width: 10, height: 30, background: "#e2a83c" }} />
            </div>
            <span>Papillion Painters</span>
            <span style={{ marginLeft: "auto", opacity: 0.7, fontSize: 20, letterSpacing: 3, textTransform: "uppercase" }}>{eyebrow}</span>
          </div>
          <div style={{ fontSize: 72, lineHeight: 1, letterSpacing: -2, fontWeight: 700, maxWidth: 940 }}>{title}</div>
          <div style={{ width: 220, height: 10, background: "#e2a83c" }} />
        </div>
      </div>
    ),
    ogSize,
  );
}

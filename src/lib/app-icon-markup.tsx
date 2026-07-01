import type { CSSProperties } from "react";

type AppIconMarkupProps = {
  size: number;
  maskable?: boolean;
};

export function AppIconMarkup({ size, maskable = false }: AppIconMarkupProps) {
  // Non-maskable icons can round their own corners (browser tabs, apple-icon).
  // Maskable icons must stay full-bleed — Android applies its own mask shape.
  const radius = maskable ? 0 : Math.round(size * 0.22);

  // Scale everything down slightly for maskable so it survives the OS crop.
  const scale = maskable ? 0.86 : 1;

  const cardWidth = Math.round(size * 0.5 * scale);
  const cardHeight = Math.round(size * 0.46 * scale);
  const cardRadius = Math.round(size * 0.09 * scale);
  const headerHeight = Math.round(size * 0.1 * scale);
  const ringSize = Math.round(size * 0.045 * scale);
  const ringGap = Math.round(cardWidth * 0.42);

  const container: CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#e08a8a",
    borderRadius: radius,
    position: "relative",
  };

  const ring: CSSProperties = {
    position: "absolute",
    top: Math.round(size * 0.5 - cardHeight / 2 - ringSize * 0.55),
    width: ringSize,
    height: ringSize,
    borderRadius: "50%",
    background: "#ffffff",
    border: `${Math.max(2, Math.round(size * 0.01))}px solid #c4645f`,
  };

  return (
    <div style={container}>
      {/* Calendar spiral-binding rings */}
      <div style={{ ...ring, left: Math.round(size * 0.5 - ringGap / 2 - ringSize / 2) }} />
      <div style={{ ...ring, left: Math.round(size * 0.5 + ringGap / 2 - ringSize / 2) }} />

      {/* Calendar card */}
      <div
        style={{
          width: cardWidth,
          height: cardHeight,
          background: "#ffffff",
          borderRadius: cardRadius,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: `0 ${Math.round(size * 0.02)}px ${Math.round(size * 0.05)}px rgba(80,30,30,0.22)`,
        }}
      >
        {/* Header strip */}
        <div
          style={{
            width: "100%",
            height: headerHeight,
            background: "#c4645f",
            display: "flex",
          }}
        />

        {/* Body with checkmark */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "56%",
              height: "44%",
              display: "flex",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "6%",
                top: "42%",
                width: "34%",
                height: Math.max(4, Math.round(size * 0.052 * scale)),
                background: "#e08a8a",
                borderRadius: 999,
                transform: "rotate(45deg)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: "26%",
                top: "8%",
                width: "62%",
                height: Math.max(4, Math.round(size * 0.052 * scale)),
                background: "#e08a8a",
                borderRadius: 999,
                transform: "rotate(-45deg)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
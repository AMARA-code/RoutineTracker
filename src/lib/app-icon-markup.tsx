import type { CSSProperties, ReactNode } from "react";

type AppIconMarkupProps = {
  size: number;
};

export function AppIconMarkup({ size }: AppIconMarkupProps) {
  const radius = Math.round(size * 0.22);
  const cardSize = Math.round(size * 0.62);
  const cardRadius = Math.round(size * 0.11);

  const dot = (color: string, top: number, left: number, scale = 1): ReactNode => (
    <div
      style={{
        position: "absolute",
        top: Math.round(top * size),
        left: Math.round(left * size),
        width: Math.round(size * 0.08 * scale),
        height: Math.round(size * 0.08 * scale),
        borderRadius: "50%",
        background: color,
        opacity: 0.9,
      }}
    />
  );

  const bar = (width: number, color: string, top: number): ReactNode => (
    <div
      style={{
        width: Math.round(cardSize * width),
        height: Math.max(4, Math.round(size * 0.028)),
        borderRadius: 999,
        background: color,
        marginTop: Math.round(size * 0.018),
      }}
    />
  );

  const container: CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(145deg, #e08a8a 0%, #d47070 42%, #c4b7d4 100%)",
    borderRadius: radius,
    position: "relative",
    overflow: "hidden",
  };

  return (
    <div style={container}>
      {dot("#f5b041", 0.11, 0.14, 0.9)}
      {dot("#aed6f1", 0.16, 0.78, 1.1)}
      {dot("#8da37c", 0.78, 0.12, 0.85)}
      {dot("#fdebd0", 0.72, 0.8, 0.75)}

      <div
        style={{
          width: cardSize,
          height: cardSize,
          background: "rgba(255,255,255,0.96)",
          borderRadius: cardRadius,
          border: `${Math.max(2, Math.round(size * 0.012))}px solid rgba(255,255,255,0.85)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 ${Math.round(size * 0.03)}px ${Math.round(size * 0.08)}px rgba(45,52,54,0.18)`,
        }}
      >
        <div
          style={{
            width: Math.round(cardSize * 0.55),
            height: Math.round(cardSize * 0.55),
            borderRadius: Math.round(size * 0.08),
            border: `${Math.max(2, Math.round(size * 0.01))}px solid #f0e0d6`,
            background: "linear-gradient(180deg, #fff9f0 0%, #ffffff 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingLeft: Math.round(cardSize * 0.14),
            paddingRight: Math.round(cardSize * 0.14),
          }}
        >
          {bar(0.92, "#e08a8a", 0)}
          {bar(0.72, "#c4b7d4", 1)}
          {bar(0.8, "#aed6f1", 2)}
          {bar(0.6, "#8da37c", 3)}
        </div>

        <div
          style={{
            marginTop: Math.round(size * 0.035),
            width: Math.round(size * 0.11),
            height: Math.round(size * 0.11),
            borderRadius: "50%",
            background: "linear-gradient(135deg, #e08a8a, #f5b041)",
            position: "relative",
            display: "flex",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "30%",
              top: "52%",
              width: "22%",
              height: "10%",
              background: "white",
              borderRadius: 999,
              transform: "rotate(45deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "42%",
              top: "44%",
              width: "38%",
              height: "10%",
              background: "white",
              borderRadius: 999,
              transform: "rotate(-45deg)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

import type { CSSProperties } from "react";

type AppIconMarkupProps = {
  size: number;
  maskable?: boolean;
};

export function AppIconMarkup({ size, maskable = false }: AppIconMarkupProps) {
  // Non-maskable icons can round their own corners (browser tabs, apple-icon).
  // Maskable icons must stay full-bleed — Android applies its own mask shape.
  const radius = maskable ? 0 : Math.round(size * 0.22);

  // Keep the letter inside the ~80% safe zone when maskable so it never
  // gets clipped by Android's circle/squircle mask.
  const letterSize = Math.round(size * (maskable ? 0.42 : 0.52));

  const container: CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#e08a8a",
    borderRadius: radius,
  };

  const letter: CSSProperties = {
    fontSize: letterSize,
    fontWeight: 700,
    color: "#ffffff",
    fontFamily: "Georgia, serif",
    lineHeight: 1,
    transform: "translateY(2%)",
  };

  return (
    <div style={container}>
      <div style={letter}>R</div>
    </div>
  );
}
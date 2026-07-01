import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RoutineTracker — Daily Habits & Life Tracking",
    short_name: "RoutineTracker",
    description:
      "Track routines, habits, journal entries, prayer, and personal goals in one beautiful daily hub.",
    start_url: "/home",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fff9f0",
    theme_color: "#e08a8a",
    categories: ["productivity", "lifestyle", "health"],
    icons: [
      {
        src: "/icons/app-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/pwa-icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa-icon-maskable",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}

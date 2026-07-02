import type { HabitCardVariant } from "@/components/ui/habit-stat-card";

export type PageIllustrationKey =
  | "dashboard"
  | "journal"
  | "journalWeekly"
  | "routine"
  | "routineWeekly"
  | "quran"
  | "personal"
  | "settings"
  | "home";

export type FeatureCardConfig = {
  src: string;
  alt: string;
  label: string;
  caption: string;
  variant: HabitCardVariant;
};

export const pageIllustrations: Record<
  PageIllustrationKey,
  { src: string; alt: string }
> = {
  dashboard: {
    src: "/illustrations/investing.svg",
    alt: "Progress and growth illustration",
  },
  journal: {
    src: "/illustrations/candlestick-chart.svg",
    alt: "Candlestick trading chart illustration",
  },
  journalWeekly: {
    src: "/illustrations/investing.svg",
    alt: "Weekly performance chart illustration",
  },
  routine: {
    src: "/illustrations/fitness-stats.svg",
    alt: "Fitness and routine tracking illustration",
  },
  routineWeekly: {
    src: "/illustrations/fitness-stats.svg",
    alt: "Weekly habit trends illustration",
  },
  quran: {
    src: "/illustrations/quran-book.svg",
    alt: "Open Quran illustration",
  },
  personal: {
    src: "/illustrations/morning-plans.svg",
    alt: "Personal reflection illustration",
  },
  settings: {
    src: "/illustrations/alert-bell.svg",
    alt: "Notification bell illustration",
  },
  home: {
    src: "/illustrations/fitness-stats.svg",
    alt: "Daily wellness illustration",
  },
};

export const pageFeatureCards: Record<PageIllustrationKey, FeatureCardConfig[]> =
  {
    home: [
      {
        src: "/illustrations/fitness-stats.svg",
        alt: "Fitness tracking",
        label: "Stay active",
        caption: "Track exercise & build streaks",
        variant: "sage",
      },
      {
        src: "/illustrations/morning-plans.svg",
        alt: "Daily planning",
        label: "Plan your day",
        caption: "Morning routines made simple",
        variant: "peach",
      },
      {
        src: "/illustrations/investing.svg",
        alt: "Progress tracking",
        label: "See progress",
        caption: "Watch your habits grow",
        variant: "coral",
      },
    ],
    dashboard: [
      {
        src: "/illustrations/investing.svg",
        alt: "Growth chart",
        label: "Weekly growth",
        caption: "Journal R & equity trends",
        variant: "coral",
      },
      {
        src: "/illustrations/fitness-stats.svg",
        alt: "Habit stats",
        label: "Habit stats",
        caption: "Exercise, sleep & work",
        variant: "sage",
      },
      {
        src: "/illustrations/morning-plans.svg",
        alt: "Daily plan",
        label: "Today's plan",
        caption: "Quick-log your routine",
        variant: "sky",
      },
    ],
    journal: [
      {
        src: "/illustrations/candlestick-chart.svg",
        alt: "Trade planning chart",
        label: "Plan trades",
        caption: "Strategy before execution",
        variant: "peach",
      },
      {
        src: "/illustrations/market-analysis.svg",
        alt: "Market analysis",
        label: "Analyze markets",
        caption: "Daily notes & screenshots",
        variant: "lavender",
      },
      {
        src: "/illustrations/trade-notebook.svg",
        alt: "Trade journal notebook",
        label: "Daily review",
        caption: "Reflect on every session",
        variant: "sky",
      },
    ],
    journalWeekly: [
      {
        src: "/illustrations/investing.svg",
        alt: "Equity curve",
        label: "Equity curve",
        caption: "Visualize your edge",
        variant: "coral",
      },
      {
        src: "/illustrations/morning-plans.svg",
        alt: "Week comparison",
        label: "Week vs week",
        caption: "Compare performance",
        variant: "peach",
      },
      {
        src: "/illustrations/fitness-stats.svg",
        alt: "Win rate",
        label: "Win rate",
        caption: "Track consistency",
        variant: "sage",
      },
    ],
    routine: [
      {
        src: "/illustrations/fitness-stats.svg",
        alt: "Exercise tracking",
        label: "Move daily",
        caption: "Exercise & wellness",
        variant: "sage",
      },
      {
        src: "/illustrations/morning-news.svg",
        alt: "Morning routine",
        label: "Morning flow",
        caption: "Sleep, work & hydration",
        variant: "sky",
      },
      {
        src: "/illustrations/morning-plans.svg",
        alt: "Habit checklist",
        label: "Habit checklist",
        caption: "Prayers, meals & hygiene",
        variant: "lavender",
      },
    ],
    routineWeekly: [
      {
        src: "/illustrations/fitness-stats.svg",
        alt: "Exercise heatmap",
        label: "Exercise heatmap",
        caption: "7-day movement view",
        variant: "sage",
      },
      {
        src: "/illustrations/investing.svg",
        alt: "Work hours",
        label: "Work hours",
        caption: "Track your grind",
        variant: "peach",
      },
      {
        src: "/illustrations/morning-plans.svg",
        alt: "Sleep pattern",
        label: "Sleep pattern",
        caption: "Rest & recovery",
        variant: "lavender",
      },
    ],
    quran: [
      {
        src: "/illustrations/quran-book.svg",
        alt: "Open Quran",
        label: "Daily reading",
        caption: "Pages & completion",
        variant: "lavender",
      },
      {
        src: "/illustrations/prayer-mat.svg",
        alt: "Prayer mat",
        label: "Reading plan",
        caption: "Stay on schedule",
        variant: "peach",
      },
      {
        src: "/illustrations/tasbeeh-beads.svg",
        alt: "Prayer beads",
        label: "Streak tracking",
        caption: "Build consistency",
        variant: "sage",
      },
    ],
    personal: [
      {
        src: "/illustrations/morning-plans.svg",
        alt: "Mood journal",
        label: "Mood journal",
        caption: "How you feel today",
        variant: "coral",
      },
      {
        src: "/illustrations/morning-news.svg",
        alt: "Reflections",
        label: "Reflections",
        caption: "Personal notes & goals",
        variant: "lavender",
      },
      {
        src: "/illustrations/investing.svg",
        alt: "Growth mindset",
        label: "Growth mindset",
        caption: "One day at a time",
        variant: "sky",
      },
    ],
    settings: [
      {
        src: "/illustrations/alert-bell.svg",
        alt: "Notification bell",
        label: "Smart alerts",
        caption: "Email accountability",
        variant: "lavender",
      },
      {
        src: "/illustrations/settings-sliders.svg",
        alt: "Settings sliders",
        label: "Custom rules",
        caption: "Set your thresholds",
        variant: "peach",
      },
      {
        src: "/illustrations/habit-shield.svg",
        alt: "Shield with checkmark",
        label: "Stay on track",
        caption: "Never miss a habit",
        variant: "coral",
      },
    ],
  };
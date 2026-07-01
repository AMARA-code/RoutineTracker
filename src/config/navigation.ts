import {
  Home,
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  CalendarCheck,
  BarChart3,
  ScrollText,
  User,
  Bell,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  accent?: "ice" | "mint" | "lavender";
};

export const mainNav: NavItem[] = [
  {
    label: "Home",
    href: "/home",
    icon: Home,
    description: "Daily wellness hub",
    accent: "ice",
  },
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Today's snapshot",
    accent: "ice",
  },
  {
    label: "Journal",
    href: "/journal",
    icon: BookOpen,
    description: "Trades, notes & analysis",
    accent: "ice",
  },
  {
    label: "Weekly Journal",
    href: "/journal/weekly",
    icon: TrendingUp,
    description: "Win rate & equity curve",
    accent: "ice",
  },
  {
    label: "Routine Tracker",
    href: "/routine",
    icon: CalendarCheck,
    description: "Work, sleep & habits",
    accent: "mint",
  },
  {
    label: "Weekly Routine",
    href: "/routine/weekly",
    icon: BarChart3,
    description: "Charts & habit trends",
    accent: "mint",
  },
  {
    label: "Quran Tracker",
    href: "/quran",
    icon: ScrollText,
    description: "Daily reading log",
    accent: "lavender",
  },
  {
    label: "Personal Tracker",
    href: "/personal",
    icon: User,
    description: "Personal notes & goals",
    accent: "lavender",
  },
  {
    label: "Alerts & Settings",
    href: "/settings",
    icon: Bell,
    description: "Rules & notifications",
    accent: "lavender",
  },
];

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type HabitCardVariant =
  | "peach"
  | "lavender"
  | "sky"
  | "coral"
  | "sage";

const variantStyles: Record<HabitCardVariant, string> = {
  peach: "habit-card habit-card-peach",
  lavender: "habit-card habit-card-lavender",
  sky: "habit-card habit-card-sky",
  coral: "habit-card habit-card-coral",
  sage: "habit-card habit-card-sage",
};

type HabitStatCardProps = {
  label: string;
  value: string;
  sub?: string;
  icon?: LucideIcon;
  emoji?: string;
  variant?: HabitCardVariant;
  className?: string;
  valueClassName?: string;
};

export function HabitStatCard({
  label,
  value,
  sub,
  icon: Icon,
  emoji,
  variant = "coral",
  className,
  valueClassName,
}: HabitStatCardProps) {
  return (
    <div className={cn(variantStyles[variant], "flex flex-col p-5", className)}>
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/25">
        {emoji ? (
          <span className="text-xl leading-none">{emoji}</span>
        ) : Icon ? (
          <Icon className="h-5 w-5" />
        ) : null}
      </div>
      <p className="text-xs font-medium uppercase tracking-wide opacity-90">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 font-serif text-xl font-bold leading-tight sm:text-2xl",
          valueClassName,
        )}
      >
        {value}
      </p>
      {sub && <p className="mt-1 text-xs opacity-85">{sub}</p>}
    </div>
  );
}

export const habitCardVariants: HabitCardVariant[] = [
  "peach",
  "lavender",
  "sky",
  "coral",
  "sage",
];

export function pickHabitVariant(index: number): HabitCardVariant {
  return habitCardVariants[index % habitCardVariants.length];
}

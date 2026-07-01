import { Moon, Briefcase, Dumbbell } from "lucide-react";
import { HabitStatCard } from "@/components/ui";
import { formatHours } from "@/lib/routine";

export function RoutineSnapshot({
  sleepHours,
  workHours,
  exerciseStreak,
  exercised,
}: {
  sleepHours: number | null;
  workHours: number | null;
  exerciseStreak: number;
  exercised: boolean;
}) {
  const items = [
    {
      label: "Sleep",
      value: formatHours(sleepHours),
      icon: Moon,
      hint: sleepHours != null && sleepHours < 6 ? "Below 6h" : undefined,
      variant: "lavender" as const,
    },
    {
      label: "Work",
      value: formatHours(workHours),
      icon: Briefcase,
      hint: workHours != null && workHours < 9 ? "Below 9h target" : undefined,
      variant: "peach" as const,
    },
    {
      label: "Exercise",
      value: exercised ? "Done" : "Not yet",
      icon: Dumbbell,
      hint: `${exerciseStreak} day streak`,
      variant: "sage" as const,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <HabitStatCard
            key={item.label}
            label={item.label}
            value={item.value}
            sub={item.hint}
            icon={Icon}
            variant={item.variant}
          />
        );
      })}
    </div>
  );
}

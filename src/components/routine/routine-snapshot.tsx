import { Moon, Briefcase, Dumbbell } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
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
    },
    {
      label: "Work",
      value: formatHours(workHours),
      icon: Briefcase,
      hint: workHours != null && workHours < 9 ? "Below 9h target" : undefined,
    },
    {
      label: "Exercise",
      value: exercised ? `✓ Today` : "Not yet",
      icon: Dumbbell,
      hint: `${exerciseStreak} day streak`,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} variant="routine">
            <CardContent className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-xl font-semibold">{item.value}</p>
                {item.hint && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.hint}</p>
                )}
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint/50">
                <Icon className="h-5 w-5 text-[#3d5a4a]" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

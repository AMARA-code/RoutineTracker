import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { WATER_GOAL } from "@/types/routine";
import type { WeeklyRoutineStats } from "@/lib/weekly-routine";

export function WeeklySummaryCard({ stats }: { stats: WeeklyRoutineStats }) {
  const lines = [
    `Worked ${stats.daysWorked}/7 days`,
    stats.avgWorkHours > 0
      ? `avg ${stats.avgWorkHours}h when logged`
      : "no work hours logged",
    `Exercised ${stats.daysExercised}/7 days`,
    stats.daysWithSleep > 0
      ? `avg sleep ${stats.avgSleepHours}h`
      : "no sleep logged",
    `Prayers ${stats.totalPrayers}/35`,
    `Water avg ${stats.avgWaterGlasses}/${WATER_GOAL} glasses/day`,
  ];

  return (
    <Card variant="routine" className="gradient-routine border-0">
      <CardHeader>
        <CardTitle>Weekly summary</CardTitle>
        <CardDescription className="text-foreground/70">
          Your discipline snapshot for the week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium leading-relaxed text-foreground">
          {lines.slice(0, 3).join(" · ")}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {lines.slice(3).join(" · ")}
        </p>
      </CardContent>
    </Card>
  );
}

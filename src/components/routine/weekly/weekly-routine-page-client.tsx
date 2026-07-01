"use client";

import { PageHero } from "@/components/layout/page-hero";
import { PageIllustrationCards } from "@/components/layout/page-illustration-cards";
import { ExerciseHeatmap } from "./exercise-heatmap";
import { PrayerConsistencyChart } from "./prayer-consistency-chart";
import { RoutineWeekSelector } from "./routine-week-selector";
import { SleepPatternChart } from "./sleep-pattern-chart";
import { WaterConsistencyChart } from "./water-consistency-chart";
import { WeeklySummaryCard } from "./weekly-summary-card";
import { WorkHoursChart } from "./work-hours-chart";
import type { WeeklyRoutineStats } from "@/lib/weekly-routine";

export function WeeklyRoutinePageClient({
  stats,
}: {
  stats: WeeklyRoutineStats;
}) {
  return (
    <div>
      <PageHero
        title="Weekly Routine Analysis"
        description="Work hours, sleep patterns, exercise heatmap, and wellness consistency."
        illustration="routineWeekly"
      />

      <PageIllustrationCards page="routineWeekly" className="mb-8" />

      <div className="mb-8">
        <RoutineWeekSelector weekStart={stats.weekStart} />
      </div>

      <div className="mb-8">
        <WeeklySummaryCard stats={stats} />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <WorkHoursChart data={stats.workHoursChart} />
        <SleepPatternChart data={stats.sleepChart} />
      </div>

      <div className="mb-8">
        <ExerciseHeatmap days={stats.exerciseDays} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <WaterConsistencyChart data={stats.waterChart} />
        <PrayerConsistencyChart data={stats.prayerChart} />
      </div>
    </div>
  );
}

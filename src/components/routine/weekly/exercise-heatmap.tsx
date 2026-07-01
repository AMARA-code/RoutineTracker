"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { ExerciseDay } from "@/lib/weekly-routine";

export function ExerciseHeatmap({ days }: { days: ExerciseDay[] }) {
  const exercisedCount = days.filter((d) => d.exercised).length;

  return (
    <Card variant="routine">
      <CardHeader>
        <CardTitle>Exercise streak</CardTitle>
        <CardDescription>
          {exercisedCount}/7 days exercised this week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => (
            <Link
              key={day.date}
              href={`/routine?date=${day.date}`}
              className="group flex flex-col items-center gap-1.5"
            >
              <div
                className={cn(
                  "flex h-12 w-full items-center justify-center rounded-xl border transition-all duration-200",
                  "group-hover:scale-105 group-hover:shadow-sm",
                  day.exercised
                    ? "border-[#a8d4a9] bg-sage/70"
                    : day.hasLog
                      ? "border-coral/50 bg-coral/30"
                      : "border-border bg-muted/40",
                )}
                title={`${day.label}: ${day.exercised ? "Exercised" : day.hasLog ? "No exercise" : "No log"}`}
              >
                <span className="text-lg">
                  {day.exercised ? "✓" : day.hasLog ? "·" : ""}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {day.shortLabel}
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-sage/70" /> Exercised
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-coral/30" /> Skipped
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-muted/40" /> No log
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

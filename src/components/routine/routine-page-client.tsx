"use client";

import { PageHeader } from "@/components/layout/page-header";
import { ExerciseSection } from "./exercise-section";
import { RoutineDateSelector } from "./routine-date-selector";
import { RoutineHistory } from "./routine-history";
import { RoutineNotesSection } from "./routine-notes-section";
import { RoutineSnapshot } from "./routine-snapshot";
import { WellnessSection } from "./wellness-section";
import { WorkSleepSection } from "./work-sleep-section";
import type { DayRoutineData, RoutineHistoryRow } from "@/types/routine";

type RoutinePageClientProps = {
  date: string;
  day: DayRoutineData;
  history: RoutineHistoryRow[];
};

export function RoutinePageClient({
  date,
  day,
  history,
}: RoutinePageClientProps) {
  return (
    <div>
      <PageHeader
        title="Routine & Discipline Tracker"
        description="Log work, sleep, exercise, and daily wellness habits."
      />

      <div className="mb-6">
        <RoutineDateSelector date={date} />
      </div>

      <div className="mb-8">
        <RoutineSnapshot
          sleepHours={day.sleepHours}
          workHours={day.workHours}
          exerciseStreak={day.exerciseStreak}
          exercised={day.routine?.exercised ?? false}
        />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <WorkSleepSection
          key={`work-${date}-${day.routine?.updated_at}`}
          date={date}
          routine={day.routine}
        />
        <ExerciseSection
          key={`exercise-${date}-${day.routine?.exercised}`}
          date={date}
          exercised={day.routine?.exercised ?? false}
          streak={day.exerciseStreak}
        />
      </div>

      <div className="mb-8">
        <WellnessSection
          key={`wellness-${date}`}
          date={date}
          water={day.water}
          prayer={day.prayer}
          meal={day.meal}
          hygiene={day.hygiene}
        />
      </div>

      <div className="mb-8">
        <RoutineNotesSection
          key={`notes-${date}`}
          date={date}
          notes={day.routine?.notes ?? null}
        />
      </div>

      <RoutineHistory rows={history} />
    </div>
  );
}

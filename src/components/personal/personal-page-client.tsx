"use client";

import { PageHeader } from "@/components/layout/page-header";
import { MotionSection } from "@/components/ui/motion-section";
import { PersonalDateSelector } from "./personal-date-selector";
import { PersonalHistory } from "./personal-history";
import { PersonalSnapshot } from "./personal-snapshot";
import { TodayPersonalForm } from "./today-personal-form";
import type { PersonalLog } from "@/types/personal";

export function PersonalPageClient({
  date,
  log,
  streak,
  weekLogged,
  loggedToday,
  history,
}: {
  date: string;
  log: PersonalLog | null;
  streak: number;
  weekLogged: number;
  loggedToday: boolean;
  history: PersonalLog[];
}) {
  return (
    <div>
      <PageHeader
        title="Personal Tracker"
        description="Daily mood, reflections, and personal goals."
      />

      <MotionSection className="mb-6">
        <PersonalDateSelector date={date} />
      </MotionSection>

      <MotionSection delay={0.05} className="mb-8">
        <PersonalSnapshot
          mood={log?.mood ?? null}
          streak={streak}
          weekLogged={weekLogged}
          loggedToday={loggedToday}
        />
      </MotionSection>

      <MotionSection delay={0.1} className="mb-8">
        <TodayPersonalForm
          key={`${date}-${log?.mood}-${log?.updated_at}`}
          date={date}
          log={log}
          streak={streak}
        />
      </MotionSection>

      <MotionSection delay={0.15}>
        <PersonalHistory logs={history} />
      </MotionSection>
    </div>
  );
}

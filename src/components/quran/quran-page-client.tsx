"use client";

import { PageHeader } from "@/components/layout/page-header";
import { QuranDateSelector } from "./quran-date-selector";
import { QuranHistory } from "./quran-history";
import { TodayQuranForm } from "./today-quran-form";
import type { QuranLog } from "@/types/quran";

type QuranPageClientProps = {
  date: string;
  log: QuranLog | null;
  streak: number;
  history: QuranLog[];
};

export function QuranPageClient({
  date,
  log,
  streak,
  history,
}: QuranPageClientProps) {
  return (
    <div>
      <PageHeader
        title="Quran Tracker"
        description="Log daily reading, track your streak, and review your history."
      />

      <div className="mb-6">
        <QuranDateSelector date={date} />
      </div>

      <div className="mb-8">
        <TodayQuranForm
          key={`${date}-${log?.pages_read}-${log?.completed}`}
          date={date}
          log={log}
          streak={streak}
        />
      </div>

      <QuranHistory logs={history} />
    </div>
  );
}

"use client";

import { PageHeader } from "@/components/layout/page-header";
import { BestWorstTrades } from "./best-worst-trades";
import { DailyRChart } from "./daily-r-chart";
import { EquityCurveChart } from "./equity-curve-chart";
import { WeekComparison } from "./week-comparison";
import { WeekSelector } from "./week-selector";
import { WeeklyStatsCards } from "./weekly-stats-cards";
import type { WeeklyAnalysisData } from "@/app/(app)/journal/weekly/actions";

export function WeeklyPageClient({ data }: { data: WeeklyAnalysisData }) {
  const { stats, comparison } = data;

  return (
    <div>
      <PageHeader
        title="Weekly Journal Analysis"
        description="Win rate, total R, equity curve, and week-over-week performance."
      />

      <div className="mb-8">
        <WeekSelector weekStart={stats.weekStart} />
      </div>

      <div className="mb-8">
        <WeeklyStatsCards stats={stats} />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EquityCurveChart data={stats.equityCurve} />
        </div>
        <WeekComparison comparison={comparison} />
      </div>

      <div className="mb-8">
        <DailyRChart data={stats.equityCurve} />
      </div>

      <BestWorstTrades best={stats.bestTrade} worst={stats.worstTrade} />
    </div>
  );
}

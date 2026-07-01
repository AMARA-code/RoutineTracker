import {
  Percent,
  Sigma,
  Target,
  TrendingUp,
} from "lucide-react";
import { HabitStatCard, pickHabitVariant } from "@/components/ui";
import type { WeeklyStats } from "@/lib/weekly-journal";

export function WeeklyStatsCards({ stats }: { stats: WeeklyStats }) {
  const items = [
    {
      label: "Total R",
      value: `${stats.totalR >= 0 ? "+" : ""}${stats.totalR}R`,
      sub: `${stats.tradeCount} trades`,
      icon: TrendingUp,
      positive: stats.totalR >= 0,
    },
    {
      label: "Win rate",
      value: `${stats.winRate}%`,
      sub: `${stats.winCount}W · ${stats.lossCount}L · ${stats.beCount}BE`,
      icon: Percent,
    },
    {
      label: "Avg R",
      value: `${stats.avgR >= 0 ? "+" : ""}${stats.avgR}R`,
      sub: "Per logged trade",
      icon: Sigma,
      positive: stats.avgR >= 0,
    },
    {
      label: "Top strategy",
      value: stats.topStrategy?.name ?? "—",
      sub: stats.topStrategy
        ? `Used ${stats.topStrategy.count}×`
        : "No strategy tagged",
      icon: Target,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <HabitStatCard
            key={item.label}
            label={item.label}
            value={item.value}
            sub={item.sub}
            icon={Icon}
            variant={pickHabitVariant(index)}
            valueClassName={
              item.positive === true
                ? "text-white"
                : item.positive === false
                  ? "text-white/90"
                  : undefined
            }
          />
        );
      })}
    </div>
  );
}

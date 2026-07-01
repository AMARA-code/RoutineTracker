import {
  Percent,
  Sigma,
  Target,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui";
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
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label}>
            <CardContent className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p
                  className={`mt-1 text-2xl font-semibold ${
                    item.positive === true
                      ? "text-[#3d5a3e]"
                      : item.positive === false
                        ? "text-[#5a3a3a]"
                        : ""
                  }`}
                >
                  {item.value}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.sub}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/30">
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

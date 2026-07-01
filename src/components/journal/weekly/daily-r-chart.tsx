"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import type { EquityPoint } from "@/lib/weekly-journal";

export function DailyRChart({ data }: { data: EquityPoint[] }) {
  const hasTrades = data.some((d) => d.tradeCount > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily R breakdown</CardTitle>
        <CardDescription>R gained or lost each day</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasTrades ? (
          <div className="flex h-56 items-center justify-center rounded-xl bg-muted/50 text-sm text-muted-foreground">
            Daily breakdown appears when trades are logged.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8ee" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#6b7c8a" }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8ee" }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6b7c8a" }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8ee" }}
                tickFormatter={(v) => `${v}R`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8ee",
                }}
                formatter={(value) => [`${Number(value ?? 0)}R`, "Daily R"]}
              />
              <Bar dataKey="dailyR" radius={[6, 6, 0, 0]}>
                {data.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.dailyR >= 0 ? "#c9e4ca" : "#f5c6c6"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

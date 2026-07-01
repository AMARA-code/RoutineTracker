"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { WATER_GOAL } from "@/types/routine";
import type { WaterDay } from "@/lib/weekly-routine";

export function WaterConsistencyChart({ data }: { data: WaterDay[] }) {
  const hasData = data.some((d) => d.glasses > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Water intake</CardTitle>
        <CardDescription>Glasses per day vs {WATER_GOAL} goal</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex h-48 items-center justify-center rounded-xl bg-muted/50 text-sm text-muted-foreground">
            Track water on the Routine page to see consistency.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8ee" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#6b7c8a" }}
                tickLine={false}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={55}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6b7c8a" }}
                domain={[0, Math.max(WATER_GOAL + 2, 10)]}
              />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8ee" }}
                formatter={(value) => [`${value} glasses`, "Water"]}
              />
              <ReferenceLine
                y={WATER_GOAL}
                stroke="#b8e2f2"
                strokeDasharray="4 4"
              />
              <Bar
                dataKey="glasses"
                fill="#b8e2f2"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

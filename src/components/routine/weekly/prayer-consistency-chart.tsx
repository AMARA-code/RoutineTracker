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
import type { PrayerDay } from "@/lib/weekly-routine";

const PRAYER_TARGET = 5;

export function PrayerConsistencyChart({ data }: { data: PrayerDay[] }) {
  const hasData = data.some((d) => d.count > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prayer consistency</CardTitle>
        <CardDescription>Prayers completed per day (out of 5)</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex h-48 items-center justify-center rounded-xl bg-muted/50 text-sm text-muted-foreground">
            Log prayers on the Routine page to track consistency.
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
              <YAxis domain={[0, PRAYER_TARGET]} ticks={[0, 1, 2, 3, 4, 5]} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8ee" }}
                formatter={(value) => [`${value}/5`, "Prayers"]}
              />
              <ReferenceLine
                y={PRAYER_TARGET}
                stroke="#d9d3f0"
                strokeDasharray="4 4"
              />
              <Bar dataKey="count" fill="#d9d3f0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

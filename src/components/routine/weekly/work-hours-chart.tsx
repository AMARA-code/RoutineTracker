"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { WORK_HOURS_TARGET, type WorkHoursDay } from "@/lib/weekly-routine";

export function WorkHoursChart({ data }: { data: WorkHoursDay[] }) {
  const chartData = data.map((d) => ({
    ...d,
    displayHours: d.hours ?? 0,
    fill: d.hours != null && d.hours >= WORK_HOURS_TARGET ? "#c9e4ca" : "#c8ead9",
  }));
  const hasData = data.some((d) => d.hours != null);

  return (
    <Card variant="routine">
      <CardHeader>
        <CardTitle>Work hours</CardTitle>
        <CardDescription>
          Daily hours vs {WORK_HOURS_TARGET}h target
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex h-52 items-center justify-center rounded-xl bg-muted/50 text-sm text-muted-foreground">
            Log work times on the Routine page to see this chart.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8ee" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#6b7c8a" }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8ee" }}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={55}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6b7c8a" }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8ee" }}
                domain={[0, "auto"]}
                tickFormatter={(v) => `${v}h`}
              />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8ee" }}
                formatter={(value, _name, props) => {
                  const hours = props.payload?.hours;
                  return [
                    hours != null ? `${hours}h` : "Not logged",
                    "Work hours",
                  ];
                }}
              />
              <ReferenceLine
                y={WORK_HOURS_TARGET}
                stroke="#f5c6c6"
                strokeDasharray="4 4"
                label={{
                  value: `${WORK_HOURS_TARGET}h target`,
                  position: "insideTopRight",
                  fill: "#8b5a5a",
                  fontSize: 11,
                }}
              />
              <Bar dataKey="displayHours" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      entry.hours == null
                        ? "#eef2f5"
                        : entry.hours >= WORK_HOURS_TARGET
                          ? "#c9e4ca"
                          : "#c8ead9"
                    }
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

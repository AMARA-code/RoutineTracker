"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import type { SleepDay } from "@/lib/weekly-routine";

export function SleepPatternChart({ data }: { data: SleepDay[] }) {
  const hasSleep = data.some((d) => d.sleepHours != null);
  const hasTimes = data.some((d) => d.bedtimeHour != null || d.wakeHour != null);

  return (
    <Card variant="routine">
      <CardHeader>
        <CardTitle>Sleep pattern</CardTitle>
        <CardDescription>
          Duration, bedtime & wake time across the week
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasSleep && !hasTimes ? (
          <div className="flex h-52 items-center justify-center rounded-xl bg-muted/50 text-sm text-muted-foreground">
            Log sleep and wake times to see patterns here.
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
                  yAxisId="hours"
                  tick={{ fontSize: 11, fill: "#6b7c8a" }}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8ee" }}
                  tickFormatter={(v) => `${v}h`}
                  domain={[0, "auto"]}
                />
                <YAxis
                  yAxisId="clock"
                  orientation="right"
                  tick={{ fontSize: 10, fill: "#6b7c8a" }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 30]}
                  tickFormatter={(v) => {
                    const h = v >= 24 ? v - 24 : v;
                    return `${Math.floor(h)}:00`;
                  }}
                  hide={!hasTimes}
                />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8ee" }}
                  formatter={(value, name) => {
                    if (name === "sleepHours")
                      return [`${value ?? "—"}h`, "Sleep duration"];
                    if (name === "bedtimeHour")
                      return [formatClock(Number(value)), "Bedtime"];
                    if (name === "wakeHour")
                      return [formatClock(Number(value)), "Wake"];
                    return [value, name];
                  }}
                />
                <Bar
                  yAxisId="hours"
                  dataKey="sleepHours"
                  fill="#d9d3f0"
                  radius={[6, 6, 0, 0]}
                  name="sleepHours"
                />
                {hasTimes && (
                  <>
                    <Line
                      yAxisId="clock"
                      type="monotone"
                      dataKey="bedtimeHour"
                      stroke="#7ec8e3"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="bedtimeHour"
                      connectNulls
                    />
                    <Line
                      yAxisId="clock"
                      type="monotone"
                      dataKey="wakeHour"
                      stroke="#b8e2f2"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="wakeHour"
                      connectNulls
                    />
                  </>
                )}
              </ComposedChart>
            </ResponsiveContainer>
            {hasTimes && (
              <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-4 rounded bg-[#7ec8e3]" /> Bedtime
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-4 rounded bg-[#b8e2f2]" /> Wake
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-4 rounded bg-lavender" /> Duration
                </span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function formatClock(decimal: number): string {
  if (!Number.isFinite(decimal)) return "—";
  const h = decimal >= 24 ? decimal - 24 : decimal;
  const hours = Math.floor(h);
  const mins = Math.round((h - hours) * 60);
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

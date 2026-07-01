"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import type { EquityPoint } from "@/lib/weekly-journal";

type EquityCurveChartProps = {
  data: EquityPoint[];
};

export function EquityCurveChart({ data }: EquityCurveChartProps) {
  const hasTrades = data.some((d) => d.tradeCount > 0);
  const finalR = data.length ? data[data.length - 1].cumulativeR : 0;

  return (
    <Card variant="journal">
      <CardHeader>
        <CardTitle>Equity curve</CardTitle>
        <CardDescription>
          Cumulative R across the week
          {hasTrades && (
            <span
              className={
                finalR >= 0 ? " text-[#3d5a3e]" : " text-[#5a3a3a]"
              }
            >
              {" "}
              · Week total: {finalR >= 0 ? "+" : ""}
              {finalR}R
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasTrades ? (
          <div className="flex h-56 items-center justify-center rounded-xl bg-muted/50 text-sm text-muted-foreground">
            No trades this week — equity curve will appear once you log trades.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8ee" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#6b7c8a" }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8ee" }}
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
                  boxShadow: "0 4px 24px -4px rgba(62, 76, 89, 0.08)",
                }}
                formatter={(value, name) => {
                  const v = Number(value ?? 0);
                  if (name === "cumulativeR") return [`${v}R`, "Cumulative"];
                  if (name === "dailyR") return [`${v}R`, "Daily"];
                  return [v, String(name)];
                }}
                labelFormatter={(label) => label}
              />
              <Line
                type="monotone"
                dataKey="cumulativeR"
                stroke="#7ec8e3"
                strokeWidth={2.5}
                dot={{ fill: "#b8e2f2", stroke: "#7ec8e3", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "#b8e2f2" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Select,
} from "@/components/ui";
import { formatShortDate } from "@/lib/routine";
import type { RoutineHistoryRow } from "@/types/routine";

export function RoutineHistory({ rows }: { rows: RoutineHistoryRow[] }) {
  const [workedOnly, setWorkedOnly] = useState(false);
  const [exercisedOnly, setExercisedOnly] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minWater, setMinWater] = useState("all");

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      if (workedOnly && !row.worked) return false;
      if (exercisedOnly && !row.exercised) return false;
      if (dateFrom && row.log_date < dateFrom) return false;
      if (dateTo && row.log_date > dateTo) return false;
      if (minWater === "goal" && row.water_glasses < 8) return false;
      return true;
    });
  }, [rows, workedOnly, exercisedOnly, dateFrom, dateTo, minWater]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <Checkbox
            label="Worked only"
            checked={workedOnly}
            onChange={(e) => setWorkedOnly(e.target.checked)}
          />
          <Checkbox
            label="Exercised only"
            checked={exercisedOnly}
            onChange={(e) => setExercisedOnly(e.target.checked)}
          />
          <Input
            label="From"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-40"
          />
          <Input
            label="To"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-40"
          />
          <Select
            label="Water"
            value={minWater}
            onChange={(e) => setMinWater(e.target.value)}
            options={[
              { value: "all", label: "All" },
              { value: "goal", label: "8+ glasses" },
            ]}
            className="w-36"
          />
        </div>

        <p className="text-sm text-muted-foreground">
          {filtered.length} of {rows.length} days
        </p>

        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No routine logs yet. Start logging above!
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Work</th>
                  <th className="px-4 py-3 font-medium">Sleep</th>
                  <th className="px-4 py-3 font-medium">Exercise</th>
                  <th className="px-4 py-3 font-medium">Water</th>
                  <th className="px-4 py-3 font-medium">Prayers</th>
                  <th className="px-4 py-3 font-medium">Meals</th>
                  <th className="px-4 py-3 font-medium">Hygiene</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr
                    key={row.log_date}
                    className="border-b border-border last:border-0 hover:bg-muted/20"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/routine?date=${row.log_date}`}
                        className="font-medium hover:underline"
                      >
                        {formatShortDate(row.log_date)}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {row.worked
                        ? row.work_hours != null
                          ? `${row.work_hours}h`
                          : "Yes"
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {row.sleep_hours != null ? `${row.sleep_hours}h` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {row.exercised ? (
                        <span className="text-[#3d5a3e]">✓</span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">{row.water_glasses || "—"}</td>
                    <td className="px-4 py-3">{row.prayers_done || "—"}/5</td>
                    <td className="px-4 py-3">{row.meals_done || "—"}/3</td>
                    <td className="px-4 py-3">{row.hygiene_done || "—"}/3</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

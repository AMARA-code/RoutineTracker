"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Select,
} from "@/components/ui";
import { formatShortDate, isPersonalLogComplete } from "@/lib/personal";
import { MOOD_OPTIONS, type PersonalLog } from "@/types/personal";

function moodLabel(value: string | null) {
  const m = MOOD_OPTIONS.find((o) => o.value === value);
  return m ? `${m.emoji} ${m.label}` : "—";
}

export function PersonalHistory({ logs }: { logs: PersonalLog[] }) {
  const [moodFilter, setMoodFilter] = useState("all");
  const [withGoalsOnly, setWithGoalsOnly] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      if (!isPersonalLogComplete(log)) return false;
      if (moodFilter !== "all" && log.mood !== moodFilter) return false;
      if (withGoalsOnly && !log.goals?.trim()) return false;
      if (dateFrom && log.log_date < dateFrom) return false;
      if (dateTo && log.log_date > dateTo) return false;
      return true;
    });
  }, [logs, moodFilter, withGoalsOnly, dateFrom, dateTo]);

  const moodCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach((log) => {
      if (log.mood) counts[log.mood] = (counts[log.mood] ?? 0) + 1;
    });
    return counts;
  }, [filtered]);

  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal history</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <Select
            label="Mood"
            value={moodFilter}
            onChange={(e) => setMoodFilter(e.target.value)}
            options={[
              { value: "all", label: "All moods" },
              ...MOOD_OPTIONS.map((m) => ({
                value: m.value,
                label: `${m.emoji} ${m.label}`,
              })),
            ]}
            className="w-40"
          />
          <Checkbox
            label="With goals only"
            checked={withGoalsOnly}
            onChange={(e) => setWithGoalsOnly(e.target.checked)}
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
        </div>

        <p className="text-sm text-muted-foreground">
          {filtered.length} entries
          {topMood && (
            <>
              {" "}
              · Most common: {moodLabel(topMood[0])} ({topMood[1]}x)
            </>
          )}
        </p>

        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No personal logs yet. Log today&apos;s mood and reflections above!
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Mood</th>
                  <th className="px-4 py-3 font-medium">Reflection</th>
                  <th className="px-4 py-3 font-medium">Goals</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/personal?date=${log.log_date}`}
                        className="font-medium hover:underline"
                      >
                        {formatShortDate(log.log_date)}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="lavender">{moodLabel(log.mood)}</Badge>
                    </td>
                    <td className="max-w-[240px] truncate px-4 py-3 text-muted-foreground">
                      {log.content || "—"}
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-muted-foreground">
                      {log.goals || "—"}
                    </td>
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

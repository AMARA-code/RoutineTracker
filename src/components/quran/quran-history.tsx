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
import { formatShortDate } from "@/lib/quran";
import type { QuranLog } from "@/types/quran";

export function QuranHistory({ logs }: { logs: QuranLog[] }) {
  const [completedOnly, setCompletedOnly] = useState(false);
  const [surahFilter, setSurahFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const surahs = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => {
      if (l.surah?.trim()) set.add(l.surah.trim());
    });
    return Array.from(set).sort();
  }, [logs]);

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      if (completedOnly && !log.completed) return false;
      if (surahFilter !== "all" && log.surah !== surahFilter) return false;
      if (dateFrom && log.log_date < dateFrom) return false;
      if (dateTo && log.log_date > dateTo) return false;
      return true;
    });
  }, [logs, completedOnly, surahFilter, dateFrom, dateTo]);

  const totalPages = filtered.reduce((sum, l) => sum + l.pages_read, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reading history</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <Checkbox
            label="Completed only"
            checked={completedOnly}
            onChange={(e) => setCompletedOnly(e.target.checked)}
          />
          <Select
            label="Surah"
            value={surahFilter}
            onChange={(e) => setSurahFilter(e.target.value)}
            options={[
              { value: "all", label: "All surahs" },
              ...surahs.map((s) => ({ value: s, label: s })),
            ]}
            className="w-44"
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
          {filtered.length} entries · {totalPages} pages total
        </p>

        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No reading logs yet. Log today&apos;s reading above!
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Pages</th>
                  <th className="px-4 py-3 font-medium">Surah</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Notes</th>
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
                        href={`/quran?date=${log.log_date}`}
                        className="font-medium hover:underline"
                      >
                        {formatShortDate(log.log_date)}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{log.pages_read || "—"}</td>
                    <td className="px-4 py-3">{log.surah || "—"}</td>
                    <td className="px-4 py-3">
                      <Badge variant={log.completed ? "success" : "default"}>
                        {log.completed ? "Complete" : "In progress"}
                      </Badge>
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-muted-foreground">
                      {log.notes || "—"}
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

"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui";
import { formatDisplayDate, shiftDate } from "@/lib/journal";

export function DateSelector({ date }: { date: string }) {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const navigate = (newDate: string) => {
    router.push(`/journal?date=${newDate}`);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(shiftDate(date, -1))}
          aria-label="Previous day"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <input
            type="date"
            value={date}
            onChange={(e) => navigate(e.target.value)}
            className="bg-transparent text-sm font-medium focus:outline-none"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(shiftDate(date, 1))}
          aria-label="Next day"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        {date !== today && (
          <Button variant="ghost" size="sm" onClick={() => navigate(today)}>
            Today
          </Button>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{formatDisplayDate(date)}</p>
    </div>
  );
}

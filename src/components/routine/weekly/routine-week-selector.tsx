"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui";
import { formatDateISO } from "@/lib/journal";
import {
  formatWeekRange,
  getWeekStart,
  shiftWeek,
} from "@/lib/weekly-routine";

export function RoutineWeekSelector({ weekStart }: { weekStart: string }) {
  const router = useRouter();
  const today = formatDateISO(new Date());
  const currentWeekStart = getWeekStart(today);

  const navigate = (newWeekStart: string) => {
    router.push(`/routine/weekly?week=${newWeekStart}`);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(shiftWeek(weekStart, -1))}
          aria-label="Previous week"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2">
          <CalendarRange className="h-4 w-4 text-muted-foreground" />
          <input
            type="date"
            value={weekStart}
            onChange={(e) => navigate(getWeekStart(e.target.value))}
            className="bg-transparent text-sm font-medium focus:outline-none"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(shiftWeek(weekStart, 1))}
          aria-label="Next week"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        {weekStart !== currentWeekStart && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(currentWeekStart)}
          >
            This week
          </Button>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        {formatWeekRange(weekStart)}
      </p>
    </div>
  );
}

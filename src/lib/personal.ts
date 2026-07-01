import { shiftDate } from "@/lib/journal";
import type { PersonalLog } from "@/types/personal";

export type PersonalLogFields = Pick<PersonalLog, "content" | "mood" | "goals">;

/** A day counts toward streak when any field has meaningful content. */
export function isPersonalLogComplete(log: PersonalLogFields): boolean {
  return Boolean(
    log.mood?.trim() || log.content?.trim() || log.goals?.trim(),
  );
}

/** Consecutive logged days ending at `asOfDate`. */
export function computePersonalStreak(
  logs: (PersonalLogFields & { log_date: string })[],
  asOfDate: string,
): number {
  const loggedDates = new Set(
    logs.filter(isPersonalLogComplete).map((l) => l.log_date),
  );

  let streak = 0;
  let cursor = asOfDate;

  while (loggedDates.has(cursor)) {
    streak++;
    cursor = shiftDate(cursor, -1);
  }

  return streak;
}

/** Count days with a log in the last N days ending at `asOfDate` (inclusive). */
export function countLoggedDays(
  logs: (PersonalLogFields & { log_date: string })[],
  asOfDate: string,
  days: number,
): number {
  const loggedDates = new Set(
    logs.filter(isPersonalLogComplete).map((l) => l.log_date),
  );

  let count = 0;
  for (let i = 0; i < days; i++) {
    const d = shiftDate(asOfDate, -i);
    if (loggedDates.has(d)) count++;
  }

  return count;
}

export function formatShortDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function moodEmoji(mood: string | null): string {
  const map: Record<string, string> = {
    great: "😊",
    good: "🙂",
    okay: "😐",
    low: "😔",
    rough: "😞",
  };
  return mood ? (map[mood] ?? "—") : "—";
}

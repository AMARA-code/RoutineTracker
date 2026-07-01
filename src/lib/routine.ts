import { formatDateISO, parseDateISO, shiftDate } from "./journal";
import type { DailyRoutine, PrayerLog } from "@/types/routine";

function parseTime(time: string): { h: number; m: number } {
  const [h, m] = time.split(":").map(Number);
  return { h: h ?? 0, m: m ?? 0 };
}

/** Hours between two HH:MM times; adds 24h if end is before start (overnight). */
export function hoursBetween(start: string, end: string): number | null {
  if (!start || !end) return null;
  const s = parseTime(start);
  const e = parseTime(end);
  let minutes = e.h * 60 + e.m - (s.h * 60 + s.m);
  if (minutes <= 0) minutes += 24 * 60;
  return Math.round((minutes / 60) * 10) / 10;
}

export function calcSleepHours(
  sleepTime: string | null,
  wakeTime: string | null,
): number | null {
  if (!sleepTime || !wakeTime) return null;
  return hoursBetween(sleepTime, wakeTime);
}

export function calcWorkHours(
  worked: boolean,
  workStart: string | null,
  workEnd: string | null,
): number | null {
  if (!worked || !workStart || !workEnd) return null;
  const hours = hoursBetween(workStart, workEnd);
  if (hours === null) return null;
  return hours;
}

export function formatHours(hours: number | null): string {
  if (hours == null) return "—";
  return `${hours}h`;
}

export function countPrayers(prayer: PrayerLog | null): number {
  if (!prayer) return 0;
  return [prayer.fajr, prayer.dhuhr, prayer.asr, prayer.maghrib, prayer.isha].filter(
    Boolean,
  ).length;
}

export function countMeals(
  meal: { breakfast: boolean; lunch: boolean; dinner: boolean } | null,
): number {
  if (!meal) return 0;
  return [meal.breakfast, meal.lunch, meal.dinner].filter(Boolean).length;
}

export function countHygiene(
  hygiene: { shower: boolean; skincare: boolean; teeth: boolean } | null,
): number {
  if (!hygiene) return 0;
  return [hygiene.shower, hygiene.skincare, hygiene.teeth].filter(Boolean).length;
}

/** Consecutive exercised days ending at `asOfDate` (inclusive). */
export function computeExerciseStreak(
  routines: Pick<DailyRoutine, "log_date" | "exercised">[],
  asOfDate: string,
): number {
  const exercisedDates = new Set(
    routines.filter((r) => r.exercised).map((r) => r.log_date),
  );

  let streak = 0;
  let cursor = asOfDate;

  while (exercisedDates.has(cursor)) {
    streak++;
    cursor = shiftDate(cursor, -1);
  }

  return streak;
}

export function todayISO(): string {
  return formatDateISO(new Date());
}

export function formatShortDate(date: string): string {
  return parseDateISO(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Trim Postgres time "HH:MM:SS" → "HH:MM" for input[type=time]. */
export function toTimeInput(value: string | null): string {
  if (!value) return "";
  return value.slice(0, 5);
}

import {
  getWeekEnd,
  getWeekStart,
} from "@/lib/weekly-journal";
import { parseDateISO, shiftDate } from "@/lib/journal";
import {
  calcSleepHours,
  calcWorkHours,
  countPrayers,
} from "@/lib/routine";
import { WATER_GOAL } from "@/types/routine";
import type { DailyRoutine, PrayerLog, WaterLog } from "@/types/routine";

export const WORK_HOURS_TARGET = 9;

export type WorkHoursDay = {
  date: string;
  label: string;
  hours: number | null;
  worked: boolean;
};

export type SleepDay = {
  date: string;
  label: string;
  sleepHours: number | null;
  sleepTime: string | null;
  wakeTime: string | null;
  bedtimeHour: number | null;
  wakeHour: number | null;
};

export type ExerciseDay = {
  date: string;
  label: string;
  shortLabel: string;
  exercised: boolean;
  hasLog: boolean;
};

export type WaterDay = {
  date: string;
  label: string;
  glasses: number;
};

export type PrayerDay = {
  date: string;
  label: string;
  count: number;
};

export type WeeklyRoutineStats = {
  weekStart: string;
  weekEnd: string;
  daysWorked: number;
  daysExercised: number;
  daysWithSleep: number;
  avgWorkHours: number;
  avgSleepHours: number;
  totalPrayers: number;
  avgWaterGlasses: number;
  workHoursChart: WorkHoursDay[];
  sleepChart: SleepDay[];
  exerciseDays: ExerciseDay[];
  waterChart: WaterDay[];
  prayerChart: PrayerDay[];
};

function timeToDecimal(time: string | null): number | null {
  if (!time) return null;
  const [h, m] = time.split(":").map(Number);
  let hours = (h ?? 0) + (m ?? 0) / 60;
  if (hours >= 24) hours -= 24;
  return Math.round(hours * 10) / 10;
}

/** Bedtime often after noon → treat as evening (e.g. 23:00 stays 23, 01:00 → 25 for chart). */
function bedtimeToChartHour(time: string | null): number | null {
  if (!time) return null;
  const decimal = timeToDecimal(time);
  if (decimal == null) return null;
  return decimal < 12 ? decimal + 24 : decimal;
}

function weekDays(weekStart: string): string[] {
  const days: string[] = [];
  let cursor = weekStart;
  const end = getWeekEnd(weekStart);
  while (cursor <= end) {
    days.push(cursor);
    cursor = shiftDate(cursor, 1);
  }
  return days;
}

function dayLabel(date: string): string {
  return parseDateISO(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function shortDayLabel(date: string): string {
  return parseDateISO(date).toLocaleDateString("en-US", { weekday: "short" });
}

function formatTime(time: string | null): string | null {
  if (!time) return null;
  return time.slice(0, 5);
}

export function computeWeeklyRoutineStats(
  routines: DailyRoutine[],
  waters: WaterLog[],
  prayers: PrayerLog[],
  anchorDate: string,
): WeeklyRoutineStats {
  const weekStart = getWeekStart(anchorDate);
  const weekEnd = getWeekEnd(weekStart);
  const days = weekDays(weekStart);

  const routineMap = new Map(routines.map((r) => [r.log_date, r]));
  const waterMap = new Map(waters.map((w) => [w.log_date, w]));
  const prayerMap = new Map(prayers.map((p) => [p.log_date, p]));

  const workHoursChart: WorkHoursDay[] = [];
  const sleepChart: SleepDay[] = [];
  const exerciseDays: ExerciseDay[] = [];
  const waterChart: WaterDay[] = [];
  const prayerChart: PrayerDay[] = [];

  let daysWorked = 0;
  let daysExercised = 0;
  let daysWithSleep = 0;
  let workHoursSum = 0;
  let workHoursCount = 0;
  let sleepHoursSum = 0;
  let sleepHoursCount = 0;
  let totalPrayers = 0;
  let waterSum = 0;

  for (const date of days) {
    const routine = routineMap.get(date);
    const water = waterMap.get(date);
    const prayer = prayerMap.get(date);

    const workH = routine
      ? calcWorkHours(routine.worked, routine.work_start, routine.work_end)
      : null;
    const sleepH = routine
      ? calcSleepHours(routine.sleep_time, routine.wake_time)
      : null;

    if (routine?.worked) daysWorked++;
    if (routine?.exercised) daysExercised++;
    if (sleepH != null) {
      daysWithSleep++;
      sleepHoursSum += sleepH;
      sleepHoursCount++;
    }
    if (workH != null) {
      workHoursSum += workH;
      workHoursCount++;
    }

    const prayerCount = countPrayers(prayer ?? null);
    totalPrayers += prayerCount;
    waterSum += water?.glasses ?? 0;

    workHoursChart.push({
      date,
      label: dayLabel(date),
      hours: workH,
      worked: routine?.worked ?? false,
    });

    sleepChart.push({
      date,
      label: dayLabel(date),
      sleepHours: sleepH,
      sleepTime: formatTime(routine?.sleep_time ?? null),
      wakeTime: formatTime(routine?.wake_time ?? null),
      bedtimeHour: bedtimeToChartHour(routine?.sleep_time ?? null),
      wakeHour: timeToDecimal(routine?.wake_time ?? null),
    });

    exerciseDays.push({
      date,
      label: dayLabel(date),
      shortLabel: shortDayLabel(date),
      exercised: routine?.exercised ?? false,
      hasLog: !!routine,
    });

    waterChart.push({
      date,
      label: dayLabel(date),
      glasses: water?.glasses ?? 0,
    });

    prayerChart.push({
      date,
      label: dayLabel(date),
      count: prayerCount,
    });
  }

  return {
    weekStart,
    weekEnd,
    daysWorked,
    daysExercised,
    daysWithSleep,
    avgWorkHours: workHoursCount
      ? round1(workHoursSum / workHoursCount)
      : 0,
    avgSleepHours: sleepHoursCount
      ? round1(sleepHoursSum / sleepHoursCount)
      : 0,
    totalPrayers,
    avgWaterGlasses: round1(waterSum / 7),
    workHoursChart,
    sleepChart,
    exerciseDays,
    waterChart,
    prayerChart,
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export { getWeekStart, getWeekEnd, shiftWeek, formatWeekRange } from "@/lib/weekly-journal";

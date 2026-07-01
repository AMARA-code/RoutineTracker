import { formatDateISO } from "@/lib/journal";
import { getDayRoutine } from "@/app/(app)/routine/actions";
import { getTradesForDate } from "@/app/(app)/journal/actions";
import { getQuranDay } from "@/app/(app)/quran/actions";
import { getWeeklyAnalysis } from "@/app/(app)/journal/weekly/actions";
import { getWeeklyRoutineAnalysis } from "@/app/(app)/routine/weekly/actions";
import { countHygiene, countMeals } from "@/lib/routine";
import { createClient } from "@/lib/supabase/server";
import type { DailyRoutine, HygieneLog, MealLog, PrayerLog } from "@/types/routine";

export type DashboardData = {
  date: string;
  tradeCount: number;
  worked: boolean;
  sleepHours: number | null;
  workHours: number | null;
  exercised: boolean;
  exerciseStreak: number;
  quranStreak: number;
  waterGlasses: number;
  prayersDone: number;
  mealsDone: number;
  hygieneDone: number;
  routine: DailyRoutine | null;
  prayer: PrayerLog | null;
  meal: MealLog | null;
  hygiene: HygieneLog | null;
  recentAlerts: { message: string; triggered_at: string }[];
  journalWeekR: number;
  journalWeekTrades: number;
  routineWeekWorked: number;
  routineWeekExercised: number;
  workHoursChart: { label: string; hours: number | null }[];
  journalCurve: { label: string; cumulativeR: number }[];
};

export async function getDashboardData(): Promise<DashboardData> {
  const date = formatDateISO(new Date());

  const [day, trades, quran, journalWeek, routineWeek, alerts] =
    await Promise.all([
      getDayRoutine(date),
      getTradesForDate(date),
      getQuranDay(date),
      getWeeklyAnalysis(date),
      getWeeklyRoutineAnalysis(date),
      getRecentAlerts(),
    ]);

  return {
    date,
    tradeCount: trades.length,
    worked: day.routine?.worked ?? false,
    sleepHours: day.sleepHours,
    workHours: day.workHours,
    exercised: day.routine?.exercised ?? false,
    exerciseStreak: day.exerciseStreak,
    quranStreak: quran.streak,
    waterGlasses: day.water?.glasses ?? 0,
    prayersDone: day.prayer
      ? [day.prayer.fajr, day.prayer.dhuhr, day.prayer.asr, day.prayer.maghrib, day.prayer.isha].filter(Boolean).length
      : 0,
    mealsDone: countMeals(day.meal),
    hygieneDone: countHygiene(day.hygiene),
    routine: day.routine,
    prayer: day.prayer,
    meal: day.meal,
    hygiene: day.hygiene,
    recentAlerts: alerts,
    journalWeekR: journalWeek.stats.totalR,
    journalWeekTrades: journalWeek.stats.tradeCount,
    routineWeekWorked: routineWeek.daysWorked,
    routineWeekExercised: routineWeek.daysExercised,
    workHoursChart: routineWeek.workHoursChart.map((d) => ({
      label: d.label.split(",")[0],
      hours: d.hours,
    })),
    journalCurve: journalWeek.stats.equityCurve.map((d) => ({
      label: d.label.split(",")[0],
      cumulativeR: d.cumulativeR,
    })),
  };
}

async function getRecentAlerts() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const since = new Date();
  since.setDate(since.getDate() - 7);

  const { data } = await supabase
    .from("alert_log")
    .select("message, triggered_at")
    .eq("user_id", user.id)
    .gte("triggered_at", since.toISOString())
    .order("triggered_at", { ascending: false })
    .limit(5);

  return data ?? [];
}

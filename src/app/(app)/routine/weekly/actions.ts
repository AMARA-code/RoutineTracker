"use server";

import { createClient } from "@/lib/supabase/server";
import {
  computeWeeklyRoutineStats,
  getWeekEnd,
  getWeekStart,
  type WeeklyRoutineStats,
} from "@/lib/weekly-routine";
import type { DailyRoutine, PrayerLog, WaterLog } from "@/types/routine";

async function getUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function getWeeklyRoutineAnalysis(
  anchorDate?: string,
): Promise<WeeklyRoutineStats> {
  const userId = await getUserId();
  const today = new Date().toISOString().split("T")[0];
  const date = anchorDate || today;
  const weekStart = getWeekStart(date);
  const weekEnd = getWeekEnd(weekStart);

  if (!userId) {
    return computeWeeklyRoutineStats([], [], [], date);
  }

  const supabase = await createClient();

  const [routinesRes, watersRes, prayersRes] = await Promise.all([
    supabase
      .from("daily_routine")
      .select("*")
      .eq("user_id", userId)
      .gte("log_date", weekStart)
      .lte("log_date", weekEnd),
    supabase
      .from("water_log")
      .select("*")
      .eq("user_id", userId)
      .gte("log_date", weekStart)
      .lte("log_date", weekEnd),
    supabase
      .from("prayer_log")
      .select("*")
      .eq("user_id", userId)
      .gte("log_date", weekStart)
      .lte("log_date", weekEnd),
  ]);

  return computeWeeklyRoutineStats(
    (routinesRes.data ?? []) as DailyRoutine[],
    (watersRes.data ?? []) as WaterLog[],
    (prayersRes.data ?? []) as PrayerLog[],
    date,
  );
}

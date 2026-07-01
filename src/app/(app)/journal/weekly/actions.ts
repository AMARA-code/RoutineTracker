"use server";

import { createClient } from "@/lib/supabase/server";
import {
  compareWeeks,
  computeWeeklyStats,
  getWeekEnd,
  getWeekStart,
  shiftWeek,
  type WeeklyComparison,
  type WeeklyStats,
} from "@/lib/weekly-journal";
import type { Trade } from "@/types/journal";

async function getUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function getTradesInRange(
  start: string,
  end: string,
): Promise<Trade[]> {
  const userId = await getUserId();
  if (!userId) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trades")
    .select("*")
    .eq("user_id", userId)
    .gte("trade_date", start)
    .lte("trade_date", end)
    .order("trade_date", { ascending: true })
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data as Trade[];
}

export type WeeklyAnalysisData = {
  stats: WeeklyStats;
  comparison: WeeklyComparison;
};

export async function getWeeklyAnalysis(
  anchorDate?: string,
): Promise<WeeklyAnalysisData> {
  const today = new Date().toISOString().split("T")[0];
  const date = anchorDate || today;
  const weekStart = getWeekStart(date);
  const weekEnd = getWeekEnd(weekStart);

  const prevWeekStart = shiftWeek(weekStart, -1);
  const prevWeekEnd = getWeekEnd(prevWeekStart);

  const [currentTrades, previousTrades] = await Promise.all([
    getTradesInRange(weekStart, weekEnd),
    getTradesInRange(prevWeekStart, prevWeekEnd),
  ]);

  const stats = computeWeeklyStats(currentTrades, weekStart);
  const previousStats = computeWeeklyStats(previousTrades, prevWeekStart);
  const comparison = compareWeeks(stats, previousStats, prevWeekStart);

  return { stats, comparison };
}

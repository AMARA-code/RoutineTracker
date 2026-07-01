import { formatDateISO } from "@/lib/journal";
import { getDayRoutine } from "@/app/(app)/routine/actions";
import { getTradesForDate } from "@/app/(app)/journal/actions";
import { getQuranDay } from "@/app/(app)/quran/actions";
import { createClient } from "@/lib/supabase/server";
import type { PrayerLog } from "@/types/routine";

export type HomeData = {
  date: string;
  userName: string | null;
  waterGlasses: number;
  prayer: PrayerLog | null;
  exercised: boolean;
  exerciseStreak: number;
  quranStreak: number;
  quranDone: boolean;
  tradeCount: number;
  worked: boolean;
  workHours: number | null;
};

export async function getHomeData(): Promise<HomeData> {
  const date = formatDateISO(new Date());
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [day, trades, quran] = await Promise.all([
    getDayRoutine(date),
    getTradesForDate(date),
    getQuranDay(date),
  ]);

  const displayName =
    user?.user_metadata?.full_name ??
    user?.email?.split("@")[0] ??
    null;

  return {
    date,
    userName: displayName,
    waterGlasses: day.water?.glasses ?? 0,
    prayer: day.prayer,
    exercised: day.routine?.exercised ?? false,
    exerciseStreak: day.exerciseStreak,
    quranStreak: quran.streak,
    quranDone: quran.log?.completed ?? false,
    tradeCount: trades.length,
    worked: day.routine?.worked ?? false,
    workHours: day.workHours,
  };
}

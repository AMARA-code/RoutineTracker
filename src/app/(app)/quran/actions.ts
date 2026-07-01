"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { computeQuranStreak } from "@/lib/quran";
import type { QuranLog } from "@/types/quran";

type ActionResult = { error?: string; success?: string };

async function getUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export type QuranDayData = {
  log: QuranLog | null;
  streak: number;
};

export async function getQuranDay(date: string): Promise<QuranDayData> {
  const userId = await getUserId();
  if (!userId) return { log: null, streak: 0 };

  const supabase = await createClient();

  const [logRes, streakRes] = await Promise.all([
    supabase
      .from("quran_log")
      .select("*")
      .eq("user_id", userId)
      .eq("log_date", date)
      .maybeSingle(),
    supabase
      .from("quran_log")
      .select("log_date, completed")
      .eq("user_id", userId)
      .eq("completed", true)
      .order("log_date", { ascending: false })
      .limit(365),
  ]);

  const streak = computeQuranStreak(
    (streakRes.data ?? []) as Pick<QuranLog, "log_date" | "completed">[],
    date,
  );

  return {
    log: logRes.data as QuranLog | null,
    streak,
  };
}

export async function getQuranHistory(limit = 60): Promise<QuranLog[]> {
  const userId = await getUserId();
  if (!userId) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("quran_log")
    .select("*")
    .eq("user_id", userId)
    .order("log_date", { ascending: false })
    .limit(limit);

  return (data ?? []) as QuranLog[];
}

export async function saveQuranLog(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated." };

  const log_date = formData.get("log_date") as string;
  const pages = Math.max(0, Number(formData.get("pages_read") ?? 0));
  const surah = (formData.get("surah") as string)?.trim() || null;
  const completed =
    formData.get("completed") === "on" || formData.get("completed") === "true";
  const notes = (formData.get("notes") as string)?.trim() || null;

  const supabase = await createClient();
  const { error } = await supabase.from("quran_log").upsert(
    {
      user_id: userId,
      log_date,
      pages_read: pages,
      surah,
      completed,
      notes,
    },
    { onConflict: "user_id,log_date" },
  );

  if (error) return { error: error.message };
  revalidatePath("/quran");
  return { success: "Reading log saved." };
}

export async function toggleQuranComplete(
  date: string,
  completed: boolean,
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated." };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("quran_log")
    .select("pages_read, surah, notes")
    .eq("user_id", userId)
    .eq("log_date", date)
    .maybeSingle();

  const { error } = await supabase.from("quran_log").upsert(
    {
      user_id: userId,
      log_date: date,
      completed,
      pages_read: existing?.pages_read ?? 0,
      surah: existing?.surah ?? null,
      notes: existing?.notes ?? null,
    },
    { onConflict: "user_id,log_date" },
  );

  if (error) return { error: error.message };
  revalidatePath("/quran");
  return { success: completed ? "Marked complete!" : "Marked incomplete." };
}

export async function quickAddPages(
  date: string,
  delta: number,
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated." };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("quran_log")
    .select("*")
    .eq("user_id", userId)
    .eq("log_date", date)
    .maybeSingle();

  const pages_read = Math.max(0, (existing?.pages_read ?? 0) + delta);

  const { error } = await supabase.from("quran_log").upsert(
    {
      user_id: userId,
      log_date: date,
      pages_read,
      surah: existing?.surah ?? null,
      completed: existing?.completed ?? false,
      notes: existing?.notes ?? null,
    },
    { onConflict: "user_id,log_date" },
  );

  if (error) return { error: error.message };
  revalidatePath("/quran");
  return { success: "Pages updated." };
}

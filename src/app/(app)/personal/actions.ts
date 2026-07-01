"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  computePersonalStreak,
  countLoggedDays,
  isPersonalLogComplete,
} from "@/lib/personal";
import type { PersonalLog } from "@/types/personal";

type ActionResult = { error?: string; success?: string };

async function getUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export type PersonalDayData = {
  log: PersonalLog | null;
  streak: number;
  weekLogged: number;
  loggedToday: boolean;
};

export async function getPersonalDay(date: string): Promise<PersonalDayData> {
  const userId = await getUserId();
  if (!userId) {
    return { log: null, streak: 0, weekLogged: 0, loggedToday: false };
  }

  const supabase = await createClient();

  const [logRes, streakRes] = await Promise.all([
    supabase
      .from("personal_log")
      .select("*")
      .eq("user_id", userId)
      .eq("log_date", date)
      .maybeSingle(),
    supabase
      .from("personal_log")
      .select("log_date, content, mood, goals")
      .eq("user_id", userId)
      .order("log_date", { ascending: false })
      .limit(365),
  ]);

  const logs = (streakRes.data ?? []) as Pick<
    PersonalLog,
    "log_date" | "content" | "mood" | "goals"
  >[];

  const log = logRes.data as PersonalLog | null;

  return {
    log,
    streak: computePersonalStreak(logs, date),
    weekLogged: countLoggedDays(logs, date, 7),
    loggedToday: log ? isPersonalLogComplete(log) : false,
  };
}

export async function getPersonalLog(date: string): Promise<PersonalLog | null> {
  const { log } = await getPersonalDay(date);
  return log;
}

export async function getPersonalHistory(limit = 60): Promise<PersonalLog[]> {
  const userId = await getUserId();
  if (!userId) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("personal_log")
    .select("*")
    .eq("user_id", userId)
    .order("log_date", { ascending: false })
    .limit(limit);

  return (data ?? []) as PersonalLog[];
}

export async function savePersonalLog(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated." };

  const log_date = formData.get("log_date") as string;
  const content = (formData.get("content") as string)?.trim() || null;
  const mood = (formData.get("mood") as string)?.trim() || null;
  const goals = (formData.get("goals") as string)?.trim() || null;

  const supabase = await createClient();
  const { error } = await supabase.from("personal_log").upsert(
    {
      user_id: userId,
      log_date,
      content,
      mood,
      goals,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,log_date" },
  );

  if (error) return { error: error.message };
  revalidatePath("/personal");
  return { success: "Personal log saved." };
}

export async function quickSetMood(
  date: string,
  mood: string,
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated." };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("personal_log")
    .select("content, goals")
    .eq("user_id", userId)
    .eq("log_date", date)
    .maybeSingle();

  const { error } = await supabase.from("personal_log").upsert(
    {
      user_id: userId,
      log_date: date,
      mood,
      content: existing?.content ?? null,
      goals: existing?.goals ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,log_date" },
  );

  if (error) return { error: error.message };
  revalidatePath("/personal");
  return { success: "Mood updated." };
}

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  calcSleepHours,
  calcWorkHours,
  computeExerciseStreak,
  countHygiene,
  countMeals,
  countPrayers,
} from "@/lib/routine";
import type {
  DayRoutineData,
  DailyRoutine,
  HygieneLog,
  MealLog,
  PrayerLog,
  RoutineHistoryRow,
  WaterLog,
} from "@/types/routine";
import { WATER_GOAL } from "@/types/routine";

type ActionResult = { error?: string; success?: string };

async function getUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

function emptyTime(value: FormDataEntryValue | null): string | null {
  const s = (value as string)?.trim();
  return s || null;
}

function boolField(formData: FormData, name: string): boolean {
  return formData.get(name) === "on" || formData.get(name) === "true";
}

export async function getDayRoutine(date: string): Promise<DayRoutineData> {
  const userId = await getUserId();
  if (!userId) {
    return {
      routine: null,
      water: null,
      prayer: null,
      meal: null,
      hygiene: null,
      sleepHours: null,
      workHours: null,
      exerciseStreak: 0,
    };
  }

  const supabase = await createClient();

  const [routineRes, waterRes, prayerRes, mealRes, hygieneRes, streakRes] =
    await Promise.all([
      supabase
        .from("daily_routine")
        .select("*")
        .eq("user_id", userId)
        .eq("log_date", date)
        .maybeSingle(),
      supabase
        .from("water_log")
        .select("*")
        .eq("user_id", userId)
        .eq("log_date", date)
        .maybeSingle(),
      supabase
        .from("prayer_log")
        .select("*")
        .eq("user_id", userId)
        .eq("log_date", date)
        .maybeSingle(),
      supabase
        .from("meal_log")
        .select("*")
        .eq("user_id", userId)
        .eq("log_date", date)
        .maybeSingle(),
      supabase
        .from("hygiene_log")
        .select("*")
        .eq("user_id", userId)
        .eq("log_date", date)
        .maybeSingle(),
      supabase
        .from("daily_routine")
        .select("log_date, exercised")
        .eq("user_id", userId)
        .eq("exercised", true)
        .order("log_date", { ascending: false })
        .limit(365),
    ]);

  const routine = routineRes.data as DailyRoutine | null;
  const water = waterRes.data as WaterLog | null;
  const prayer = prayerRes.data as PrayerLog | null;
  const meal = mealRes.data as MealLog | null;
  const hygiene = hygieneRes.data as HygieneLog | null;

  const sleepHours = routine
    ? calcSleepHours(routine.sleep_time, routine.wake_time)
    : null;
  const workHours = routine
    ? calcWorkHours(routine.worked, routine.work_start, routine.work_end)
    : null;
  const exerciseStreak = computeExerciseStreak(
    (streakRes.data ?? []) as Pick<DailyRoutine, "log_date" | "exercised">[],
    date,
  );

  return {
    routine,
    water,
    prayer,
    meal,
    hygiene,
    sleepHours,
    workHours,
    exerciseStreak,
  };
}

export async function getRoutineHistory(
  limit = 60,
): Promise<RoutineHistoryRow[]> {
  const userId = await getUserId();
  if (!userId) return [];

  const supabase = await createClient();

  const [routines, waters, prayers, meals, hygienes] = await Promise.all([
    supabase
      .from("daily_routine")
      .select("*")
      .eq("user_id", userId)
      .order("log_date", { ascending: false })
      .limit(limit),
    supabase
      .from("water_log")
      .select("*")
      .eq("user_id", userId)
      .order("log_date", { ascending: false })
      .limit(limit),
    supabase
      .from("prayer_log")
      .select("*")
      .eq("user_id", userId)
      .order("log_date", { ascending: false })
      .limit(limit),
    supabase
      .from("meal_log")
      .select("*")
      .eq("user_id", userId)
      .order("log_date", { ascending: false })
      .limit(limit),
    supabase
      .from("hygiene_log")
      .select("*")
      .eq("user_id", userId)
      .order("log_date", { ascending: false })
      .limit(limit),
  ]);

  const dateSet = new Set<string>();
  routines.data?.forEach((r) => dateSet.add(r.log_date));
  waters.data?.forEach((w) => dateSet.add(w.log_date));
  prayers.data?.forEach((p) => dateSet.add(p.log_date));
  meals.data?.forEach((m) => dateSet.add(m.log_date));
  hygienes.data?.forEach((h) => dateSet.add(h.log_date));

  const routineMap = new Map(
    routines.data?.map((r) => [r.log_date, r as DailyRoutine]) ?? [],
  );
  const waterMap = new Map(
    waters.data?.map((w) => [w.log_date, w as WaterLog]) ?? [],
  );
  const prayerMap = new Map(
    prayers.data?.map((p) => [p.log_date, p as PrayerLog]) ?? [],
  );
  const mealMap = new Map(
    meals.data?.map((m) => [m.log_date, m as MealLog]) ?? [],
  );
  const hygieneMap = new Map(
    hygienes.data?.map((h) => [h.log_date, h as HygieneLog]) ?? [],
  );

  const rows: RoutineHistoryRow[] = Array.from(dateSet)
    .sort((a, b) => b.localeCompare(a))
    .map((log_date) => {
      const routine = routineMap.get(log_date);
      const water = waterMap.get(log_date);
      const prayer = prayerMap.get(log_date);
      const meal = mealMap.get(log_date);
      const hygiene = hygieneMap.get(log_date);

      return {
        log_date,
        worked: routine?.worked ?? false,
        work_hours: routine
          ? calcWorkHours(
              routine.worked,
              routine.work_start,
              routine.work_end,
            )
          : null,
        sleep_hours: routine
          ? calcSleepHours(routine.sleep_time, routine.wake_time)
          : null,
        exercised: routine?.exercised ?? false,
        water_glasses: water?.glasses ?? 0,
        prayers_done: countPrayers(prayer ?? null),
        meals_done: countMeals(meal ?? null),
        hygiene_done: countHygiene(hygiene ?? null),
        notes: routine?.notes ?? null,
      };
    });

  return rows;
}

export async function saveWorkSleep(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated." };

  const log_date = formData.get("log_date") as string;
  const worked = boolField(formData, "worked");

  const supabase = await createClient();
  const { error } = await supabase.from("daily_routine").upsert(
    {
      user_id: userId,
      log_date,
      wake_time: emptyTime(formData.get("wake_time")),
      sleep_time: emptyTime(formData.get("sleep_time")),
      worked,
      work_start: worked ? emptyTime(formData.get("work_start")) : null,
      work_end: worked ? emptyTime(formData.get("work_end")) : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,log_date" },
  );

  if (error) return { error: error.message };
  revalidatePath("/routine");
  revalidatePath("/");
  return { success: "Work & sleep saved." };
}

export async function saveExercise(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated." };

  const log_date = formData.get("log_date") as string;
  const exercised = boolField(formData, "exercised");

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("daily_routine")
    .select("id")
    .eq("user_id", userId)
    .eq("log_date", log_date)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("daily_routine")
      .update({ exercised, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("log_date", log_date);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("daily_routine").insert({
      user_id: userId,
      log_date,
      exercised,
      worked: false,
    });
    if (error) return { error: error.message };
  }

  revalidatePath("/routine");
  revalidatePath("/home");
  revalidatePath("/");
  return { success: exercised ? "Exercise logged!" : "Exercise unchecked." };
}

export async function saveNotes(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated." };

  const log_date = formData.get("log_date") as string;
  const notes = (formData.get("notes") as string)?.trim() || null;

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("daily_routine")
    .select("id")
    .eq("user_id", userId)
    .eq("log_date", log_date)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("daily_routine")
      .update({ notes, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("log_date", log_date);
  } else {
    await supabase.from("daily_routine").insert({
      user_id: userId,
      log_date,
      notes,
      worked: false,
      exercised: false,
    });
  }

  revalidatePath("/routine");
  revalidatePath("/");
  return { success: "Notes saved." };
}

export async function saveWellness(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated." };

  const log_date = formData.get("log_date") as string;
  const glasses = Math.max(0, Number(formData.get("glasses") ?? 0));

  const supabase = await createClient();

  const [waterErr, prayerErr, mealErr, hygieneErr] = await Promise.all([
    supabase.from("water_log").upsert(
      { user_id: userId, log_date, glasses },
      { onConflict: "user_id,log_date" },
    ),
    supabase.from("prayer_log").upsert(
      {
        user_id: userId,
        log_date,
        fajr: boolField(formData, "fajr"),
        dhuhr: boolField(formData, "dhuhr"),
        asr: boolField(formData, "asr"),
        maghrib: boolField(formData, "maghrib"),
        isha: boolField(formData, "isha"),
      },
      { onConflict: "user_id,log_date" },
    ),
    supabase.from("meal_log").upsert(
      {
        user_id: userId,
        log_date,
        breakfast: boolField(formData, "breakfast"),
        lunch: boolField(formData, "lunch"),
        dinner: boolField(formData, "dinner"),
        notes: (formData.get("meal_notes") as string)?.trim() || null,
      },
      { onConflict: "user_id,log_date" },
    ),
    supabase.from("hygiene_log").upsert(
      {
        user_id: userId,
        log_date,
        shower: boolField(formData, "shower"),
        skincare: boolField(formData, "skincare"),
        teeth: boolField(formData, "teeth"),
      },
      { onConflict: "user_id,log_date" },
    ),
  ]).then((results) => results.map((r) => r.error));

  const err = waterErr || prayerErr || mealErr || hygieneErr;
  if (err) return { error: err.message };

  revalidatePath("/routine");
  revalidatePath("/");
  return { success: "Wellness log saved." };
}

export async function setWaterGlasses(
  date: string,
  count: number,
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated." };

  const glasses = Math.max(0, Math.min(WATER_GOAL, count));
  const supabase = await createClient();

  const { error } = await supabase.from("water_log").upsert(
    { user_id: userId, log_date: date, glasses },
    { onConflict: "user_id,log_date" },
  );

  if (error) return { error: error.message };
  revalidatePath("/routine");
  revalidatePath("/home");
  revalidatePath("/");
  return { success: "Water updated." };
}

export async function updateWaterGlasses(
  date: string,
  delta: number,
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated." };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("water_log")
    .select("glasses")
    .eq("user_id", userId)
    .eq("log_date", date)
    .maybeSingle();

  const glasses = Math.max(0, (existing?.glasses ?? 0) + delta);

  const { error } = await supabase.from("water_log").upsert(
    { user_id: userId, log_date: date, glasses },
    { onConflict: "user_id,log_date" },
  );

  if (error) return { error: error.message };
  revalidatePath("/routine");
  revalidatePath("/home");
  revalidatePath("/");
  return { success: "Water updated." };
}

type PrayerField = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
type MealField = "breakfast" | "lunch" | "dinner";
type HygieneField = "shower" | "skincare" | "teeth";

export async function togglePrayerField(
  date: string,
  field: PrayerField,
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated." };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("prayer_log")
    .select("*")
    .eq("user_id", userId)
    .eq("log_date", date)
    .maybeSingle();

  const current = (existing as PrayerLog | null)?.[field] ?? false;
  const defaults = {
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
    ...(existing ?? {}),
    [field]: !current,
  };

  const { error } = await supabase.from("prayer_log").upsert(
    { user_id: userId, log_date: date, ...defaults },
    { onConflict: "user_id,log_date" },
  );

  if (error) return { error: error.message };
  revalidatePath("/routine");
  revalidatePath("/home");
  revalidatePath("/");
  return { success: "Prayer updated." };
}

export async function toggleMealField(
  date: string,
  field: MealField,
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated." };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("meal_log")
    .select("*")
    .eq("user_id", userId)
    .eq("log_date", date)
    .maybeSingle();

  const current = (existing as MealLog | null)?.[field] ?? false;
  const defaults = {
    breakfast: false,
    lunch: false,
    dinner: false,
    notes: existing?.notes ?? null,
    ...(existing ?? {}),
    [field]: !current,
  };

  const { error } = await supabase.from("meal_log").upsert(
    { user_id: userId, log_date: date, ...defaults },
    { onConflict: "user_id,log_date" },
  );

  if (error) return { error: error.message };
  revalidatePath("/routine");
  revalidatePath("/");
  return { success: "Meal updated." };
}

export async function toggleHygieneField(
  date: string,
  field: HygieneField,
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated." };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("hygiene_log")
    .select("*")
    .eq("user_id", userId)
    .eq("log_date", date)
    .maybeSingle();

  const current = (existing as HygieneLog | null)?.[field] ?? false;
  const defaults = {
    shower: false,
    skincare: false,
    teeth: false,
    ...(existing ?? {}),
    [field]: !current,
  };

  const { error } = await supabase.from("hygiene_log").upsert(
    { user_id: userId, log_date: date, ...defaults },
    { onConflict: "user_id,log_date" },
  );

  if (error) return { error: error.message };
  revalidatePath("/routine");
  revalidatePath("/");
  return { success: "Hygiene updated." };
}

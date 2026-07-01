export type DailyRoutine = {
  id: string;
  log_date: string;
  wake_time: string | null;
  sleep_time: string | null;
  worked: boolean;
  work_start: string | null;
  work_end: string | null;
  exercised: boolean;
  notes: string | null;
  updated_at?: string;
};

export type WaterLog = {
  log_date: string;
  glasses: number;
};

export type PrayerLog = {
  log_date: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
};

export type MealLog = {
  log_date: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  notes: string | null;
};

export type HygieneLog = {
  log_date: string;
  shower: boolean;
  skincare: boolean;
  teeth: boolean;
};

export type DayRoutineData = {
  routine: DailyRoutine | null;
  water: WaterLog | null;
  prayer: PrayerLog | null;
  meal: MealLog | null;
  hygiene: HygieneLog | null;
  sleepHours: number | null;
  workHours: number | null;
  exerciseStreak: number;
};

export type RoutineHistoryRow = {
  log_date: string;
  worked: boolean;
  work_hours: number | null;
  sleep_hours: number | null;
  exercised: boolean;
  water_glasses: number;
  prayers_done: number;
  meals_done: number;
  hygiene_done: number;
  notes: string | null;
};

export const WATER_GOAL = 8;

export const PRAYER_FIELDS = [
  { key: "fajr" as const, label: "Fajr" },
  { key: "dhuhr" as const, label: "Dhuhr" },
  { key: "asr" as const, label: "Asr" },
  { key: "maghrib" as const, label: "Maghrib" },
  { key: "isha" as const, label: "Isha" },
];

export const MEAL_FIELDS = [
  { key: "breakfast" as const, label: "Breakfast" },
  { key: "lunch" as const, label: "Lunch" },
  { key: "dinner" as const, label: "Dinner" },
];

export const HYGIENE_FIELDS = [
  { key: "shower" as const, label: "Shower" },
  { key: "skincare" as const, label: "Skincare" },
  { key: "teeth" as const, label: "Teeth" },
];

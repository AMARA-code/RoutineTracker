"use client";

import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import { AlertTriangle, Droplets, Plus } from "lucide-react";
import {
  saveExercise,
  saveWorkSleep,
  toggleHygieneField,
  toggleMealField,
  togglePrayerField,
  updateWaterGlasses,
} from "@/app/(app)/routine/actions";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  TimePicker,
  Toggle,
} from "@/components/ui";
import {
  calcSleepHours,
  calcWorkHours,
  toTimeInput,
} from "@/lib/routine";
import {
  HYGIENE_FIELDS,
  MEAL_FIELDS,
  PRAYER_FIELDS,
  WATER_GOAL,
  type DailyRoutine,
  type HygieneLog,
  type MealLog,
  type PrayerLog,
} from "@/types/routine";

export function DashboardQuickLog({
  date,
  waterGlasses,
  exercised,
  prayer,
  meal,
  hygiene,
}: {
  date: string;
  waterGlasses: number;
  exercised: boolean;
  prayer: PrayerLog | null;
  meal: MealLog | null;
  hygiene: HygieneLog | null;
}) {
  const [pending, startTransition] = useTransition();

  const togglePrayer = (field: (typeof PRAYER_FIELDS)[number]["key"]) => {
    startTransition(() => {
      void togglePrayerField(date, field);
    });
  };

  const toggleMeal = (field: (typeof MEAL_FIELDS)[number]["key"]) => {
    startTransition(() => {
      void toggleMealField(date, field);
    });
  };

  const toggleHygiene = (field: (typeof HYGIENE_FIELDS)[number]["key"]) => {
    startTransition(() => {
      void toggleHygieneField(date, field);
    });
  };

  return (
    <Card variant="routine">
      <CardHeader>
        <CardTitle className="text-base">Wellness quick-log</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            disabled={pending}
            onClick={() =>
              startTransition(() => {
                void updateWaterGlasses(date, 1);
              })
            }
          >
            <Droplets className="h-4 w-4 text-[#4a90b8]" />
            Water +1 ({waterGlasses}/{WATER_GOAL})
          </Button>
          <Button
            variant={exercised ? "secondary" : "outline"}
            size="sm"
            className="rounded-full"
            disabled={pending}
            onClick={() => {
              const fd = new FormData();
              fd.set("log_date", date);
              fd.set("exercised", exercised ? "false" : "true");
              startTransition(() => {
                void saveExercise(null, fd);
              });
            }}
          >
            Exercise {exercised ? "✓" : "—"}
          </Button>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Prayers</p>
          <div className="flex flex-wrap gap-1.5">
            {PRAYER_FIELDS.map(({ key, label }) => (
              <Button
                key={key}
                variant={prayer?.[key] ? "secondary" : "outline"}
                size="sm"
                className="rounded-full"
                disabled={pending}
                onClick={() => togglePrayer(key)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Meals</p>
          <div className="flex flex-wrap gap-1.5">
            {MEAL_FIELDS.map(({ key, label }) => (
              <Button
                key={key}
                variant={meal?.[key] ? "secondary" : "outline"}
                size="sm"
                className="rounded-full"
                disabled={pending}
                onClick={() => toggleMeal(key)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Hygiene</p>
          <div className="flex flex-wrap gap-1.5">
            {HYGIENE_FIELDS.map(({ key, label }) => (
              <Button
                key={key}
                variant={hygiene?.[key] ? "secondary" : "outline"}
                size="sm"
                className="rounded-full"
                disabled={pending}
                onClick={() => toggleHygiene(key)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        <Link href="/routine">
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4" />
            Full routine
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export function DashboardWorkBody({
  date,
  routine,
}: {
  date: string;
  routine: DailyRoutine | null;
}) {
  const [worked, setWorked] = useState(routine?.worked ?? false);
  const [wake, setWake] = useState(toTimeInput(routine?.wake_time ?? null));
  const [sleep, setSleep] = useState(toTimeInput(routine?.sleep_time ?? null));
  const [workStart, setWorkStart] = useState(
    toTimeInput(routine?.work_start ?? null),
  );
  const [workEnd, setWorkEnd] = useState(toTimeInput(routine?.work_end ?? null));

  const [state, formAction, pending] = useActionState(saveWorkSleep, null);

  const sleepHours = calcSleepHours(sleep || null, wake || null);
  const workHours = calcWorkHours(worked, workStart || null, workEnd || null);

  return (
    <Card variant="routine">
      <CardHeader>
        <CardTitle className="text-base">Work & body</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="log_date" value={date} />
          <input type="hidden" name="worked" value={worked ? "true" : "false"} />

          <div className="grid gap-3 sm:grid-cols-2">
            <TimePicker
              label="Sleep"
              name="sleep_time"
              value={sleep}
              onChange={(e) => setSleep(e.target.value)}
            />
            <TimePicker
              label="Wake"
              name="wake_time"
              value={wake}
              onChange={(e) => setWake(e.target.value)}
            />
          </div>

          {sleepHours != null && (
            <p className="text-xs text-muted-foreground">
              Sleep: <strong>{sleepHours}h</strong>
            </p>
          )}

          <Toggle label="Worked today?" checked={worked} onChange={setWorked} />

          {worked && (
            <div className="grid gap-3 sm:grid-cols-2">
              <TimePicker
                label="Work start"
                name="work_start"
                value={workStart}
                onChange={(e) => setWorkStart(e.target.value)}
              />
              <TimePicker
                label="Work end"
                name="work_end"
                value={workEnd}
                onChange={(e) => setWorkEnd(e.target.value)}
              />
            </div>
          )}

          {worked && workHours != null && (
            <p className="text-xs text-muted-foreground">
              Hours: <strong>{workHours}h</strong>
              {workHours < 9 && (
                <span className="text-[#8b5a5a]"> — below 9h</span>
              )}
            </p>
          )}

          <div className="flex items-center gap-2">
            <Button type="submit" size="sm" loading={pending}>
              Save
            </Button>
            {state?.success && (
              <span className="text-xs text-[#3d5a3e]">{state.success}</span>
            )}
            {state?.error && (
              <span className="text-xs text-[#8b5a5a]">{state.error}</span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function AlertsBanner({
  alerts,
}: {
  alerts: { message: string; triggered_at: string }[];
}) {
  if (!alerts.length) return null;

  return (
    <Card className="border-coral/50 bg-coral/20">
      <CardContent className="flex items-start gap-3 py-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#5a3a3a]" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-[#5a3a3a]">Active alerts</p>
          {alerts.map((a, i) => (
            <p key={i} className="text-sm text-[#5a3a3a]/90">
              {a.message}
            </p>
          ))}
          <Link href="/settings" className="text-xs font-medium hover:underline">
            Manage alerts →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
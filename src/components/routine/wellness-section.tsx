"use client";

import { useActionState, useState, useTransition } from "react";
import { Droplets, Minus, Plus } from "lucide-react";
import { saveWellness, updateWaterGlasses } from "@/app/(app)/routine/actions";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Textarea,
} from "@/components/ui";
import {
  HYGIENE_FIELDS,
  MEAL_FIELDS,
  PRAYER_FIELDS,
  WATER_GOAL,
} from "@/types/routine";
import type { HygieneLog, MealLog, PrayerLog, WaterLog } from "@/types/routine";

export function WellnessSection({
  date,
  water,
  prayer,
  meal,
  hygiene,
}: {
  date: string;
  water: WaterLog | null;
  prayer: PrayerLog | null;
  meal: MealLog | null;
  hygiene: HygieneLog | null;
}) {
  const [glasses, setGlasses] = useState(water?.glasses ?? 0);
  const [state, formAction, pending] = useActionState(saveWellness, null);
  const [waterPending, startWaterTransition] = useTransition();

  const adjustWater = (delta: number) => {
    const next = Math.max(0, glasses + delta);
    setGlasses(next);
    startWaterTransition(async () => {
      await updateWaterGlasses(date, delta);
    });
  };

  return (
    <Card variant="routine">
      <CardHeader>
        <CardTitle>Wellness log</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="log_date" value={date} />
          <input type="hidden" name="glasses" value={glasses} />

          {/* Water */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Droplets className="h-4 w-4 text-primary-foreground" />
                Water — {glasses}/{WATER_GOAL} glasses
              </span>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => adjustWater(-1)}
                  disabled={glasses <= 0 || waterPending}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => adjustWater(1)}
                  disabled={waterPending}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{
                  width: `${Math.min(100, (glasses / WATER_GOAL) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Prayers */}
          <div>
            <p className="mb-2 text-sm font-medium">Prayers</p>
            <div className="flex flex-wrap gap-4">
              {PRAYER_FIELDS.map(({ key, label }) => (
                <Checkbox
                  key={key}
                  name={key}
                  label={label}
                  defaultChecked={prayer?.[key] ?? false}
                />
              ))}
            </div>
          </div>

          {/* Meals */}
          <div>
            <p className="mb-2 text-sm font-medium">Meals</p>
            <div className="flex flex-wrap gap-4">
              {MEAL_FIELDS.map(({ key, label }) => (
                <Checkbox
                  key={key}
                  name={key}
                  label={label}
                  defaultChecked={meal?.[key] ?? false}
                />
              ))}
            </div>
            <Textarea
              name="meal_notes"
              label="Meal notes"
              placeholder="Optional — what you ate, how you felt..."
              defaultValue={meal?.notes ?? ""}
              rows={2}
              className="mt-3"
            />
          </div>

          {/* Hygiene */}
          <div>
            <p className="mb-2 text-sm font-medium">Hygiene</p>
            <div className="flex flex-wrap gap-4">
              {HYGIENE_FIELDS.map(({ key, label }) => (
                <Checkbox
                  key={key}
                  name={key}
                  label={label}
                  defaultChecked={hygiene?.[key] ?? false}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" size="sm" loading={pending}>
              Save wellness
            </Button>
            {state?.success && (
              <span className="text-sm text-[#3d5a3e]">{state.success}</span>
            )}
            {state?.error && (
              <span className="text-sm text-[#8b5a5a]">{state.error}</span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

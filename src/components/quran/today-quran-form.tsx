"use client";

import { useActionState, useState, useTransition } from "react";
import { BookOpen, Flame } from "lucide-react";
import {
  quickAddPages,
  saveQuranLog,
  toggleQuranComplete,
} from "@/app/(app)/quran/actions";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  Textarea,
  Toggle,
} from "@/components/ui";
import { SURAH_NAMES } from "@/lib/quran";
import { PAGE_PRESETS, type QuranLog } from "@/types/quran";

export function TodayQuranForm({
  date,
  log,
  streak,
}: {
  date: string;
  log: QuranLog | null;
  streak: number;
}) {
  const [pages, setPages] = useState(log?.pages_read ?? 0);
  const [completed, setCompleted] = useState(log?.completed ?? false);
  const [state, formAction, pending] = useActionState(saveQuranLog, null);
  const [togglePending, startToggle] = useTransition();
  const [pagesPending, startPages] = useTransition();

  const surahOptions = [
    { value: "", label: "Select surah (optional)" },
    ...SURAH_NAMES.map((name) => ({ value: name, label: name })),
  ];

  const handleToggle = (value: boolean) => {
    setCompleted(value);
    startToggle(async () => {
      await toggleQuranComplete(date, value);
    });
  };

  const addPages = (amount: number) => {
    const next = pages + amount;
    setPages(next);
    startPages(async () => {
      await quickAddPages(date, amount);
    });
  };

  return (
    <Card variant="alerts">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Today&apos;s reading
          </CardTitle>
          <Badge variant="lavender" className="gap-1">
            <Flame className="h-3 w-3" />
            {streak} day streak
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <Toggle
          label="Reading completed for today?"
          checked={completed}
          onChange={handleToggle}
          disabled={togglePending}
        />

        <div>
          <p className="mb-2 text-sm font-medium">Quick add pages</p>
          <div className="flex flex-wrap gap-2">
            {PAGE_PRESETS.map((n) => (
              <Button
                key={n}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addPages(n)}
                disabled={pagesPending}
              >
                +{n}
              </Button>
            ))}
          </div>
        </div>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="log_date" value={date} />
          <input type="hidden" name="completed" value={completed ? "true" : "false"} />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Pages read"
              name="pages_read"
              type="number"
              min={0}
              value={pages}
              onChange={(e) => setPages(Number(e.target.value) || 0)}
            />
            <Select
              label="Surah"
              name="surah"
              defaultValue={log?.surah ?? ""}
              options={surahOptions}
            />
          </div>

          <Textarea
            label="Notes"
            name="notes"
            placeholder="Reflections, ayat that stood out..."
            defaultValue={log?.notes ?? ""}
            rows={3}
          />

          {state?.error && (
            <p className="rounded-xl bg-coral/40 px-3 py-2 text-sm text-[#5a3a3a]">
              {state.error}
            </p>
          )}
          {state?.success && (
            <p className="text-sm text-[#3d5a3e]">{state.success}</p>
          )}

          <Button type="submit" loading={pending}>
            Save reading log
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

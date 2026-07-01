"use client";

import { useActionState, useState, useTransition } from "react";
import { Flame, User } from "lucide-react";
import { quickSetMood, savePersonalLog } from "@/app/(app)/personal/actions";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  Textarea,
} from "@/components/ui";
import { MOOD_OPTIONS, type PersonalLog } from "@/types/personal";

export function TodayPersonalForm({
  date,
  log,
  streak,
}: {
  date: string;
  log: PersonalLog | null;
  streak: number;
}) {
  const [mood, setMood] = useState(log?.mood ?? "");
  const [state, formAction, pending] = useActionState(savePersonalLog, null);
  const [moodPending, startMood] = useTransition();

  const moodOptions = [
    { value: "", label: "How are you feeling?" },
    ...MOOD_OPTIONS.map((m) => ({
      value: m.value,
      label: `${m.emoji} ${m.label}`,
    })),
  ];

  const handleQuickMood = (value: string) => {
    setMood(value);
    startMood(async () => {
      await quickSetMood(date, value);
    });
  };

  return (
    <Card variant="alerts">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Today&apos;s personal log
          </CardTitle>
          <Badge variant="lavender" className="gap-1">
            <Flame className="h-3 w-3" />
            {streak} day streak
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-5">
          <p className="mb-2 text-sm font-medium">Quick mood</p>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map((m) => (
              <Button
                key={m.value}
                type="button"
                variant={mood === m.value ? "primary" : "outline"}
                size="sm"
                onClick={() => handleQuickMood(m.value)}
                disabled={moodPending}
              >
                {m.emoji} {m.label}
              </Button>
            ))}
          </div>
        </div>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="log_date" value={date} />
          <Select
            label="Mood"
            name="mood"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            options={moodOptions}
          />
          <Textarea
            label="What's on your mind?"
            name="content"
            placeholder="Thoughts, reflections, wins, struggles..."
            defaultValue={log?.content ?? ""}
            rows={5}
          />
          <Textarea
            label="Goals for today / tomorrow"
            name="goals"
            placeholder="What do you want to focus on?"
            defaultValue={log?.goals ?? ""}
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
            Save personal log
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

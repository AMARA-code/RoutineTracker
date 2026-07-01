"use client";

import { useActionState, useState } from "react";
import { saveWorkSleep } from "@/app/(app)/routine/actions";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  TimePicker,
  Toggle,
} from "@/components/ui";
import { calcSleepHours, calcWorkHours, toTimeInput } from "@/lib/routine";
import type { DailyRoutine } from "@/types/routine";

export function WorkSleepSection({
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
        <CardTitle>Work & sleep</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="log_date" value={date} />
          <input type="hidden" name="worked" value={worked ? "true" : "false"} />

          <div className="grid gap-4 sm:grid-cols-2">
            <TimePicker
              label="Sleep time (bedtime)"
              name="sleep_time"
              value={sleep}
              onChange={(e) => setSleep(e.target.value)}
            />
            <TimePicker
              label="Wake time"
              name="wake_time"
              value={wake}
              onChange={(e) => setWake(e.target.value)}
            />
          </div>

          {sleepHours != null && (
            <p className="text-sm text-muted-foreground">
              Sleep duration: <strong>{sleepHours}h</strong>
              {sleepHours < 6 && (
                <span className="text-[#8b5a5a]"> — below 6h</span>
              )}
            </p>
          )}

          <div className="border-t border-border pt-4">
            <Toggle
              label="Worked today?"
              checked={worked}
              onChange={setWorked}
            />
          </div>

          {worked && (
            <div className="grid gap-4 sm:grid-cols-2">
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
            <p className="text-sm text-muted-foreground">
              Hours worked: <strong>{workHours}h</strong>
              {workHours < 9 && (
                <span className="text-[#8b5a5a]"> — below 9h target</span>
              )}
            </p>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" size="sm" loading={pending}>
              Save work & sleep
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

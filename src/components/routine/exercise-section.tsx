"use client";

import { useActionState, useState, useTransition } from "react";
import { Flame } from "lucide-react";
import { saveExercise } from "@/app/(app)/routine/actions";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Toggle,
} from "@/components/ui";

export function ExerciseSection({
  date,
  exercised,
  streak,
}: {
  date: string;
  exercised: boolean;
  streak: number;
}) {
  const [checked, setChecked] = useState(exercised);
  const [state, formAction, pending] = useActionState(saveExercise, null);
  const [, startTransition] = useTransition();

  const handleToggle = (value: boolean) => {
    setChecked(value);
    const fd = new FormData();
    fd.set("log_date", date);
    fd.set("exercised", value ? "true" : "false");
    startTransition(() => {
      void formAction(fd);
    });
  };

  return (
    <Card variant="routine">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Exercise</CardTitle>
          <Badge variant="mint" className="gap-1">
            <Flame className="h-3 w-3" />
            {streak} day streak
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Toggle
          label="Exercise done today?"
          checked={checked}
          onChange={handleToggle}
          disabled={pending}
        />
        {state?.error && (
          <p className="text-sm text-[#8b5a5a]">{state.error}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Streak counts consecutive days with exercise logged, ending on the
          selected date.
        </p>
      </CardContent>
    </Card>
  );
}

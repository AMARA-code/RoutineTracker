"use client";

import { useActionState } from "react";
import { saveNotes } from "@/app/(app)/routine/actions";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Textarea,
} from "@/components/ui";

export function RoutineNotesSection({
  date,
  notes,
}: {
  date: string;
  notes: string | null;
}) {
  const [state, formAction, pending] = useActionState(saveNotes, null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily notes</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-3">
          <input type="hidden" name="log_date" value={date} />
          <Textarea
            name="notes"
            placeholder="Anything else about your day..."
            defaultValue={notes ?? ""}
            rows={3}
          />
          <div className="flex items-center gap-3">
            <Button type="submit" size="sm" loading={pending}>
              Save notes
            </Button>
            {state?.success && (
              <span className="text-sm text-[#3d5a3e]">{state.success}</span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useActionState } from "react";
import { saveDailyAnalysis } from "@/app/(app)/journal/actions";
import { Button, Card, CardContent, CardHeader, CardTitle, Textarea } from "@/components/ui";

export function DailyAnalysisForm({
  date,
  initialAnalysis,
}: {
  date: string;
  initialAnalysis: string | null;
}) {
  const [state, formAction, pending] = useActionState(saveDailyAnalysis, null);

  return (
    <Card variant="journal">
      <CardHeader>
        <CardTitle>Daily analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-3">
          <input type="hidden" name="journal_date" value={date} />
          <Textarea
            name="daily_analysis"
            label="What analysis did you make today?"
            placeholder="Market context, key levels, mindset, lessons learned..."
            defaultValue={initialAnalysis ?? ""}
            rows={4}
          />
          <div className="flex items-center gap-3">
            <Button type="submit" size="sm" loading={pending}>
              Save analysis
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

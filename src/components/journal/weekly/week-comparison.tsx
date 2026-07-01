import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { formatDelta, formatWeekRange, type WeeklyComparison } from "@/lib/weekly-journal";

function DeltaRow({
  label,
  value,
  suffix = "",
  invert = false,
}: {
  label: string;
  value: number;
  suffix?: string;
  invert?: boolean;
}) {
  const isPositive = invert ? value < 0 : value > 0;
  const isNegative = invert ? value > 0 : value < 0;
  const isNeutral = value === 0;

  const Icon = isNeutral ? Minus : isPositive ? ArrowUpRight : ArrowDownRight;
  const color = isNeutral
    ? "text-muted-foreground"
    : isPositive
      ? "text-[#3d5a3e]"
      : "text-[#5a3a3a]";

  return (
    <div className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`flex items-center gap-1 text-sm font-semibold ${color}`}>
        <Icon className="h-4 w-4" />
        {formatDelta(value, suffix)}
      </span>
    </div>
  );
}

export function WeekComparison({ comparison }: { comparison: WeeklyComparison }) {
  return (
    <Card variant="journal">
      <CardHeader>
        <CardTitle>vs. previous week</CardTitle>
        <CardDescription>
          {comparison.hasPreviousData
            ? `Compared to ${formatWeekRange(comparison.previousWeekStart)}`
            : "No trades logged last week to compare"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {comparison.hasPreviousData ? (
          <>
            <DeltaRow label="Total R" value={comparison.totalRDelta} suffix="R" />
            <DeltaRow label="Win rate" value={comparison.winRateDelta} suffix="%" />
            <DeltaRow label="Avg R" value={comparison.avgRDelta} suffix="R" />
            <DeltaRow label="Trade count" value={comparison.tradeCountDelta} />
          </>
        ) : (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Log trades over multiple weeks to see trends here.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

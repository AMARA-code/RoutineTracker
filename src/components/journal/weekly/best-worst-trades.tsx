import Link from "next/link";
import { Trophy, TrendingDown } from "lucide-react";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { outcomeBadgeVariant, outcomeLabel } from "@/lib/journal";
import { formatR } from "@/lib/weekly-journal";
import type { Trade } from "@/types/journal";

function TradeHighlight({
  trade,
  variant,
}: {
  trade: Trade | null;
  variant: "best" | "worst";
}) {
  const isBest = variant === "best";
  const Icon = isBest ? Trophy : TrendingDown;
  const title = isBest ? "Best trade" : "Worst trade";
  const accent = isBest ? "bg-sage/40" : "bg-coral/40";

  if (!trade) {
    return (
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent}`}>
              <Icon className="h-4 w-4" />
            </span>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No R-multiple logged yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent}`}>
            <Icon className="h-4 w-4" />
          </span>
          {title}
        </CardTitle>
        <CardDescription>
          {trade.trade_date} · {trade.strategy || "No strategy"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">{trade.instrument}</p>
            <p className="text-sm text-muted-foreground capitalize">
              {trade.direction}
            </p>
          </div>
          <div className="text-right">
            <p
              className={`text-xl font-bold ${
                isBest ? "text-[#3d5a3e]" : "text-[#5a3a3a]"
              }`}
            >
              {formatR(trade.r_multiple ?? 0)}
            </p>
            <Badge variant={outcomeBadgeVariant(trade.outcome)}>
              {outcomeLabel(trade.outcome)}
            </Badge>
          </div>
        </div>
        {trade.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2">{trade.notes}</p>
        )}
        <Link
          href={`/journal?date=${trade.trade_date}`}
          className="text-sm font-medium text-primary-foreground hover:underline"
        >
          View on journal →
        </Link>
      </CardContent>
    </Card>
  );
}

export function BestWorstTrades({
  best,
  worst,
}: {
  best: Trade | null;
  worst: Trade | null;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <TradeHighlight trade={best} variant="best" />
      <TradeHighlight trade={worst} variant="worst" />
    </div>
  );
}

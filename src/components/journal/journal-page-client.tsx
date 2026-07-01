"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { DateSelector } from "./date-selector";
import { DailyAnalysisForm } from "./daily-analysis-form";
import { TradeForm } from "./trade-form";
import { TradeCard } from "./trade-card";
import { TradeHistory } from "./trade-history";
import { PageHeader } from "@/components/layout/page-header";
import { Button, Card, CardContent } from "@/components/ui";
import type { Trade } from "@/types/journal";

type JournalPageClientProps = {
  date: string;
  trades: Trade[];
  dailyAnalysis: string | null;
  allTrades: Trade[];
  strategies: string[];
};

export function JournalPageClient({
  date,
  trades,
  dailyAnalysis,
  allTrades,
  strategies,
}: JournalPageClientProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <PageHeader
        title="Daily Journal"
        description="Log trades, chart screenshots, and daily market analysis."
      >
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          Log trade
        </Button>
      </PageHeader>

      <div className="mb-6">
        <DateSelector date={date} />
      </div>

      <div className="mb-8 space-y-6">
        <DailyAnalysisForm
          key={date}
          date={date}
          initialAnalysis={dailyAnalysis}
        />

        <div>
          <h2 className="mb-3 text-lg font-semibold">
            Today&apos;s trades ({trades.length})
          </h2>
          {trades.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">
                  No trades logged for this day yet.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setShowForm(true)}
                >
                  <Plus className="h-4 w-4" />
                  Log your first trade
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {trades.map((trade) => (
                <TradeCard key={trade.id} trade={trade} date={date} />
              ))}
            </div>
          )}
        </div>
      </div>

      <TradeHistory
        trades={allTrades}
        strategies={strategies}
        selectedDate={date}
      />

      <TradeForm
        open={showForm}
        onClose={() => setShowForm(false)}
        date={date}
      />
    </div>
  );
}

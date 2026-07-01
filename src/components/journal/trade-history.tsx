"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { TradeCard } from "./trade-card";
import { Card, CardContent, CardHeader, CardTitle, Input, Select } from "@/components/ui";
import type { Trade, TradeOutcome } from "@/types/journal";

type TradeHistoryProps = {
  trades: Trade[];
  strategies: string[];
  selectedDate: string;
};

export function TradeHistory({
  trades,
  strategies,
  selectedDate,
}: TradeHistoryProps) {
  const [outcome, setOutcome] = useState<TradeOutcome | "all">("all");
  const [strategy, setStrategy] = useState("all");
  const [instrument, setInstrument] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(() => {
    return trades.filter((trade) => {
      if (outcome !== "all" && trade.outcome !== outcome) return false;
      if (strategy !== "all" && trade.strategy !== strategy) return false;
      if (
        instrument &&
        !trade.instrument.toLowerCase().includes(instrument.toLowerCase())
      )
        return false;
      if (dateFrom && trade.trade_date < dateFrom) return false;
      if (dateTo && trade.trade_date > dateTo) return false;
      return true;
    });
  }, [trades, outcome, strategy, instrument, dateFrom, dateTo]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade history</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Select
            label="Outcome"
            value={outcome}
            onChange={(e) => setOutcome(e.target.value as TradeOutcome | "all")}
            options={[
              { value: "all", label: "All outcomes" },
              { value: "win", label: "Win" },
              { value: "loss", label: "Loss" },
              { value: "be", label: "Break-even" },
            ]}
          />
          <Select
            label="Strategy"
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            options={[
              { value: "all", label: "All strategies" },
              ...strategies.map((s) => ({ value: s, label: s })),
            ]}
          />
          <Input
            label="Instrument"
            placeholder="Filter by pair..."
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
          />
          <Input
            label="From"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <Input
            label="To"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} of {trades.length} entries
        </p>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
            <Search className="mb-2 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              No trades match your filters.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((trade) => (
              <TradeCard
                key={trade.id}
                trade={trade}
                date={trade.trade_date || selectedDate}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

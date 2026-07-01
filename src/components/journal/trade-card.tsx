"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
} from "lucide-react";
import { deleteScreenshot, deleteTrade } from "@/app/(app)/journal/actions";
import { TradeForm } from "./trade-form";
import { Badge, Button, Card, CardContent } from "@/components/ui";
import { outcomeBadgeVariant, outcomeLabel } from "@/lib/journal";
import type { Trade } from "@/types/journal";

export function TradeCard({ trade, date }: { trade: Trade; date: string }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Delete this trade entry?")) return;
    startTransition(async () => {
      await deleteTrade(trade.id);
    });
  };

  const handleDeleteScreenshot = (screenshotId: string) => {
    if (!confirm("Remove this screenshot?")) return;
    startTransition(async () => {
      await deleteScreenshot(screenshotId);
    });
  };

  return (
    <>
      <Card variant="journal" padding="none" className="overflow-hidden">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-muted/30"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold uppercase ${
                trade.direction === "long"
                  ? "bg-sage/60 text-[#3d5a3e]"
                  : "bg-coral/50 text-[#5a3a3a]"
              }`}
            >
              {trade.direction === "long" ? "L" : "S"}
            </div>
            <div className="min-w-0">
              <p className="font-semibold truncate">{trade.instrument}</p>
              <p className="text-sm text-muted-foreground truncate">
                {trade.strategy || "No strategy"} ·{" "}
                {trade.r_multiple != null ? `${trade.r_multiple}R` : "— R"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant={outcomeBadgeVariant(trade.outcome)}>
              {outcomeLabel(trade.outcome)}
            </Badge>
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </button>

        {expanded && (
          <CardContent className="border-t border-border p-4 space-y-4">
            <div className="grid gap-3 text-sm sm:grid-cols-3">
              <Detail label="Entry" value={trade.entry_price} />
              <Detail label="SL" value={trade.sl_price} />
              <Detail label="TP" value={trade.tp_price} />
              <Detail label="Lot size" value={trade.lot_size} />
              <Detail label="R multiple" value={trade.r_multiple} />
              <Detail label="Strategy" value={trade.strategy} text />
            </div>

            {trade.emotion_note && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Emotion / mindset
                </p>
                <p className="text-sm">{trade.emotion_note}</p>
              </div>
            )}

            {trade.notes && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Notes
                </p>
                <p className="text-sm whitespace-pre-wrap">{trade.notes}</p>
              </div>
            )}

            {trade.trade_screenshots && trade.trade_screenshots.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Screenshots
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {trade.trade_screenshots.map((shot) => (
                    <div
                      key={shot.id}
                      className="relative rounded-xl border border-border overflow-hidden"
                    >
                      <Badge
                        variant="ice"
                        className="absolute left-2 top-2 z-10 capitalize"
                      >
                        {shot.screenshot_type}
                      </Badge>
                      {shot.signed_url ? (
                        <div className="relative h-40 w-full">
                          <Image
                            src={shot.signed_url}
                            alt={shot.screenshot_type}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="flex h-40 items-center justify-center bg-muted text-sm text-muted-foreground">
                          Image unavailable
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-2 bg-card/80"
                        onClick={() => handleDeleteScreenshot(shot.id)}
                        disabled={pending}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                loading={pending}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      <TradeForm
        open={editing}
        onClose={() => setEditing(false)}
        date={date}
        trade={trade}
      />
    </>
  );
}

function Detail({
  label,
  value,
  text,
}: {
  label: string;
  value: string | number | null;
  text?: boolean;
}) {
  const display =
    value == null || value === ""
      ? "—"
      : text
        ? String(value)
        : String(value);

  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{display}</p>
    </div>
  );
}

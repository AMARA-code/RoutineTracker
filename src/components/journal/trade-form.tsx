"use client";

import { useActionState, useEffect } from "react";
import { createTrade, updateTrade } from "@/app/(app)/journal/actions";
import { ScreenshotUpload } from "./screenshot-upload";
import {
  Button,
  Input,
  Modal,
  Select,
  Textarea,
} from "@/components/ui";
import type { Trade } from "@/types/journal";

type TradeFormProps = {
  open: boolean;
  onClose: () => void;
  date: string;
  trade?: Trade | null;
};

const directionOptions = [
  { value: "long", label: "Long" },
  { value: "short", label: "Short" },
];

const outcomeOptions = [
  { value: "", label: "Not set" },
  { value: "win", label: "Win" },
  { value: "loss", label: "Loss" },
  { value: "be", label: "Break-even" },
];

export function TradeForm({ open, onClose, date, trade }: TradeFormProps) {
  const isEdit = !!trade;
  const action = isEdit ? updateTrade : createTrade;
  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    if (state?.success) onClose();
  }, [state?.success, onClose]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit trade" : "Log trade"}
      description={
        isEdit
          ? "Update trade details or add more screenshots."
          : "Record instrument, levels, outcome, and chart screenshots."
      }
      className="max-w-2xl max-h-[90vh] overflow-y-auto"
    >
      <form action={formAction} className="space-y-4">
        {isEdit && <input type="hidden" name="trade_id" value={trade.id} />}
        <input type="hidden" name="trade_date" value={date} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Instrument / Pair"
            name="instrument"
            placeholder="e.g. EURUSD, XAUUSD"
            defaultValue={trade?.instrument ?? ""}
            required
          />
          <Select
            label="Direction"
            name="direction"
            defaultValue={trade?.direction ?? "long"}
            options={directionOptions}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Entry"
            name="entry_price"
            type="number"
            step="any"
            placeholder="0.00"
            defaultValue={trade?.entry_price ?? ""}
          />
          <Input
            label="Stop loss"
            name="sl_price"
            type="number"
            step="any"
            placeholder="0.00"
            defaultValue={trade?.sl_price ?? ""}
          />
          <Input
            label="Take profit"
            name="tp_price"
            type="number"
            step="any"
            placeholder="0.00"
            defaultValue={trade?.tp_price ?? ""}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Lot size"
            name="lot_size"
            type="number"
            step="any"
            placeholder="0.01"
            defaultValue={trade?.lot_size ?? ""}
          />
          <Select
            label="Outcome"
            name="outcome"
            defaultValue={trade?.outcome ?? ""}
            options={outcomeOptions}
          />
          <Input
            label="R multiple"
            name="r_multiple"
            type="number"
            step="any"
            placeholder="e.g. 2.5 or -1"
            defaultValue={trade?.r_multiple ?? ""}
          />
        </div>

        <Input
          label="Strategy"
          name="strategy"
          placeholder="e.g. Breakout, SMC, Trend follow"
          defaultValue={trade?.strategy ?? ""}
        />

        <Textarea
          label="Emotion / mindset"
          name="emotion_note"
          placeholder="How did you feel before, during, and after?"
          defaultValue={trade?.emotion_note ?? ""}
          rows={2}
        />

        <Textarea
          label="Trade notes"
          name="notes"
          placeholder="Setup rationale, what went well, what to improve..."
          defaultValue={trade?.notes ?? ""}
          rows={3}
        />

        <ScreenshotUpload />

        {state?.error && (
          <p className="rounded-xl bg-coral/40 px-3 py-2 text-sm text-[#5a3a3a]">
            {state.error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={pending}>
            {isEdit ? "Save changes" : "Log trade"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

import type { TradeOutcome } from "@/types/journal";

export function formatDateISO(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function parseDateISO(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatDisplayDate(value: string): string {
  return parseDateISO(value).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function shiftDate(value: string, days: number): string {
  const date = parseDateISO(value);
  date.setDate(date.getDate() + days);
  return formatDateISO(date);
}

export function outcomeLabel(outcome: TradeOutcome | null): string {
  if (!outcome) return "Open";
  return outcome === "be" ? "Break-even" : outcome.charAt(0).toUpperCase() + outcome.slice(1);
}

export function outcomeBadgeVariant(
  outcome: TradeOutcome | null,
): "success" | "warning" | "default" {
  if (outcome === "win") return "success";
  if (outcome === "loss") return "warning";
  return "default";
}

export function parseNumber(value: FormDataEntryValue | null): number | null {
  if (!value || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

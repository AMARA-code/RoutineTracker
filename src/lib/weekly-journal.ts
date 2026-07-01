import type { Trade } from "@/types/journal";
import { formatDateISO, parseDateISO, shiftDate } from "./journal";

export type EquityPoint = {
  date: string;
  label: string;
  dailyR: number;
  cumulativeR: number;
  tradeCount: number;
};

export type WeeklyStats = {
  weekStart: string;
  weekEnd: string;
  tradeCount: number;
  closedCount: number;
  winCount: number;
  lossCount: number;
  beCount: number;
  winRate: number;
  totalR: number;
  avgR: number;
  bestTrade: Trade | null;
  worstTrade: Trade | null;
  topStrategy: { name: string; count: number } | null;
  equityCurve: EquityPoint[];
};

export type WeeklyComparison = {
  previousWeekStart: string;
  previousWeekEnd: string;
  tradeCountDelta: number;
  winRateDelta: number;
  totalRDelta: number;
  avgRDelta: number;
  hasPreviousData: boolean;
};

/** Monday-start week containing `date` (ISO yyyy-mm-dd). */
export function getWeekStart(date: string): string {
  const d = parseDateISO(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return formatDateISO(d);
}

export function getWeekEnd(weekStart: string): string {
  return shiftDate(weekStart, 6);
}

export function shiftWeek(weekStart: string, weeks: number): string {
  return shiftDate(weekStart, weeks * 7);
}

export function formatWeekRange(weekStart: string): string {
  const start = parseDateISO(weekStart);
  const end = parseDateISO(getWeekEnd(weekStart));
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const yearOpts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const sameYear = start.getFullYear() === end.getFullYear();
  return `${start.toLocaleDateString("en-US", sameYear ? opts : yearOpts)} – ${end.toLocaleDateString("en-US", yearOpts)}`;
}

function rValue(trade: Trade): number {
  return trade.r_multiple ?? 0;
}

function tradesWithR(trades: Trade[]): Trade[] {
  return trades.filter((t) => t.r_multiple != null);
}

export function computeWeeklyStats(
  trades: Trade[],
  weekStart: string,
): WeeklyStats {
  const weekEnd = getWeekEnd(weekStart);
  const closed = trades.filter((t) => t.outcome != null);
  const wins = trades.filter((t) => t.outcome === "win");
  const losses = trades.filter((t) => t.outcome === "loss");
  const bes = trades.filter((t) => t.outcome === "be");

  const withR = tradesWithR(trades);
  const totalR = withR.reduce((sum, t) => sum + rValue(t), 0);
  const avgR = withR.length ? totalR / withR.length : 0;
  const winRate =
    closed.length > 0 ? Math.round((wins.length / closed.length) * 100) : 0;

  let bestTrade: Trade | null = null;
  let worstTrade: Trade | null = null;
  for (const t of withR) {
    if (!bestTrade || rValue(t) > rValue(bestTrade)) bestTrade = t;
    if (!worstTrade || rValue(t) < rValue(worstTrade)) worstTrade = t;
  }

  const strategyCounts = new Map<string, number>();
  for (const t of trades) {
    const s = t.strategy?.trim();
    if (!s) continue;
    strategyCounts.set(s, (strategyCounts.get(s) ?? 0) + 1);
  }
  let topStrategy: { name: string; count: number } | null = null;
  for (const [name, count] of strategyCounts) {
    if (!topStrategy || count > topStrategy.count) topStrategy = { name, count };
  }

  const equityCurve = buildEquityCurve(trades, weekStart, weekEnd);

  return {
    weekStart,
    weekEnd,
    tradeCount: trades.length,
    closedCount: closed.length,
    winCount: wins.length,
    lossCount: losses.length,
    beCount: bes.length,
    winRate,
    totalR: round2(totalR),
    avgR: round2(avgR),
    bestTrade,
    worstTrade,
    topStrategy,
    equityCurve,
  };
}

function buildEquityCurve(
  trades: Trade[],
  weekStart: string,
  weekEnd: string,
): EquityPoint[] {
  const dailyMap = new Map<string, { r: number; count: number }>();

  for (const t of trades) {
    const existing = dailyMap.get(t.trade_date) ?? { r: 0, count: 0 };
    dailyMap.set(t.trade_date, {
      r: existing.r + rValue(t),
      count: existing.count + 1,
    });
  }

  const points: EquityPoint[] = [];
  let cumulative = 0;
  let cursor = weekStart;

  while (cursor <= weekEnd) {
    const day = dailyMap.get(cursor);
    const dailyR = day?.r ?? 0;
    cumulative += dailyR;
    const d = parseDateISO(cursor);
    points.push({
      date: cursor,
      label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      dailyR: round2(dailyR),
      cumulativeR: round2(cumulative),
      tradeCount: day?.count ?? 0,
    });
    cursor = shiftDate(cursor, 1);
  }

  return points;
}

export function compareWeeks(
  current: WeeklyStats,
  previous: WeeklyStats,
  previousWeekStart: string,
): WeeklyComparison {
  return {
    previousWeekStart,
    previousWeekEnd: getWeekEnd(previousWeekStart),
    tradeCountDelta: current.tradeCount - previous.tradeCount,
    winRateDelta: current.winRate - previous.winRate,
    totalRDelta: round2(current.totalR - previous.totalR),
    avgRDelta: round2(current.avgR - previous.avgR),
    hasPreviousData: previous.tradeCount > 0,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function formatR(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value}R`;
}

export function formatDelta(value: number, suffix = ""): string {
  if (value === 0) return `0${suffix}`;
  const sign = value > 0 ? "+" : "";
  return `${sign}${value}${suffix}`;
}

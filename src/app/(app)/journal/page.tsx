import { JournalPageClient } from "@/components/journal/journal-page-client";
import { formatDateISO } from "@/lib/journal";
import {
  getAllTrades,
  getDailyAnalysis,
  getDistinctStrategies,
  getTradesForDate,
} from "./actions";

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: paramDate } = await searchParams;
  const date = paramDate || formatDateISO(new Date());

  const [trades, dailyAnalysis, allTrades, strategies] = await Promise.all([
    getTradesForDate(date),
    getDailyAnalysis(date),
    getAllTrades(),
    getDistinctStrategies(),
  ]);

  return (
    <JournalPageClient
      date={date}
      trades={trades}
      dailyAnalysis={dailyAnalysis}
      allTrades={allTrades}
      strategies={strategies}
    />
  );
}

import { WeeklyPageClient } from "@/components/journal/weekly/weekly-page-client";
import { getWeekStart } from "@/lib/weekly-journal";
import { formatDateISO } from "@/lib/journal";
import { getWeeklyAnalysis } from "./actions";

export default async function WeeklyJournalPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const { week } = await searchParams;
  const anchorDate = week
    ? getWeekStart(week)
    : formatDateISO(new Date());

  const data = await getWeeklyAnalysis(anchorDate);

  return <WeeklyPageClient data={data} />;
}

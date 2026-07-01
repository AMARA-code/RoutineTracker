import { WeeklyRoutinePageClient } from "@/components/routine/weekly/weekly-routine-page-client";
import { formatDateISO } from "@/lib/journal";
import { getWeekStart } from "@/lib/weekly-routine";
import { getWeeklyRoutineAnalysis } from "./actions";

export default async function WeeklyRoutinePage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const { week } = await searchParams;
  const anchorDate = week
    ? getWeekStart(week)
    : formatDateISO(new Date());

  const stats = await getWeeklyRoutineAnalysis(anchorDate);

  return <WeeklyRoutinePageClient stats={stats} />;
}

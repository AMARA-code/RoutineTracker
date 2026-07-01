import { RoutinePageClient } from "@/components/routine/routine-page-client";
import { formatDateISO } from "@/lib/journal";
import { getDayRoutine, getRoutineHistory } from "./actions";

export default async function RoutinePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: paramDate } = await searchParams;
  const date = paramDate || formatDateISO(new Date());

  const [day, history] = await Promise.all([
    getDayRoutine(date),
    getRoutineHistory(90),
  ]);

  return <RoutinePageClient date={date} day={day} history={history} />;
}

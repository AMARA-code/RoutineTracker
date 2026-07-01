import { QuranPageClient } from "@/components/quran/quran-page-client";
import { formatDateISO } from "@/lib/journal";
import { getQuranDay, getQuranHistory } from "./actions";

export default async function QuranPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: paramDate } = await searchParams;
  const date = paramDate || formatDateISO(new Date());

  const [{ log, streak }, history] = await Promise.all([
    getQuranDay(date),
    getQuranHistory(90),
  ]);

  return (
    <QuranPageClient date={date} log={log} streak={streak} history={history} />
  );
}

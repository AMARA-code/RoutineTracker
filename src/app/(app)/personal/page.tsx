import { PersonalPageClient } from "@/components/personal/personal-page-client";
import { formatDateISO } from "@/lib/journal";
import { getPersonalDay, getPersonalHistory } from "./actions";

export default async function PersonalPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: paramDate } = await searchParams;
  const date = paramDate || formatDateISO(new Date());

  const [day, history] = await Promise.all([
    getPersonalDay(date),
    getPersonalHistory(90),
  ]);

  return (
    <PersonalPageClient
      date={date}
      log={day.log}
      streak={day.streak}
      weekLogged={day.weekLogged}
      loggedToday={day.loggedToday}
      history={history}
    />
  );
}

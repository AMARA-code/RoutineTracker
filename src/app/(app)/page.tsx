import { DashboardPageClient } from "@/components/dashboard/dashboard-page-client";
import { getDashboardData } from "@/app/(app)/dashboard/actions";

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <DashboardPageClient data={data} />;
}

import { HomePageClient } from "@/components/home/home-page-client";
import { getHomeData } from "./actions";

export default async function HomePage() {
  const data = await getHomeData();
  return <HomePageClient data={data} />;
}

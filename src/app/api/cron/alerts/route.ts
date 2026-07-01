import { NextResponse } from "next/server";
import { runDailyAlertCron } from "@/lib/alerts/run-cron";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runDailyAlertCron();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[cron/alerts]", err);
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}

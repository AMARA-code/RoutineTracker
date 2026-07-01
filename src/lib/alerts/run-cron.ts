import { evaluateRules } from "@/lib/alerts/engine";
import { sendAlertEmail } from "@/lib/alerts/email";
import { createAdminClient } from "@/lib/supabase/admin";
import { shiftDate, formatDateISO } from "@/lib/journal";
import type { AlertRule } from "@/types/alerts";

export async function runDailyAlertCron(): Promise<{
  processed: number;
  triggered: number;
}> {
  const admin = createAdminClient();
  if (!admin) {
    console.warn("[cron] Missing SUPABASE_SERVICE_ROLE_KEY");
    return { processed: 0, triggered: 0 };
  }

  const yesterday = shiftDate(formatDateISO(new Date()), -1);
  let processed = 0;
  let triggered = 0;

  const { data: users } = await admin.from("alert_rules").select("user_id");
  const userIds = [...new Set(users?.map((u) => u.user_id) ?? [])];

  for (const userId of userIds) {
    processed++;

    const [rulesRes, routineRes, tradesRes, journalRes, settingsRes, authUser] =
      await Promise.all([
        admin.from("alert_rules").select("*").eq("user_id", userId),
        admin
          .from("daily_routine")
          .select("*")
          .eq("user_id", userId)
          .gte("log_date", shiftDate(yesterday, -7))
          .lte("log_date", yesterday),
        admin
          .from("trades")
          .select("id")
          .eq("user_id", userId)
          .eq("trade_date", yesterday),
        admin
          .from("journal_daily")
          .select("daily_analysis")
          .eq("user_id", userId)
          .eq("journal_date", yesterday)
          .maybeSingle(),
        admin
          .from("user_settings")
          .select("alert_email")
          .eq("user_id", userId)
          .maybeSingle(),
        admin.auth.admin.getUserById(userId),
      ]);

    const rules = (rulesRes.data ?? []) as AlertRule[];
    const results = evaluateRules(rules, {
      yesterday,
      routines: routineRes.data ?? [],
      tradeCount: tradesRes.data?.length ?? 0,
      hasJournalNote: !!journalRes.data?.daily_analysis?.trim(),
    });

    const email =
      settingsRes.data?.alert_email ?? authUser.data.user?.email ?? null;

    for (const result of results) {
      if (!result.triggered || !result.message) continue;

      const { data: recent } = await admin
        .from("alert_log")
        .select("id")
        .eq("user_id", userId)
        .eq("rule_type", result.rule_type)
        .gte("triggered_at", `${yesterday}T00:00:00`)
        .limit(1);

      if (recent?.length) continue;

      const emailSent = email
        ? await sendAlertEmail(email, `⚠️ ${result.message}`)
        : false;

      await admin.from("alert_log").insert({
        user_id: userId,
        rule_type: result.rule_type,
        message: result.message,
        email_sent: emailSent,
      });

      triggered++;
    }
  }

  return { processed, triggered };
}

import { evaluateRules } from "@/lib/alerts/engine";
import { sendAlertEmail } from "@/lib/alerts/email";
import { provisionUserAlerts } from "@/lib/alerts/provision-user";
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

  const { data: authData, error: listError } =
    await admin.auth.admin.listUsers({ perPage: 1000 });

  if (listError || !authData?.users?.length) {
    console.warn("[cron] No users found:", listError?.message);
    return { processed: 0, triggered: 0 };
  }

  for (const user of authData.users) {
    if (!user.email) continue;
    processed++;

    await provisionUserAlerts(admin, user.id, user.email);

    const [rulesRes, routineRes, tradesRes, journalRes, settingsRes] =
      await Promise.all([
        admin.from("alert_rules").select("*").eq("user_id", user.id),
        admin
          .from("daily_routine")
          .select("*")
          .eq("user_id", user.id)
          .gte("log_date", shiftDate(yesterday, -7))
          .lte("log_date", yesterday),
        admin
          .from("trades")
          .select("id")
          .eq("user_id", user.id)
          .eq("trade_date", yesterday),
        admin
          .from("journal_daily")
          .select("daily_analysis")
          .eq("user_id", user.id)
          .eq("journal_date", yesterday)
          .maybeSingle(),
        admin
          .from("user_settings")
          .select("alert_email")
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);

    const rules = (rulesRes.data ?? []) as AlertRule[];
    const results = evaluateRules(rules, {
      yesterday,
      routines: routineRes.data ?? [],
      tradeCount: tradesRes.data?.length ?? 0,
      hasJournalNote: !!journalRes.data?.daily_analysis?.trim(),
    });

    const email =
      settingsRes.data?.alert_email?.trim() || user.email || null;

    for (const result of results) {
      if (!result.triggered || !result.message) continue;

      const { data: recent } = await admin
        .from("alert_log")
        .select("id")
        .eq("user_id", user.id)
        .eq("rule_type", result.rule_type)
        .gte("triggered_at", `${yesterday}T00:00:00`)
        .limit(1);

      if (recent?.length) continue;

      const emailSent = email
        ? await sendAlertEmail(email, `⚠️ ${result.message}`)
        : false;

      await admin.from("alert_log").insert({
        user_id: user.id,
        rule_type: result.rule_type,
        message: result.message,
        email_sent: emailSent,
      });

      triggered++;
    }
  }

  return { processed, triggered };
}

import type { SupabaseClient } from "@supabase/supabase-js";
import { RULE_DEFINITIONS, type RuleType } from "@/types/alerts";

/**
 * Ensures every user has default alert rules and an alert email (their account email).
 * Safe to call on signup, login, email confirm, and daily cron.
 */
export async function provisionUserAlerts(
  db: SupabaseClient,
  userId: string,
  email?: string | null,
): Promise<void> {
  const types = Object.keys(RULE_DEFINITIONS) as RuleType[];

  for (const rule_type of types) {
    const { data: existing } = await db
      .from("alert_rules")
      .select("id")
      .eq("user_id", userId)
      .eq("rule_type", rule_type)
      .maybeSingle();

    if (!existing) {
      const def = RULE_DEFINITIONS[rule_type];
      await db.from("alert_rules").insert({
        user_id: userId,
        rule_type,
        threshold: def.defaultThreshold,
        enabled: true,
      });
    }
  }

  if (!email?.trim()) return;

  const { data: settings } = await db
    .from("user_settings")
    .select("alert_email")
    .eq("user_id", userId)
    .maybeSingle();

  if (!settings?.alert_email?.trim()) {
    await db.from("user_settings").upsert(
      {
        user_id: userId,
        alert_email: email.trim(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
  }
}

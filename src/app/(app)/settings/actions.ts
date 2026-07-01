"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { provisionUserAlerts } from "@/lib/alerts/provision-user";
import type { AlertLogEntry, AlertRule, UserSettings } from "@/types/alerts";

type ActionResult = { error?: string; success?: string };

async function getUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/** @deprecated Use provisionUserAlerts — kept as alias for existing imports */
export async function ensureDefaultRules(userId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  await provisionUserAlerts(supabase, userId, user?.email);
}

export async function getSettingsData(): Promise<{
  settings: UserSettings | null;
  rules: AlertRule[];
  alertHistory: AlertLogEntry[];
  userEmail: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { settings: null, rules: [], alertHistory: [], userEmail: null };
  }

  await ensureDefaultRules(user.id);

  const [settingsRes, rulesRes, historyRes] = await Promise.all([
    supabase.from("user_settings").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("alert_rules").select("*").eq("user_id", user.id),
    supabase
      .from("alert_log")
      .select("*")
      .eq("user_id", user.id)
      .order("triggered_at", { ascending: false })
      .limit(50),
  ]);

  return {
    settings: settingsRes.data as UserSettings | null,
    rules: (rulesRes.data ?? []) as AlertRule[],
    alertHistory: (historyRes.data ?? []) as AlertLogEntry[],
    userEmail: user.email ?? null,
  };
}

export async function saveAlertEmail(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated." };

  const alert_email = (formData.get("alert_email") as string)?.trim() || null;
  const supabase = await createClient();

  const { error } = await supabase.from("user_settings").upsert(
    { user_id: userId, alert_email, updated_at: new Date().toISOString() },
    { onConflict: "user_id" },
  );

  if (error) return { error: error.message };
  revalidatePath("/settings");
  return { success: "Alert email saved." };
}

export async function updateAlertRule(
  ruleId: string,
  enabled: boolean,
  threshold: number,
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("alert_rules")
    .update({ enabled, threshold })
    .eq("id", ruleId)
    .eq("user_id", userId);

  if (error) return { error: error.message };
  revalidatePath("/settings");
  return { success: "Rule updated." };
}

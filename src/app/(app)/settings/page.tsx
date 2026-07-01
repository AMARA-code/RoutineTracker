import { SettingsPageClient } from "@/components/settings/settings-page-client";
import { getSettingsData } from "./actions";

export default async function SettingsPage() {
  const { settings, rules, alertHistory, userEmail } = await getSettingsData();
  return (
    <SettingsPageClient
      settings={settings}
      rules={rules}
      alertHistory={alertHistory}
      userEmail={userEmail}
    />
  );
}

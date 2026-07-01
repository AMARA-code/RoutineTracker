"use client";

import { useTransition } from "react";
import { useActionState } from "react";
import { saveAlertEmail, updateAlertRule } from "@/app/(app)/settings/actions";
import { MotionSection } from "@/components/ui/motion-section";
import { PageHeader } from "@/components/layout/page-header";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Toggle,
} from "@/components/ui";
import { RULE_DEFINITIONS, type AlertLogEntry, type AlertRule, type UserSettings } from "@/types/alerts";

function RuleRow({ rule }: { rule: AlertRule }) {
  const [pending, startTransition] = useTransition();
  const def = RULE_DEFINITIONS[rule.rule_type];

  const handleToggle = (enabled: boolean) => {
    startTransition(() => {
      void updateAlertRule(rule.id, enabled, rule.threshold ?? def.defaultThreshold);
    });
  };

  const handleThreshold = (value: number) => {
    startTransition(() => {
      void updateAlertRule(rule.id, rule.enabled, value);
    });
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium">{def.label}</p>
        <p className="text-sm text-muted-foreground">{def.description}</p>
      </div>
      <div className="flex items-center gap-4">
        {def.unit && (
          <Input
            type="number"
            step="any"
            className="w-20"
            defaultValue={rule.threshold ?? def.defaultThreshold}
            onBlur={(e) => handleThreshold(Number(e.target.value))}
            disabled={pending}
          />
        )}
        {def.unit && (
          <span className="text-sm text-muted-foreground">{def.unit}</span>
        )}
        <Toggle
          checked={rule.enabled}
          onChange={handleToggle}
          disabled={pending}
        />
      </div>
    </div>
  );
}

export function SettingsPageClient({
  settings,
  rules,
  alertHistory,
  userEmail,
}: {
  settings: UserSettings | null;
  rules: AlertRule[];
  alertHistory: AlertLogEntry[];
  userEmail: string | null;
}) {
  const [emailState, emailAction, emailPending] = useActionState(
    saveAlertEmail,
    null,
  );

  return (
    <div>
      <PageHeader
        title="Alerts & Settings"
        description="Configure accountability rules and email notifications."
      />

      <MotionSection className="mb-8">
        <Card variant="alerts">
          <CardHeader>
            <CardTitle>Alert email</CardTitle>
            <CardDescription>
              Notifications are sent to this address when rules are broken.
              {userEmail && !settings?.alert_email && (
                <span> Default: your account email ({userEmail})</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={emailAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <Input
                label="Email address"
                name="alert_email"
                type="email"
                placeholder={userEmail ?? "you@example.com"}
                defaultValue={settings?.alert_email ?? ""}
                className="flex-1"
              />
              <Button type="submit" loading={emailPending}>
                Save email
              </Button>
            </form>
            {emailState?.success && (
              <p className="mt-2 text-sm text-[#3d5a3e]">{emailState.success}</p>
            )}
            {emailState?.error && (
              <p className="mt-2 text-sm text-[#8b5a5a]">{emailState.error}</p>
            )}
          </CardContent>
        </Card>
      </MotionSection>

      <MotionSection delay={0.1} className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Alert rules</CardTitle>
            <CardDescription>
              Evaluated daily via cron. Toggle rules on or off individually.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {rules.map((rule) => (
              <RuleRow key={rule.id} rule={rule} />
            ))}
          </CardContent>
        </Card>
      </MotionSection>

      <MotionSection delay={0.15}>
        <Card>
          <CardHeader>
            <CardTitle>Alert history</CardTitle>
            <CardDescription>Recent triggered alerts</CardDescription>
          </CardHeader>
          <CardContent>
            {alertHistory.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No alerts triggered yet.
              </p>
            ) : (
              <div className="space-y-2">
                {alertHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex flex-col gap-1 rounded-xl border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">{entry.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.triggered_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="lavender">
                        {RULE_DEFINITIONS[entry.rule_type as keyof typeof RULE_DEFINITIONS]?.label ?? entry.rule_type}
                      </Badge>
                      <Badge variant={entry.email_sent ? "success" : "default"}>
                        {entry.email_sent ? "Emailed" : "In-app only"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </MotionSection>
    </div>
  );
}

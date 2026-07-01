export type RuleType =
  | "exercise_gap_days"
  | "work_hours_min"
  | "sleep_hours_min"
  | "journal_missing";

export type AlertRule = {
  id: string;
  user_id: string;
  rule_type: RuleType;
  threshold: number | null;
  enabled: boolean;
};

export type AlertLogEntry = {
  id: string;
  rule_type: RuleType;
  message: string;
  email_sent: boolean;
  triggered_at: string;
};

export type UserSettings = {
  user_id: string;
  alert_email: string | null;
};

export const RULE_DEFINITIONS: Record<
  RuleType,
  { label: string; description: string; defaultThreshold: number; unit?: string }
> = {
  exercise_gap_days: {
    label: "Exercise gap",
    description: "Alert when no exercise logged for consecutive days",
    defaultThreshold: 2,
    unit: "days",
  },
  work_hours_min: {
    label: "Work hours target",
    description: "Alert when yesterday's work hours are below target",
    defaultThreshold: 9,
    unit: "hours",
  },
  sleep_hours_min: {
    label: "Sleep minimum",
    description: "Alert when yesterday's sleep was below minimum",
    defaultThreshold: 6,
    unit: "hours",
  },
  journal_missing: {
    label: "Journal reminder",
    description: "Alert when no journal entry was logged yesterday",
    defaultThreshold: 0,
  },
};

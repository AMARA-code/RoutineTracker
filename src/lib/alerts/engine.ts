import { shiftDate } from "@/lib/journal";
import { calcSleepHours, calcWorkHours } from "@/lib/routine";
import type { RuleType } from "@/types/alerts";
import { RULE_DEFINITIONS } from "@/types/alerts";

export type RuleCheckResult = {
  rule_type: RuleType;
  triggered: boolean;
  message: string;
};

type RoutineRow = {
  log_date: string;
  worked: boolean;
  work_start: string | null;
  work_end: string | null;
  sleep_time: string | null;
  wake_time: string | null;
  exercised: boolean;
};

export function evaluateRules(
  rules: { rule_type: RuleType; threshold: number | null; enabled: boolean }[],
  data: {
    yesterday: string;
    routines: RoutineRow[];
    tradeCount: number;
    hasJournalNote: boolean;
  },
): RuleCheckResult[] {
  const results: RuleCheckResult[] = [];

  for (const rule of rules) {
    if (!rule.enabled) continue;

    const threshold =
      rule.threshold ?? RULE_DEFINITIONS[rule.rule_type].defaultThreshold;
    const result = checkRule(rule.rule_type, threshold, data);
    results.push(result);
  }

  return results;
}

function checkRule(
  ruleType: RuleType,
  threshold: number,
  data: {
    yesterday: string;
    routines: RoutineRow[];
    tradeCount: number;
    hasJournalNote: boolean;
  },
): RuleCheckResult {
  const routineMap = new Map(data.routines.map((r) => [r.log_date, r]));
  const yesterdayRoutine = routineMap.get(data.yesterday);

  switch (ruleType) {
    case "exercise_gap_days": {
      let gap = 0;
      let cursor = data.yesterday;
      for (let i = 0; i < threshold; i++) {
        const r = routineMap.get(cursor);
        if (r?.exercised) break;
        gap++;
        cursor = shiftDate(cursor, -1);
      }
      const triggered = gap >= threshold;
      return {
        rule_type: ruleType,
        triggered,
        message: triggered
          ? `You haven't exercised in ${threshold} consecutive days`
          : "",
      };
    }

    case "work_hours_min": {
      const hours = yesterdayRoutine
        ? calcWorkHours(
            yesterdayRoutine.worked,
            yesterdayRoutine.work_start,
            yesterdayRoutine.work_end,
          )
        : null;
      const triggered =
        !yesterdayRoutine?.worked ||
        hours == null ||
        hours < threshold;
      return {
        rule_type: ruleType,
        triggered,
        message: triggered
          ? hours != null
            ? `You worked ${hours}h yesterday — below your ${threshold}h target`
            : `No work hours logged yesterday — target is ${threshold}h`
          : "",
      };
    }

    case "sleep_hours_min": {
      const sleepH = yesterdayRoutine
        ? calcSleepHours(
            yesterdayRoutine.sleep_time,
            yesterdayRoutine.wake_time,
          )
        : null;
      const triggered = sleepH == null || sleepH < threshold;
      return {
        rule_type: ruleType,
        triggered,
        message: triggered
          ? sleepH != null
            ? `You slept ${sleepH}h yesterday — below your ${threshold}h minimum`
            : `No sleep logged yesterday — minimum is ${threshold}h`
          : "",
      };
    }

    case "journal_missing": {
      const triggered = data.tradeCount === 0 && !data.hasJournalNote;
      return {
        rule_type: ruleType,
        triggered,
        message: triggered
          ? "No journal entry logged yesterday"
          : "",
      };
    }

    default:
      return { rule_type: ruleType, triggered: false, message: "" };
  }
}

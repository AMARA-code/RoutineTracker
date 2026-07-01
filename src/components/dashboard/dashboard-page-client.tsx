"use client";

import Link from "next/link";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Activity,
  BookOpen,
  Dumbbell,
  Moon,
  ScrollText,
} from "lucide-react";
import { MotionSection } from "@/components/ui/motion-section";
import { AlertsBanner, DashboardQuickLog, DashboardWorkBody } from "./dashboard-widgets";
import { PageHeader } from "@/components/layout/page-header";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import type { DashboardData } from "@/app/(app)/dashboard/actions";

function SnapshotCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
          {sub && (
            <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/30">
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardPageClient({ data }: { data: DashboardData }) {
  const sleepStr =
    data.sleepHours != null ? `${data.sleepHours}h` : "Not logged";
  const workStr = data.worked
    ? data.workHours != null
      ? `${data.workHours}h`
      : "Yes"
    : "No";

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Your command center — today's habits, streaks, and weekly progress."
      >
        <Link href="/routine">
          <Button size="sm">Log routine</Button>
        </Link>
      </PageHeader>

      <MotionSection className="mb-6">
        <AlertsBanner alerts={data.recentAlerts} />
      </MotionSection>

      <MotionSection delay={0.05} className="mb-6 rounded-2xl gradient-hero p-6 card-shadow">
        <p className="text-sm font-medium text-primary-foreground/80">
          Welcome back
        </p>
        <h2 className="mt-1 text-xl font-semibold text-primary-foreground">
          Today&apos;s snapshot
        </h2>
        <p className="mt-2 text-sm text-primary-foreground/70">
          {data.journalWeekTrades} trades this week · {data.routineWeekWorked}/7
          work days · {data.routineWeekExercised}/7 exercise days
        </p>
      </MotionSection>

      <MotionSection delay={0.1} className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SnapshotCard
          label="Journal today"
          value={String(data.tradeCount)}
          sub={`${data.journalWeekR >= 0 ? "+" : ""}${data.journalWeekR}R this week`}
          icon={BookOpen}
        />
        <SnapshotCard
          label="Worked today"
          value={workStr}
          icon={Activity}
        />
        <SnapshotCard
          label="Sleep"
          value={sleepStr}
          icon={Moon}
        />
        <SnapshotCard
          label="Streaks"
          value={`${data.exerciseStreak}d`}
          sub={`Exercise · Quran ${data.quranStreak}d`}
          icon={Dumbbell}
        />
      </MotionSection>

      <MotionSection delay={0.15} className="mb-8 grid gap-6 lg:grid-cols-2">
        <DashboardQuickLog
          date={data.date}
          waterGlasses={data.waterGlasses}
          exercised={data.exercised}
          prayer={data.prayer}
          meal={data.meal}
          hygiene={data.hygiene}
        />
        <DashboardWorkBody date={data.date} routine={data.routine} />
      </MotionSection>

      <MotionSection delay={0.18} className="mb-8">
        <Card variant="alerts">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ScrollText className="h-4 w-4" />
              Quick links
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link href="/journal">
              <Button variant="outline" size="sm">Journal</Button>
            </Link>
            <Link href="/quran">
              <Button variant="outline" size="sm">Quran</Button>
            </Link>
            <Link href="/personal">
              <Button variant="outline" size="sm">Personal</Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" size="sm">Alerts</Button>
            </Link>
          </CardContent>
        </Card>
      </MotionSection>

      <MotionSection delay={0.2} className="grid gap-6 lg:grid-cols-2">
        <Card variant="journal">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Journal this week</CardTitle>
              <Badge variant="ice">{data.journalWeekTrades} trades</Badge>
            </div>
            <CardDescription>Cumulative R curve</CardDescription>
          </CardHeader>
          <CardContent>
            {data.journalCurve.every((d) => d.cumulativeR === 0) ? (
              <div className="flex h-36 items-center justify-center text-sm text-muted-foreground">
                No trades this week
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={data.journalCurve}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8ee" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} width={30} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="cumulativeR"
                    stroke="#7ec8e3"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card variant="routine">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Work hours this week</CardTitle>
              <Badge variant="mint">{data.routineWeekWorked}/7 days</Badge>
            </div>
            <CardDescription>vs 9h target</CardDescription>
          </CardHeader>
          <CardContent>
            {data.workHoursChart.every((d) => d.hours == null) ? (
              <div className="flex h-36 items-center justify-center text-sm text-muted-foreground">
                No work hours logged
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={data.workHoursChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8ee" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} width={30} />
                  <Tooltip formatter={(v) => [`${v ?? 0}h`, "Work"]} />
                  <Bar dataKey="hours" fill="#c8ead9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </MotionSection>
    </div>
  );
}

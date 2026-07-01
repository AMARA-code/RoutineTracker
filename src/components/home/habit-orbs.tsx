"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Dumbbell,
  Flame,
  LayoutDashboard,
  ScrollText,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { saveExercise } from "@/app/(app)/routine/actions";
import { Loader } from "@/components/ui/loader";

function HabitOrb({
  label,
  value,
  sub,
  icon: Icon,
  active,
  onClick,
  color,
  delay,
  pending,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  active?: boolean;
  onClick?: () => void;
  color: string;
  delay: number;
  pending?: boolean;
}) {
  const Wrapper = onClick ? motion.button : motion.div;

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      disabled={pending}
      onClick={onClick}
      className="home-orb relative flex flex-col items-center gap-3 rounded-3xl p-5 text-center focus:outline-none"
      style={{
        background: `linear-gradient(145deg, ${color}33, rgba(255,255,255,0.5))`,
        boxShadow: active
          ? `0 12px 40px ${color}55, inset 0 1px 0 rgba(255,255,255,0.9)`
          : "0 6px 24px rgba(45,52,54,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 18, delay }}
      whileHover={onClick ? { scale: 1.04 } : { scale: 1.02 }}
      whileTap={onClick ? { scale: 0.96 } : undefined}
    >
      {pending && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/50">
          <Loader size="sm" />
        </div>
      )}
      <motion.div
        className="flex h-12 w-12 items-center justify-center rounded-2xl"
        style={{ background: `${color}66` }}
        animate={active ? { rotate: [0, 5, -5, 0] } : {}}
        transition={{ duration: 2, repeat: active ? Infinity : 0, repeatDelay: 3 }}
      >
        <Icon className="h-6 w-6" style={{ color: "#2d3436" }} />
      </motion.div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-lg font-bold">{value}</p>
        {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
      </div>
      {active && (
        <motion.div
          className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-primary"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </Wrapper>
  );
}

export function HabitOrbs({
  date,
  exercised,
  exerciseStreak,
  quranStreak,
  quranDone,
  tradeCount,
  worked,
  workHours,
}: {
  date: string;
  exercised: boolean;
  exerciseStreak: number;
  quranStreak: number;
  quranDone: boolean;
  tradeCount: number;
  worked: boolean;
  workHours: number | null;
}) {
  const router = useRouter();
  const [localExercised, setLocalExercised] = useState(exercised);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setLocalExercised(exercised);
  }, [exercised]);

  const toggleExercise = () => {
    const next = !localExercised;
    setLocalExercised(next);
    const fd = new FormData();
    fd.set("log_date", date);
    fd.set("exercised", next ? "true" : "false");
    startTransition(async () => {
      await saveExercise(null, fd);
      router.refresh();
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <HabitOrb
        label="Exercise"
        value={localExercised ? "Done" : "Pending"}
        sub={`${exerciseStreak}d streak`}
        icon={Dumbbell}
        active={localExercised}
        onClick={toggleExercise}
        color="#8da37c"
        delay={0.35}
        pending={pending}
      />
      <HabitOrb
        label="Quran"
        value={quranDone ? "Read" : "Today"}
        sub={`${quranStreak}d streak`}
        icon={ScrollText}
        active={quranDone}
        color="#c4b7d4"
        delay={0.42}
      />
      <HabitOrb
        label="Journal"
        value={String(tradeCount)}
        sub={tradeCount === 1 ? "trade today" : "trades today"}
        icon={BookOpen}
        active={tradeCount > 0}
        color="#aed6f1"
        delay={0.49}
      />
      <HabitOrb
        label="Work"
        value={worked ? (workHours != null ? `${workHours}h` : "Yes") : "—"}
        sub={worked ? "logged" : "not yet"}
        icon={TrendingUp}
        active={worked}
        color="#f5b041"
        delay={0.56}
      />
    </div>
  );
}

export function EnterDashboardCTA() {
  return (
    <motion.div
      className="relative flex flex-col items-center gap-6 py-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 120 }}
    >
      <Link href="/" className="group relative block w-full max-w-md">
        <motion.div
          className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary via-lavender to-mint opacity-60 blur-lg"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="relative flex items-center gap-3 rounded-2xl px-8 py-4 font-semibold text-primary-foreground"
          style={{
            background: "linear-gradient(135deg, #e08a8a 0%, #d47070 40%, #c4b7d4 100%)",
            boxShadow: "0 12px 40px rgba(224,138,138,0.35)",
          }}
          whileHover={{ scale: 1.04, rotateX: 4, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          <LayoutDashboard className="h-5 w-5" />
          Enter Command Center
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight className="h-5 w-5" />
          </motion.span>
        </motion.div>
      </Link>

      <motion.p
        className="flex items-center gap-2 text-sm text-muted-foreground"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Sparkles className="h-4 w-4" />
        Your full dashboard awaits — charts, journal, routines & more
        <Flame className="h-4 w-4" />
      </motion.p>
    </motion.div>
  );
}

"use client";

import { useEffect, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Sparkles } from "lucide-react";
import { setWaterGlasses } from "@/app/(app)/routine/actions";
import { WATER_GOAL } from "@/types/routine";

function Glass({
  index,
  filled,
  onClick,
}: {
  index: number;
  filled: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="group relative z-10 flex cursor-pointer flex-col items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 22,
        delay: index * 0.05,
      }}
      whileHover={{ scale: 1.08, y: -4 }}
      whileTap={{ scale: 0.94 }}
    >
      <div className="relative h-16 w-11 sm:h-[4.5rem] sm:w-14">
        <div className="absolute -bottom-1 left-1/2 h-2 w-8 -translate-x-1/2 rounded-full bg-foreground/10 blur-sm" />

        <div
          className="absolute inset-0 overflow-hidden rounded-b-2xl rounded-t-lg border-2 border-white/90 bg-white/40 shadow-md"
          style={{
            boxShadow: filled
              ? "0 8px 28px rgba(126,200,227,0.5), inset 0 1px 0 rgba(255,255,255,0.95)"
              : "0 4px 14px rgba(62,76,89,0.1), inset 0 1px 0 rgba(255,255,255,0.85)",
          }}
        >
          <motion.div
            className="absolute bottom-0 left-0 right-0 overflow-hidden rounded-b-xl"
            initial={false}
            animate={{ height: filled ? "85%" : "0%" }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          >
            <div
              className="h-full w-full"
              style={{
                background:
                  "linear-gradient(0deg, #4a9ec4 0%, #7ec8e3 45%, #a8dff0 100%)",
              }}
            />
            {filled && (
              <div className="absolute left-0 right-0 top-0 h-1.5 bg-white/60" />
            )}
          </motion.div>

          <div className="pointer-events-none absolute inset-y-2 left-1 w-1 rounded-full bg-white/70" />
        </div>

        <AnimatePresence>
          {filled && (
            <motion.div
              className="pointer-events-none absolute -right-0.5 -top-0.5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#5a9eb5]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <span className="text-[10px] font-medium text-muted-foreground">
        {index + 1}
      </span>
    </motion.button>
  );
}

export function WaterGlasses3D({
  date,
  initialCount,
}: {
  date: string;
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount);
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  const handleGlassClick = (index: number) => {
    const target = index + 1;
    const newCount = count >= target ? index : target;
    const previous = count;
    setCount(newCount);
    setError(null);

    startTransition(async () => {
      const result = await setWaterGlasses(date, newCount);
      if (result.error) {
        setError(result.error);
        setCount(previous);
      }
    });
  };

  const progress = (count / WATER_GOAL) * 100;

  return (
    <motion.div
      className="home-glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.1 }}
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />

      <div className="relative mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Droplets className="h-5 w-5 text-[#5a9eb5]" />
            <h2 className="text-lg font-semibold">Hydration</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Tap a glass to fill up to that level
          </p>
        </div>
        <motion.div
          key={count}
          className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-primary/50 text-primary-foreground"
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <span className="text-xl font-bold leading-none">{count}</span>
          <span className="text-[10px] opacity-80">/ {WATER_GOAL}</span>
        </motion.div>
      </div>

      <div className="relative mb-8 h-2.5 overflow-hidden rounded-full bg-white/60">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: "linear-gradient(90deg, #7ec8e3, #b8e2f2, #c8ead9)",
          }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
      </div>

      <div className="relative flex flex-wrap justify-center gap-3 sm:gap-4">
        {Array.from({ length: WATER_GOAL }, (_, i) => (
          <Glass
            key={i}
            index={i}
            filled={i < count}
            onClick={() => handleGlassClick(i)}
          />
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {count === 0 && "Start your day with a glass of water"}
        {count > 0 && count < WATER_GOAL &&
          `${WATER_GOAL - count} more to hit your goal`}
        {count >= WATER_GOAL && "Goal reached — you're hydrated!"}
      </p>

      {error && (
        <p className="mt-2 text-center text-sm text-[#8b5a5a]">{error}</p>
      )}
    </motion.div>
  );
}

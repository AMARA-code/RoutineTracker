"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Sparkles } from "lucide-react";
import { setWaterGlasses } from "@/app/(app)/routine/actions";
import { WATER_GOAL } from "@/types/routine";

function Glass({
  index,
  filled,
  onClick,
  pending,
}: {
  index: number;
  filled: boolean;
  onClick: () => void;
  pending: boolean;
}) {
  return (
    <motion.button
      type="button"
      disabled={pending}
      onClick={onClick}
      className="group relative flex flex-col items-center gap-1.5 focus:outline-none"
      initial={{ opacity: 0, y: 30, rotateX: -20 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 22,
        delay: index * 0.06,
      }}
      whileHover={{ scale: 1.1, y: -6, rotateY: 8 }}
      whileTap={{ scale: 0.92 }}
      style={{ transformStyle: "preserve-3d", perspective: 800 }}
    >
      <div
        className="relative h-16 w-11 sm:h-20 sm:w-14"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Glass shadow */}
        <div className="absolute -bottom-1 left-1/2 h-2 w-8 -translate-x-1/2 rounded-full bg-foreground/10 blur-sm" />

        {/* Glass body */}
        <div
          className="absolute inset-0 overflow-hidden rounded-b-2xl rounded-t-lg border-2 border-white/80 bg-white/30 shadow-lg backdrop-blur-sm"
          style={{
            boxShadow: filled
              ? "0 8px 32px rgba(126,200,227,0.45), inset 0 1px 0 rgba(255,255,255,0.9)"
              : "0 4px 16px rgba(62,76,89,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
        >
          {/* Water fill */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 origin-bottom"
            initial={false}
            animate={{
              height: filled ? "82%" : "0%",
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 24,
            }}
          >
            <div
              className="h-full w-full"
              style={{
                background:
                  "linear-gradient(180deg, rgba(126,200,227,0.95) 0%, rgba(90,170,210,0.9) 60%, rgba(70,150,195,0.95) 100%)",
              }}
            />
            {/* Water surface ripple */}
            <AnimatePresence>
              {filled && (
                <motion.div
                  className="absolute -top-1 left-0 right-0 h-2 rounded-full bg-white/50"
                  initial={{ scaleX: 0.5, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 0.7 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* Glass shine */}
          <div className="pointer-events-none absolute inset-y-1 left-1 w-1.5 rounded-full bg-white/60" />
          <div className="pointer-events-none absolute right-1.5 top-2 h-3 w-1 rounded-full bg-white/40" />
        </div>

        {/* Sparkle on fill */}
        <AnimatePresence>
          {filled && (
            <motion.div
              className="absolute -right-1 -top-1"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#7ec8e3]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <span className="text-[10px] font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
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
  const router = useRouter();
  const [count, setCount] = useState(initialCount);
  const [pending, startTransition] = useTransition();
  const [ripple, setRipple] = useState<number | null>(null);

  const handleGlassClick = (index: number) => {
    const target = index + 1;
    const newCount = count === target ? target - 1 : target;
    setCount(newCount);
    setRipple(index);
    setTimeout(() => setRipple(null), 600);

    startTransition(async () => {
      await setWaterGlasses(date, newCount);
      router.refresh();
    });
  };

  const progress = (count / WATER_GOAL) * 100;

  return (
    <motion.div
      className="home-glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8"
      initial={{ opacity: 0, rotateX: 12, y: 40 }}
      animate={{ opacity: 1, rotateX: 0, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.15 }}
      style={{ transformStyle: "preserve-3d", perspective: 1200 }}
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />

      <div className="relative mb-6 flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Droplets className="h-5 w-5 text-[#5a9eb5]" />
            <h2 className="text-lg font-semibold">Hydration</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Tap a glass to fill — stay refreshed all day
          </p>
        </div>
        <motion.div
          key={count}
          className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-primary/40 text-primary-foreground"
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <span className="text-xl font-bold leading-none">{count}</span>
          <span className="text-[10px] opacity-70">/ {WATER_GOAL}</span>
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="relative mb-8 h-2 overflow-hidden rounded-full bg-white/50">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: "linear-gradient(90deg, #7ec8e3, #b8e2f2, #c8ead9)",
          }}
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
      </div>

      {/* 3D glass rack */}
      <motion.div
        className="flex flex-wrap justify-center gap-3 sm:gap-4"
        style={{ perspective: 1000, transformStyle: "preserve-3d" }}
        animate={{ rotateX: [2, -1, 2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        {Array.from({ length: WATER_GOAL }, (_, i) => (
          <div key={i} className="relative">
            <Glass
              index={i}
              filled={i < count}
              onClick={() => handleGlassClick(i)}
              pending={pending}
            />
            <AnimatePresence>
              {ripple === i && (
                <motion.div
                  className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#7ec8e3]"
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: 2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </motion.div>

      <motion.p
        className="mt-6 text-center text-sm text-muted-foreground"
        key={`msg-${count}`}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {count === 0 && "Start your day with a glass of water"}
        {count > 0 && count < WATER_GOAL && `${WATER_GOAL - count} more to hit your goal`}
        {count >= WATER_GOAL && "Goal reached — you're hydrated!"}
      </motion.p>
    </motion.div>
  );
}

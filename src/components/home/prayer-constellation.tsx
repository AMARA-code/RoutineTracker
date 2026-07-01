"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Moon, Star } from "lucide-react";
import { togglePrayerField } from "@/app/(app)/routine/actions";
import { PRAYER_FIELDS, type PrayerLog } from "@/types/routine";
import { Loader } from "@/components/ui/loader";

const prayerIcons: Record<string, string> = {
  fajr: "🌅",
  dhuhr: "☀️",
  asr: "🌤️",
  maghrib: "🌇",
  isha: "🌙",
};

export function PrayerConstellation({
  date,
  prayer,
}: {
  date: string;
  prayer: PrayerLog | null;
}) {
  const router = useRouter();
  const [localPrayer, setLocalPrayer] = useState(prayer);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setLocalPrayer(prayer);
  }, [prayer]);

  const doneCount = PRAYER_FIELDS.filter((p) => localPrayer?.[p.key]).length;

  const toggle = (field: (typeof PRAYER_FIELDS)[number]["key"]) => {
    setLocalPrayer((prev) => ({
      log_date: date,
      fajr: false,
      dhuhr: false,
      asr: false,
      maghrib: false,
      isha: false,
      ...prev,
      [field]: !(prev?.[field] ?? false),
    }));
    startTransition(async () => {
      await togglePrayerField(date, field);
      router.refresh();
    });
  };

  return (
    <motion.div
      className="home-glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.25 }}
    >
      {pending && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-white/50 backdrop-blur-[2px]">
          <Loader size="md" />
        </div>
      )}
      <div className="absolute -left-6 -bottom-6 h-28 w-28 rounded-full bg-lavender/30 blur-2xl" />

      <div className="relative mb-6 flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Moon className="h-5 w-5 text-lavender" />
            <h2 className="font-serif text-lg font-semibold">Prayers</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Mark each salah as you complete it
          </p>
        </div>
        <motion.div
          className="flex items-center gap-1.5 rounded-2xl bg-lavender/40 px-3 py-2"
          animate={{ scale: doneCount === 5 ? [1, 1.08, 1] : 1 }}
          transition={{ duration: 0.5 }}
        >
          <Star className="h-4 w-4 text-lavender" />
          <span className="text-sm font-semibold text-foreground">
            {doneCount}/5
          </span>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
        {PRAYER_FIELDS.map(({ key, label }, i) => {
          const checked = localPrayer?.[key] ?? false;
          return (
            <motion.button
              key={key}
              type="button"
              disabled={pending}
              onClick={() => toggle(key)}
              className="relative flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-colors focus:outline-none"
              style={{
                borderColor: checked ? "rgba(224,138,138,0.5)" : "rgba(255,255,255,0.6)",
                background: checked
                  ? "linear-gradient(145deg, rgba(224,138,138,0.2), rgba(196,183,212,0.15))"
                  : "rgba(255,255,255,0.35)",
                boxShadow: checked
                  ? "0 8px 24px rgba(224,138,138,0.2), inset 0 1px 0 rgba(255,255,255,0.8)"
                  : "0 4px 12px rgba(45,52,54,0.06)",
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: checked ? 1.02 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 22,
                delay: 0.3 + i * 0.07,
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <motion.span
                className="text-2xl"
                animate={checked ? { rotate: [0, -8, 8, 0], scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                {prayerIcons[key]}
              </motion.span>
              <span className="text-xs font-semibold">{label}</span>

              <motion.div
                className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-primary-foreground"
                animate={{
                  scale: checked ? 1 : 0,
                  backgroundColor: checked ? "#e08a8a" : "transparent",
                }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {checked ? "✓" : ""}
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

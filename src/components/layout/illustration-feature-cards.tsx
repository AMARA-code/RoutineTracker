"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { HabitCardVariant } from "@/components/ui/habit-stat-card";
import { cn } from "@/lib/utils";

export type IllustrationCardItem = {
  src: string;
  alt: string;
  label: string;
  caption: string;
  variant: HabitCardVariant;
};

const variantClass: Record<HabitCardVariant, string> = {
  peach: "habit-card-peach",
  lavender: "habit-card-lavender",
  sky: "habit-card-sky",
  coral: "habit-card-coral",
  sage: "habit-card-sage",
};

export function IllustrationFeatureCards({
  items,
  className,
  delay = 0.2,
}: {
  items: IllustrationCardItem[];
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          className={cn(
            "premium-illustration-card habit-card flex flex-col p-5",
            variantClass[item.variant],
          )}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + i * 0.06 }}
        >
          <div className="mb-4 flex h-28 items-center justify-center rounded-2xl bg-white/92 p-3 shadow-sm ring-1 ring-white/60">
            <Image
              src={item.src}
              alt={item.alt}
              width={200}
              height={160}
              className="h-20 w-auto object-contain sm:h-24"
            />
          </div>
          <p className="font-serif text-sm font-semibold">{item.label}</p>
          <p className="mt-1 text-xs leading-relaxed opacity-90">
            {item.caption}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}

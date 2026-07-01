"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const illustrations = [
  {
    src: "/illustrations/fitness-stats.svg",
    alt: "Fitness tracking illustration",
    label: "Stay active",
    caption: "Track exercise & build streaks",
  },
  {
    src: "/illustrations/morning-plans.svg",
    alt: "Daily planning illustration",
    label: "Plan your day",
    caption: "Morning routines made simple",
  },
  {
    src: "/illustrations/investing.svg",
    alt: "Progress tracking illustration",
    label: "See progress",
    caption: "Watch your habits grow",
  },
];

export function HomeIllustrations() {
  return (
    <motion.div
      className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {illustrations.map((item, i) => (
        <motion.div
          key={item.label}
          className="home-glass-panel flex flex-col items-center gap-3 rounded-3xl p-5 text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 + i * 0.08 }}
        >
          <Image
            src={item.src}
            alt={item.alt}
            width={180}
            height={140}
            className="h-28 w-auto object-contain"
          />
          <div>
            <p className="font-serif text-sm font-semibold text-foreground">
              {item.label}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {item.caption}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

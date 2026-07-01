"use client";

import { motion } from "framer-motion";
import type { HomeData } from "@/app/home/actions";
import { FloatingBackground } from "./floating-background";
import { HabitOrbs, EnterDashboardCTA } from "./habit-orbs";
import { HomeHero } from "./home-hero";
import { HomeIllustrations } from "./home-illustrations";
import { PrayerConstellation } from "./prayer-constellation";
import { WaterGlasses3D } from "./water-glasses-3d";

export function HomePageClient({ data }: { data: HomeData }) {
  return (
    <div className="home-page relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <FloatingBackground />

      <div className="relative z-10 px-4 py-8 sm:px-8 sm:py-12 lg:py-14">
        <HomeHero userName={data.userName} />

        <motion.div
          className="mx-auto mt-16 max-w-5xl space-y-8 sm:mt-20 lg:mt-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <WaterGlasses3D
            key={data.date}
            date={data.date}
            initialCount={data.waterGlasses}
          />

          <PrayerConstellation date={data.date} prayer={data.prayer} />

          <HabitOrbs
            date={data.date}
            exercised={data.exercised}
            exerciseStreak={data.exerciseStreak}
            quranStreak={data.quranStreak}
            quranDone={data.quranDone}
            tradeCount={data.tradeCount}
            worked={data.worked}
            workHours={data.workHours}
          />

          <HomeIllustrations />

          <EnterDashboardCTA />
        </motion.div>
      </div>
    </div>
  );
}

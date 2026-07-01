"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { HomeData } from "@/app/(app)/home/actions";
import { FloatingBackground } from "./floating-background";
import { HabitOrbs, EnterDashboardCTA } from "./habit-orbs";
import { HomeHero } from "./home-hero";
import { PrayerConstellation } from "./prayer-constellation";
import { WaterGlasses3D } from "./water-glasses-3d";

function TiltContainer({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), {
    stiffness: 200,
    damping: 20,
  });

  return (
    <motion.div
      className="relative"
      style={{ perspective: 1400, transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

export function HomePageClient({ data }: { data: HomeData }) {
  return (
    <div className="home-page relative -mx-4 -mt-4 min-h-[calc(100vh-5rem)] overflow-hidden lg:-mx-8 lg:-mt-8">
      <FloatingBackground />

      <div
        className="relative z-10 px-4 py-8 sm:px-8 sm:py-12 lg:py-16"
        style={{ perspective: 1200 }}
      >
        <HomeHero userName={data.userName} />

        <motion.div
          className="mx-auto mt-10 max-w-5xl space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <TiltContainer>
            <WaterGlasses3D date={data.date} initialCount={data.waterGlasses} />
          </TiltContainer>

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

          <EnterDashboardCTA />
        </motion.div>
      </div>
    </div>
  );
}

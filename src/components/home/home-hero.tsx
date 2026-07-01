"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { pageIllustrations } from "@/config/page-illustrations";
import { FloatingIllustration } from "@/components/layout/floating-illustration";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function HomeHero({ userName }: { userName: string | null }) {
  const greeting = getGreeting();
  const name = userName ? `, ${userName}` : "";

  return (
    <section className="relative mx-auto max-w-5xl pb-4 sm:pb-8">
      <motion.div
        className="mb-6 text-center sm:mb-8"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-primary">
          Your daily sanctuary
        </p>
        <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          Keep a daily journal
          <span className="block text-primary">of your best life</span>
        </h2>
      </motion.div>

      <div className="relative">
        <FloatingIllustration
          src={pageIllustrations.home.src}
          alt={pageIllustrations.home.alt}
          priority
          className="mb-6 sm:absolute sm:-bottom-8 sm:right-0 sm:z-30 sm:mb-0 sm:translate-x-2 lg:-bottom-12 lg:translate-x-6"
          imageClassName="h-56 sm:h-72 md:h-80 lg:h-[26rem]"
        />

        <motion.div
          className="home-hero-panel relative z-10 overflow-hidden p-6 sm:p-8 lg:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 22, delay: 0.1 }}
        >
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-8 right-1/4 h-32 w-32 rounded-full bg-lavender/20 blur-3xl" />

          <div className="relative max-w-xl sm:max-w-lg lg:max-w-[55%]">
            <motion.div
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white/70 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {formatDate()}
            </motion.div>

            <motion.h1
              className="font-serif text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              {greeting}
              {name}
            </motion.h1>

            <motion.p
              className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
            >
              Hydrate, pray, move, and build discipline — one beautiful
              moment at a time.
            </motion.p>

            <motion.div
              className="mt-6 flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {["Water", "Prayer", "Exercise", "Journal"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-foreground shadow-sm ring-1 ring-primary/15"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            <motion.div
              className="mt-7 h-1.5 w-28 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, #e08a8a, #f5b041, #c4b7d4, #aed6f1)",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.45, duration: 0.7, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

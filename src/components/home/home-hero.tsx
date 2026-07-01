"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

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
    <motion.div
      className="relative text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/40 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm"
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
      >
        <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
        {formatDate()}
      </motion.div>

      <motion.h1
        className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.15 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.span
          className="block bg-gradient-to-r from-[#2a4a5a] via-[#4a6a7a] to-[#3e4c59] bg-clip-text text-transparent"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 8, repeat: Infinity }}
          style={{ backgroundSize: "200% auto" }}
        >
          {greeting}
          {name}
        </motion.span>
      </motion.h1>

      <motion.p
        className="mx-auto mt-3 max-w-md text-base text-muted-foreground sm:text-lg"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Your daily sanctuary — hydrate, pray, move, and build discipline
        one beautiful moment at a time.
      </motion.p>

      {/* Decorative 3D line */}
      <motion.div
        className="mx-auto mt-6 h-1 w-24 rounded-full"
        style={{
          background: "linear-gradient(90deg, transparent, #b8e2f2, #d9d3f0, #c8ead9, transparent)",
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.45, duration: 0.8, ease: "easeOut" }}
      />
    </motion.div>
  );
}

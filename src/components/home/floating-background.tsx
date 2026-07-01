"use client";

import { motion } from "framer-motion";

const orbs = [
  { size: 320, x: "8%", y: "12%", color: "#e08a8a", delay: 0 },
  { size: 240, x: "78%", y: "8%", color: "#c4b7d4", delay: 1.2 },
  { size: 280, x: "65%", y: "62%", color: "#aed6f1", delay: 0.6 },
  { size: 180, x: "12%", y: "72%", color: "#8da37c", delay: 1.8 },
];

export function FloatingBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-35 blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          }}
          animate={{
            y: [0, -16, 0, 12, 0],
            x: [0, 10, -8, 6, 0],
            scale: [1, 1.04, 0.98, 1.02, 1],
          }}
          transition={{
            duration: 14 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(224,138,138,0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(196,183,212,0.18) 0%, transparent 45%),
            radial-gradient(circle at 60% 80%, rgba(174,214,241,0.18) 0%, transparent 50%)
          `,
        }}
        animate={{ opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

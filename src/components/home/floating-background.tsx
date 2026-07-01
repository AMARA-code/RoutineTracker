"use client";

import { motion } from "framer-motion";

const orbs = [
  { size: 320, x: "8%", y: "12%", color: "#b8e2f2", delay: 0 },
  { size: 240, x: "78%", y: "8%", color: "#d9d3f0", delay: 1.2 },
  { size: 280, x: "65%", y: "62%", color: "#c8ead9", delay: 0.6 },
  { size: 180, x: "12%", y: "72%", color: "#c9e4ca", delay: 1.8 },
];

export function FloatingBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-40 blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          }}
          animate={{
            y: [0, -24, 0, 18, 0],
            x: [0, 14, -10, 8, 0],
            scale: [1, 1.06, 0.96, 1.04, 1],
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
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(184,226,242,0.25) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(217,211,240,0.2) 0%, transparent 45%),
            radial-gradient(circle at 60% 80%, rgba(200,234,217,0.2) 0%, transparent 50%)
          `,
        }}
        animate={{ opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

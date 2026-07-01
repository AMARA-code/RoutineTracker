"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import { Button } from "@/components/ui";

export function HomeShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <header className="sticky top-0 z-50 border-b border-primary/15 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-8">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-serif text-lg font-semibold tracking-tight">
              RoutineTracker
            </span>
          </motion.div>

          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/">
              <Button size="sm" className="gap-2 shadow-sm">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Go to Dashboard</span>
                <span className="sm:hidden">Dashboard</span>
              </Button>
            </Link>
            <form action={logout}>
              <Button type="submit" variant="ghost" size="sm" aria-label="Log out">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}

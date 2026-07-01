"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { mainNav } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";

const accentColors = {
  ice: "bg-primary/20 text-primary",
  mint: "bg-sage/30 text-[#4a6a3d]",
  lavender: "bg-lavender/40 text-[#5a4f6e]",
};

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Your daily hub
            </p>
            <h1 className="font-serif text-lg font-semibold text-foreground">
              RoutineTracker
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 hover:bg-muted lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {mainNav.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : item.href === "/home"
                  ? pathname === "/home"
                  : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
                  isActive
                    ? "bg-primary/15 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : accentColors[item.accent || "ice"],
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.label}</p>
                  {item.description && (
                    <p className="truncate text-xs opacity-70">
                      {item.description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <div className="rounded-xl gradient-hero p-4 text-center">
            <p className="text-xs font-medium text-primary-foreground/80">
              Build consistency.
            </p>
            <p className="text-sm font-semibold text-primary-foreground">
              One day at a time.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
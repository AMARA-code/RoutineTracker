"use client";

import { usePathname } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { mainNav } from "@/config/navigation";
import { Button } from "@/components/ui";
import { useUIStore } from "@/stores/ui-store";
import { logout } from "@/app/(auth)/actions";

export function Header() {
  const pathname = usePathname();
  const { toggleSidebar } = useUIStore();

  const currentPage = mainNav.find((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-md lg:px-8">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={toggleSidebar}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold">
            {currentPage?.label ?? "Dashboard"}
          </h2>
          {currentPage?.description && (
            <p className="text-xs text-muted-foreground">
              {currentPage.description}
            </p>
          )}
        </div>
      </div>

      <form action={logout}>
        <Button type="submit" variant="ghost" size="sm">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign out</span>
        </Button>
      </form>
    </header>
  );
}

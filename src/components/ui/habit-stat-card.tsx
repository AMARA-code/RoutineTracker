import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type HabitVariant = "peach" | "lavender" | "sky" | "coral" | "sage";

const VARIANTS: HabitVariant[] = ["peach", "lavender", "sky", "coral", "sage"];

export function pickHabitVariant(index: number): HabitVariant {
  return VARIANTS[index % VARIANTS.length];
}

export function HabitStatCard({
  label,
  value,
  sub,
  icon: Icon,
  variant,
  illustrationSrc,
  className,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  variant: HabitVariant;
  illustrationSrc?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "habit-card p-5",
        `habit-card-${variant}`,
        className,
      )}
    >
      <div className="habit-icon-badge mb-4">
        <Icon className="h-5 w-5" />
      </div>

      <p className="text-xs font-medium uppercase tracking-wide opacity-80">
        {label}
      </p>
      <p className="habit-stat-value mt-1">{value}</p>
      {sub && <p className="mt-1 text-xs opacity-80">{sub}</p>}

      {illustrationSrc && (
        <div className="habit-illustration-peek">
          <Image src={illustrationSrc} alt="" width={96} height={96} />
        </div>
      )}
    </div>
  );
}
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "ice" | "mint" | "lavender";

const variants: Record<BadgeVariant, string> = {
  default: "bg-muted text-muted-foreground",
  success: "bg-sage text-[#3d5a3e]",
  warning: "bg-coral text-[#5a3a3a]",
  danger: "bg-coral text-[#5a3a3a]",
  ice: "bg-primary text-primary-foreground",
  mint: "bg-mint text-[#3d5a4a]",
  lavender: "bg-lavender text-[#4a4560]",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

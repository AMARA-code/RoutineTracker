import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardVariant = "default" | "journal" | "routine" | "alerts" | "hero";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-card border-2 border-border/60",
  journal: "bg-card border-2 border-primary/30 border-l-4 border-l-primary",
  routine: "bg-card border-2 border-sage/30 border-l-4 border-l-sage",
  alerts: "bg-card border-2 border-lavender/30 border-l-4 border-l-lavender",
  hero: "gradient-hero text-primary-foreground border-0",
};

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = "default", padding = "md", children, ...props },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl card-shadow",
        variantStyles[variant],
        paddingStyles[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);

Card.displayName = "Card";

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 space-y-1", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-serif text-lg font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />;
}

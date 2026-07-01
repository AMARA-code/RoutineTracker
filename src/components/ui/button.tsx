import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { LoaderRing } from "./loader";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-[#d47070] shadow-sm",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-[#b5a8c8] shadow-sm",
  ghost: "bg-transparent hover:bg-muted text-foreground",
  danger: "bg-coral text-primary-foreground hover:bg-[#d47070] shadow-sm",
  outline:
    "border-2 border-primary/40 bg-card hover:bg-muted text-foreground shadow-sm",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm rounded-xl",
  md: "h-10 px-4 text-sm rounded-xl",
  lg: "h-12 px-6 text-base rounded-2xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      disabled,
      children,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && <LoaderRing size="sm" />}
      {children}
    </button>
  ),
);

Button.displayName = "Button";

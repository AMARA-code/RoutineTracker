import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <label
        htmlFor={checkboxId}
        className="inline-flex cursor-pointer items-center gap-2.5"
      >
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={cn(
            "h-4 w-4 rounded border-border text-primary accent-[#b8e2f2]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />
        {label && (
          <span className="text-sm font-medium text-foreground">{label}</span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";

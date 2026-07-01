import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TimePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          type="time"
          id={inputId}
          className={cn(
            "flex h-10 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "[&::-webkit-calendar-picker-indicator]:opacity-60",
            error && "border-coral",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#8b5a5a]">{error}</p>}
      </div>
    );
  },
);

TimePicker.displayName = "TimePicker";

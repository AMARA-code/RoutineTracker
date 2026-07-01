import { cn } from "@/lib/utils";

type LoaderSize = "sm" | "md" | "lg";

const dotSizes: Record<LoaderSize, string> = {
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
};

const ringSizes: Record<LoaderSize, string> = {
  sm: "h-6 w-6 border-2",
  md: "h-10 w-10 border-[3px]",
  lg: "h-14 w-14 border-[3px]",
};

export function Loader({
  size = "md",
  className,
  label = "Loading",
}: {
  size?: LoaderSize;
  className?: string;
  label?: string;
}) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("flex flex-col items-center justify-center gap-3", className)}
    >
      <div className="flex items-center gap-1.5">
        <span className={cn("loader-dot rounded-full bg-primary", dotSizes[size])} />
        <span className={cn("loader-dot rounded-full bg-peach", dotSizes[size])} />
        <span className={cn("loader-dot rounded-full bg-lavender", dotSizes[size])} />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function LoaderRing({
  size = "md",
  className,
  label = "Loading",
}: {
  size?: LoaderSize;
  className?: string;
  label?: string;
}) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("flex items-center justify-center", className)}
    >
      <div
        className={cn(
          "loader-ring rounded-full border-primary border-t-transparent",
          ringSizes[size],
        )}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function PageLoader({ message }: { message?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8">
      <Loader size="lg" />
      {message && (
        <p className="font-serif text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
}

export function FullPageLoader({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background/90 backdrop-blur-sm">
      <Loader size="lg" />
      {message && (
        <p className="font-serif text-base text-muted-foreground">{message}</p>
      )}
    </div>
  );
}

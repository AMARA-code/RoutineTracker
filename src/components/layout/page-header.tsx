import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
};

export function PageHeader({
  title,
  description,
  className,
  children,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export function PlaceholderPage({
  title,
  description,
  phase,
  accent = "default",
}: {
  title: string;
  description: string;
  phase: string;
  accent?: "journal" | "routine" | "alerts" | "default";
}) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <Card variant={accent === "default" ? "default" : accent} className="max-w-2xl">
        <CardHeader>
          <CardTitle>Coming in {phase}</CardTitle>
          <CardDescription>
            Foundation is ready. This page will be built in the next phase of
            your plan.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

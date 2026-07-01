import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

type AuthBrandProps = {
  title: string;
  subtitle: string;
};

export function AuthBrand({ title, subtitle }: AuthBrandProps) {
  return (
    <div className="mb-8 text-center">
      <Link href="/" className="inline-block">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-hero">
          <LayoutDashboard className="h-7 w-7 text-primary-foreground" />
        </div>
      </Link>
      <h1 className="text-2xl font-semibold">RoutineTracker</h1>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      <p className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
        {title}
      </p>
    </div>
  );
}

export function AuthPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-lavender/30 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint/20 blur-3xl" />
      </div>
      {children}
    </div>
  );
}

export function AuthFooterLink({
  text,
  linkText,
  href,
}: {
  text: string;
  linkText: string;
  href: string;
}) {
  return (
    <p className="mt-6 text-center text-sm text-muted-foreground">
      {text}{" "}
      <Link href={href} className="font-medium text-primary-foreground hover:underline">
        {linkText}
      </Link>
    </p>
  );
}

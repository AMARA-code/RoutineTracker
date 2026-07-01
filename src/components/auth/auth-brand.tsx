import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { FloatingIllustration } from "@/components/layout/floating-illustration";

type AuthBrandProps = {
  title: string;
  subtitle: string;
};

export function AuthBrand({ title, subtitle }: AuthBrandProps) {
  return (
    <div className="mb-8 text-center">
      <Link href="/" className="inline-block">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-md">
          <BookOpen className="h-7 w-7 text-primary-foreground" />
        </div>
      </Link>
      <h1 className="font-serif text-2xl font-bold tracking-tight">
        RoutineTracker
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      <p className="mt-3 text-xs font-medium uppercase tracking-wider text-primary">
        {title}
      </p>
    </div>
  );
}

const authIllustrations: Record<string, { src: string; alt: string }> = {
  login: {
    src: "/illustrations/morning-plans.svg",
    alt: "Daily planning illustration",
  },
  register: {
    src: "/illustrations/morning-news.svg",
    alt: "Morning routine illustration",
  },
};

export function AuthPageShell({
  children,
  variant = "login",
}: {
  children: React.ReactNode;
  variant?: "login" | "register";
}) {
  const illustration = authIllustrations[variant];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="auth-blob -left-32 top-0 h-96 w-96 bg-primary/30" />
        <div className="auth-blob -right-32 bottom-0 h-96 w-96 bg-lavender/40" />
        <div className="auth-blob left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 bg-peach/25" />
      </div>

      <div className="w-full max-w-5xl">
        {/* ── Mobile: headline + large SVG above form ── */}
        <div className="lg:hidden">
          <div className="mb-6 text-center">
            <p className="font-serif text-xl font-bold leading-tight text-foreground">
              Keep a daily journal
              <span className="block text-primary">of your best life</span>
            </p>
          </div>

          <FloatingIllustration
            src={illustration.src}
            alt={illustration.alt}
            priority
            className="mb-6"
            imageClassName="h-52 max-w-[90vw]"
          />
        </div>

        {/* ── Desktop: illustration + form in one row (original layout) ── */}
        <div className="grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="hidden flex-col items-center justify-center lg:flex">
            <p className="mb-4 text-center font-serif text-3xl font-bold leading-tight text-foreground">
              Keep a daily journal
              <br />
              <span className="text-primary">of your best life</span>
            </p>
            <p className="mb-8 max-w-sm text-center text-sm text-muted-foreground">
              Track habits, routines, and goals with a calm, beautiful space
              designed for consistency.
            </p>
            <Image
              src={illustration.src}
              alt={illustration.alt}
              width={400}
              height={320}
              className="max-h-72 w-auto object-contain"
              priority
            />
          </div>

          <div className="journal-card mx-auto w-full max-w-md p-6 sm:p-8 lg:mx-0">
            {children}
          </div>
        </div>
      </div>
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
      <Link href={href} className="font-medium text-primary hover:underline">
        {linkText}
      </Link>
    </p>
  );
}

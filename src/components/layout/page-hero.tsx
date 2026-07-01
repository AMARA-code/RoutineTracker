import type { PageIllustrationKey } from "@/config/page-illustrations";
import { pageIllustrations } from "@/config/page-illustrations";
import { cn } from "@/lib/utils";
import { FloatingIllustration } from "./floating-illustration";

type PageHeroProps = {
  title: string;
  description?: string;
  illustration: PageIllustrationKey | string;
  className?: string;
  children?: React.ReactNode;
};

function resolveIllustration(illustration: PageIllustrationKey | string) {
  if (illustration in pageIllustrations) {
    return pageIllustrations[illustration as PageIllustrationKey];
  }
  return { src: illustration, alt: "" };
}

export function PageHero({
  title,
  description,
  illustration,
  className,
  children,
}: PageHeroProps) {
  const { src, alt } = resolveIllustration(illustration);

  return (
    <section className={cn("relative mb-10 overflow-visible sm:mb-14", className)}>
      {/* Mobile: large illustration above the card */}
      <FloatingIllustration
        src={src}
        alt={alt}
        priority
        className="mb-5 sm:absolute sm:right-0 sm:top-1/2 sm:z-20 sm:mb-0 sm:-translate-y-1/2 sm:translate-x-4 lg:translate-x-8"
        imageClassName="h-52 sm:h-64 md:h-72 lg:h-[22rem]"
      />

      <div className="journal-card relative z-10 max-w-3xl p-6 sm:max-w-2xl sm:p-8 lg:max-w-[58%]">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
          RoutineTracker
        </p>
        <h1 className="mt-2 font-serif text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
        {children && (
          <div className="mt-5 flex flex-wrap gap-2">{children}</div>
        )}
      </div>
    </section>
  );
}

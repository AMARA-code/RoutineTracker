"use client";

import { IllustrationFeatureCards } from "@/components/layout/illustration-feature-cards";
import { pageFeatureCards, type PageIllustrationKey } from "@/config/page-illustrations";

export function PageIllustrationCards({
  page,
  className,
}: {
  page: PageIllustrationKey;
  className?: string;
}) {
  return (
    <IllustrationFeatureCards
      items={pageFeatureCards[page]}
      className={className}
    />
  );
}

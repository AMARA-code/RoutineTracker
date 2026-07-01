import Image from "next/image";
import { cn } from "@/lib/utils";

type FloatingIllustrationProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function FloatingIllustration({
  src,
  alt,
  className,
  imageClassName,
  priority,
}: FloatingIllustrationProps) {
  return (
    <div
      className={cn(
        "pointer-events-none flex shrink-0 select-none justify-center",
        className,
      )}
      aria-hidden={alt === ""}
    >
      <Image
        src={src}
        alt={alt}
        width={520}
        height={420}
        className={cn(
          "h-44 w-auto max-w-[240px] object-contain sm:h-60 sm:max-w-[300px] md:h-72 md:max-w-[340px] lg:h-80 lg:max-w-[380px]",
          imageClassName,
        )}
        priority={priority}
      />
    </div>
  );
}
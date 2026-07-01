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
          "h-44 w-auto max-w-[85vw] object-contain sm:h-60 md:h-72 lg:h-80",
          imageClassName,
        )}
        priority={priority}
      />
    </div>
  );
}

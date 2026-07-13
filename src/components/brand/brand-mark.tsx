import { ShunyaBodhaLogo } from "@/components/brand/shunya-bodha-logo";
import { ne } from "@/lib/i18n/ne";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  iconSize?: number;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizeStyles = {
  sm: {
    english: "text-sm tracking-[0.1em] sm:text-base",
    nepali: "text-sm tracking-[0.08em]",
    gap: "gap-2",
  },
  md: {
    english: "text-base tracking-[0.12em] sm:text-lg",
    nepali: "text-base tracking-[0.08em]",
    gap: "gap-2.5",
  },
  lg: {
    english: "text-xl tracking-[0.14em] sm:text-2xl",
    nepali: "text-xl tracking-[0.08em] sm:text-2xl",
    gap: "gap-3",
  },
};

export function BrandMark({
  className,
  iconSize,
  showIcon = true,
  size = "md",
}: BrandMarkProps) {
  const styles = sizeStyles[size];
  const resolvedIconSize = iconSize ?? (size === "lg" ? 48 : size === "sm" ? 32 : 40);

  return (
    <div className={cn("flex items-center", styles.gap, className)}>
      {showIcon && <ShunyaBodhaLogo size={resolvedIconSize} />}
      <div className="flex min-w-0 items-baseline gap-2 whitespace-nowrap leading-none">
        <span
          className={cn(
            "font-heading font-medium uppercase text-foreground",
            styles.english
          )}
        >
          {ne.site.nameEn}
        </span>
        <span className="text-gold-muted" aria-hidden>
          ·
        </span>
        <span
          className={cn(
            "font-nepali font-normal text-gold",
            styles.nepali
          )}
        >
          {ne.site.nameNe}
        </span>
      </div>
    </div>
  );
}

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
    english: "text-base tracking-[0.12em]",
    nepali: "text-[0.7rem] tracking-[0.18em]",
    gap: "gap-2.5",
  },
  md: {
    english: "text-lg tracking-[0.14em] sm:text-xl",
    nepali: "text-[0.75rem] tracking-[0.2em]",
    gap: "gap-3",
  },
  lg: {
    english: "text-2xl tracking-[0.16em] sm:text-3xl",
    nepali: "text-sm tracking-[0.22em]",
    gap: "gap-3.5",
  },
};

export function BrandMark({
  className,
  iconSize,
  showIcon = true,
  size = "md",
}: BrandMarkProps) {
  const styles = sizeStyles[size];
  const resolvedIconSize = iconSize ?? (size === "lg" ? 52 : size === "sm" ? 36 : 44);

  return (
    <div className={cn("flex items-center", styles.gap, className)}>
      {showIcon && <ShunyaBodhaLogo size={resolvedIconSize} />}
      <div className="flex flex-col leading-tight">
        <span
          className={cn(
            "font-heading font-medium uppercase text-foreground",
            styles.english
          )}
        >
          {ne.site.nameEn}
        </span>
        <span
          className={cn(
            "font-nepali mt-0.5 font-normal text-gold",
            styles.nepali
          )}
        >
          {ne.site.nameNe}
        </span>
      </div>
    </div>
  );
}

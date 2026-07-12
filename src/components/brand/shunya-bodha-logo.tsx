type ShunyaBodhaLogoProps = {
  className?: string;
  size?: number;
};

/** Ensō + mountain + sun — Shunya Bodha brand mark */
export function ShunyaBodhaLogo({ className, size = 48 }: ShunyaBodhaLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <path
        d="M11 37C5.5 28 6 14 18 9C26 5.5 36 8 40.5 18C43 24 41.5 32 36 37"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        className="text-sage"
      />
      <path
        d="M12 38L19.5 26.5L24 31.5L29 22L36 38H12Z"
        fill="currentColor"
        className="text-sage"
      />
      <path
        d="M21.5 31.5L24 28.5L26 30.5"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-background"
      />
      <path
        d="M28.5 27L30.5 23.5L32 26"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-background"
      />
      <circle cx="24" cy="13.5" r="3.25" fill="currentColor" className="text-gold" />
    </svg>
  );
}

/** @deprecated Use ShunyaBodhaLogo */
export const MountainLogo = ShunyaBodhaLogo;

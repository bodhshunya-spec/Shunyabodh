import { ne } from "@/lib/i18n/ne";
import { cn } from "@/lib/utils";

type PublishGuidelinesProps = {
  variant?: "full" | "compact";
  className?: string;
};

export function PublishGuidelines({
  variant = "full",
  className,
}: PublishGuidelinesProps) {
  const g = ne.publishGuidelines;

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "rounded-xl border border-border/60 bg-muted/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground",
          className
        )}
      >
        <p className="font-medium text-foreground/90">{g.title}</p>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          {g.allowed.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
        <p className="mt-3 font-medium text-destructive/90">{g.removalWarning}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-muted/30 px-4 py-4 text-sm leading-relaxed",
        className
      )}
    >
      <p className="font-heading text-foreground">{g.title}</p>
      <p className="mt-2 text-muted-foreground">{g.intro}</p>

      <div className="mt-4 space-y-3">
        <div>
          <p className="text-xs font-medium tracking-wide text-foreground/90 uppercase">
            {g.allowedTitle}
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-4 text-muted-foreground">
            {g.allowed.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium tracking-wide text-foreground/90 uppercase">
            {g.notAllowedTitle}
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-4 text-muted-foreground">
            {g.notAllowed.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs font-medium text-destructive/90">
        {g.removalWarning}
      </p>
    </div>
  );
}

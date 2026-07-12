type FeedHeaderProps = {
  title: string;
  description: string;
};

export function FeedHeader({ title, description }: FeedHeaderProps) {
  return (
    <header className="mb-12 border-b border-border/50 pb-8">
      <div className="premium-accent-line mb-5" />
      <h1 className="font-heading text-3xl text-foreground sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
        {description}
      </p>
    </header>
  );
}

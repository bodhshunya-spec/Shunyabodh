type EmptyStateProps = {
  message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

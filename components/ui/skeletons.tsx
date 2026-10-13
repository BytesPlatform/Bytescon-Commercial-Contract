export function ListSkeleton() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading">
      <div className="h-7 w-64 rounded bg-surface-3" />
      <div className="mt-2 h-4 w-96 max-w-full rounded bg-surface-3" />
      <div className="mt-6 h-14 rounded-xl bg-surface-3" />
      <div className="mt-3 flex flex-col gap-2">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-14 rounded-lg bg-surface-3/70" />
        ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="h-16 bg-card border-b border-border flex items-center px-6 gap-4">
        <div className="h-5 w-40 bg-muted rounded-lg" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-card border border-border rounded-xl" />
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 h-64 bg-card border border-border rounded-xl" />
        <div className="h-64 bg-card border border-border rounded-xl" />
      </div>

      {/* Table skeleton */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="h-14 border-b border-border bg-muted/40" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-12 border-b border-border last:border-0 flex items-center px-6 gap-4">
            <div className="h-3 w-24 bg-muted rounded" />
            <div className="h-3 w-16 bg-muted rounded" />
            <div className="h-3 w-20 bg-muted rounded ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

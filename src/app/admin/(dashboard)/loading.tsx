import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-32" />

      {/* Filters skeleton */}
      <div className="flex flex-wrap items-end gap-3">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-52" />
        <Skeleton className="h-10 w-44" />
      </div>

      {/* Table skeleton */}
      <div className="space-y-3">
        <div className="grid grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, row) => (
          <div key={row} className="grid grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, col) => (
              <Skeleton key={col} className="h-5" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

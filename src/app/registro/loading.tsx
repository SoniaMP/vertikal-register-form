import { Skeleton } from "@/components/ui/skeleton";

export default function RegistroLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8 text-center">
        <Skeleton className="mx-auto h-9 w-64" />
        <Skeleton className="mx-auto mt-2 h-5 w-96" />
      </div>

      {/* Step indicator skeleton */}
      <div className="mb-8 flex items-center justify-between">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
            {i < 3 && <Skeleton className="mx-2 mb-6 h-0.5 flex-1" />}
          </div>
        ))}
      </div>

      {/* Form fields skeleton */}
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldSkeleton />
          <FieldSkeleton />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldSkeleton />
          <FieldSkeleton />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldSkeleton />
          <FieldSkeleton />
        </div>
        <FieldSkeleton />
        <div className="flex justify-end pt-4">
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </div>
  );
}

function FieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

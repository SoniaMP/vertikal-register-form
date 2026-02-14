import { Skeleton } from "@/components/ui/skeleton";

export default function CursosLoading() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {[1, 2, 3, 4].map((i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border p-6 shadow-sm">
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  );
}

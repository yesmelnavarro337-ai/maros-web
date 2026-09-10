import { Skeleton } from "@/components/ui/skeleton";

export default function CatalogoLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Skeleton className="h-4 w-32 mb-3" />
      <Skeleton className="h-9 w-48 mb-2" />
      <Skeleton className="h-4 w-72 mb-6" />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="hidden lg:flex flex-col gap-4 w-56 shrink-0">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
        <div className="flex-1">
          <Skeleton className="h-9 w-64 mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
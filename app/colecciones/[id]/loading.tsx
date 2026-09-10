import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Skeleton className="h-4 w-40 mb-6" />
      <Skeleton className="h-48 w-full rounded-2xl mb-10" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    </div>
  );
}
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-9 w-32 mb-2" />
      <Skeleton className="h-4 w-72 mb-6" />
      <div className="flex gap-2 mb-8">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8 w-20 rounded-full" />)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="aspect-[16/10] rounded-xl mb-3" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
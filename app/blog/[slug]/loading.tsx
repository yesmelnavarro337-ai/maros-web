import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPostLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Skeleton className="h-4 w-48 mb-4" />
      <Skeleton className="h-6 w-24 mb-3" />
      <Skeleton className="h-10 w-full mb-2" />
      <Skeleton className="h-4 w-40 mb-6" />
      <Skeleton className="aspect-[16/9] rounded-2xl mb-6" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
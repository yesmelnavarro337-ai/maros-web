import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Skeleton className="h-4 w-56 mb-4" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Misma proporción y alto que la galería real para evitar el salto
            de maquetado cuando termina la carga. */}
        <Skeleton className="w-full aspect-[3/4] max-h-[min(650px,calc(100vh-9rem))] rounded-2xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
    </div>
  );
}
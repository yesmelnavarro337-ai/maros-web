import { Skeleton } from "@/components/ui/skeleton";
import { ApiLoadingState, ServerReconnectingBanner } from "@/components/shared/ApiLoadingState";

export default function ProductDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Banner discreto si tarda más de 5 segundos */}
      <ServerReconnectingBanner secondsThreshold={5} />

      <Skeleton className="h-4 w-56 mb-4" />

      {/* Estado progresivo de carga para el producto */}
      <ApiLoadingState initialMessage="Cargando detalles de la prenda..." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mt-6">
        {/* Misma proporción y alto que la galería real para evitar saltos */}
        <Skeleton className="w-full aspect-[3/4] max-h-[min(650px,calc(100vh-9rem))] rounded-2xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-24 rounded" />
          <Skeleton className="h-10 w-3/4 rounded" />
          <Skeleton className="h-7 w-32 rounded" />
          <Skeleton className="h-16 w-full rounded" />
          <Skeleton className="h-9 w-full rounded" />
          <Skeleton className="h-9 w-full rounded" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
import { Skeleton } from "@/components/ui/skeleton";
import { ApiLoadingState, ServerReconnectingBanner } from "@/components/shared/ApiLoadingState";

export default function CatalogoLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Banner discreto si tarda más de 5 segundos */}
      <ServerReconnectingBanner secondsThreshold={5} />

      <Skeleton className="h-4 w-32 mb-3" />
      <Skeleton className="h-9 w-48 mb-2" />
      <Skeleton className="h-4 w-72 mb-6" />

      {/* Estado progresivo de carga (0-3s, 3-8s, 8s+ Cold Start) */}
      <ApiLoadingState initialMessage="Cargando catálogo..." />

      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        <div className="hidden lg:flex flex-col gap-4 w-56 shrink-0">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
        <div className="flex-1">
          <Skeleton className="h-9 w-64 mb-6 rounded-lg" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 rounded-2xl border border-brand-border/40 p-3 bg-card/60">
                <Skeleton className="w-full aspect-[4/5] rounded-xl" />
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-4 w-1/3 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
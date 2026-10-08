"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles, Server, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApiLoadingStateProps {
  initialMessage?: string;
  className?: string;
  compact?: boolean;
}

export function ApiLoadingState({
  initialMessage = "Cargando catálogo...",
  className,
  compact = false,
}: ApiLoadingStateProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 1. Fase 0 a 3 segundos: Loader estándar
  if (seconds < 3) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center text-center py-6 px-4 animate-fade-in-soft",
          className
        )}
      >
        <div className="relative flex items-center justify-center mb-3">
          <Loader2 className="h-6 w-6 text-brand-gold animate-spin" />
        </div>
        <p className="font-heading text-sm sm:text-base text-foreground font-medium transition-all duration-500">
          {initialMessage}
        </p>
      </div>
    );
  }

  // 2. Fase 3 a 8 segundos: Mensaje de preparación suave
  if (seconds < 8) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center text-center py-6 px-4 animate-fade-in-soft",
          className
        )}
      >
        <div className="relative flex items-center justify-center mb-3">
          <span className="relative flex h-7 w-7 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-gold/25 opacity-75" />
            <Loader2 className="h-6 w-6 text-brand-gold animate-spin" />
          </span>
        </div>
        <p className="font-heading text-base sm:text-lg text-foreground font-medium transition-all duration-500">
          Preparando la tienda para ti...
        </p>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
          Organizando nuestras pijamas hechas a mano con amor.
        </p>
      </div>
    );
  }

  // 3. Fase 8 segundos en adelante: Cold Start detectado -> Tarjeta elegante Maro's Pijamas
  return (
    <div
      className={cn(
        "w-full max-w-xl mx-auto rounded-2xl border border-brand-border bg-[#FBF9F4] p-6 sm:p-8 shadow-sm text-center animate-fade-in-soft my-4 relative overflow-hidden",
        className
      )}
    >
      {/* Detalle decorativo sutil */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-warm-beige via-brand-gold to-brand-warm-beige" />

      <div className="mx-auto h-12 w-12 rounded-full bg-brand-gold/15 flex items-center justify-center mb-4 text-brand-gold">
        <Server className="h-6 w-6 animate-pulse" />
      </div>

      <h3 className="font-heading text-lg sm:text-xl text-[#34351F] font-semibold tracking-tight">
        Estamos despertando nuestro servidor...
      </h3>

      <p className="font-sans text-xs sm:text-sm text-stone-600 mt-2.5 leading-relaxed max-w-md mx-auto">
        Como cuidamos cada detalle, nuestro sistema seguro se está inicializando. Esto tomará solo unos segundos más. ¡Gracias por tu paciencia!
      </p>

      {/* Barra de progreso sutil indeterminada en tonos dorados/crema */}
      <div className="mt-6 w-full max-w-xs mx-auto">
        <div className="h-1.5 w-full bg-brand-border/60 rounded-full overflow-hidden relative">
          <div className="h-full w-2/5 rounded-full bg-gradient-to-r from-brand-warm-beige via-brand-gold to-brand-olive shimmer-effect animate-[shimmer_1.8s_infinite_ease-in-out]" />
        </div>
        <div className="flex items-center justify-between mt-2 text-[10px] text-stone-400">
          <span className="inline-flex items-center gap-1 text-brand-gold font-medium">
            <Sparkles className="h-2.5 w-2.5" />
            Conectando ({seconds}s)
          </span>
          <span>Maro&apos;s Cloud Server</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Banner informativo discreto si la llamada a la API supera los 5 segundos
 */
export function ServerReconnectingBanner({
  secondsThreshold = 5,
  className,
}: {
  secondsThreshold?: number;
  className?: string;
}) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (seconds < secondsThreshold) return null;

  return (
    <aside
      aria-label="Aviso de reconexión del servidor"
      className={cn(
        "w-full bg-[#FAF7F0] border border-[#E6DFC9] text-[#34351F] px-4 py-2.5 rounded-xl shadow-2xs mb-5 flex items-center justify-between gap-3 text-xs animate-fade-in-soft",
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-gold" />
        </span>
        <span className="font-medium text-stone-700">
          El servidor se está reconectando tras un momento de reposo ({seconds}s transcurridos). Por favor espera un instante.
        </span>
      </div>
      <Coffee className="h-4 w-4 text-brand-gold shrink-0 hidden sm:block" />
    </aside>
  );
}

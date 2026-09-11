"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { CatalogSearchParams } from "../types";

interface PriceRangeFilterProps {
  min: number;
  max: number;
  currentMin?: string;
  currentMax?: string;
  preserve?: CatalogSearchParams;
}

function formatCOP(value: number): string {
  return `$${Math.round(value).toLocaleString("es-CO")}`;
}

export function PriceRangeFilter({ min, max, currentMin, currentMax, preserve }: PriceRangeFilterProps) {
  const router = useRouter();

  const parsedMin = Number(currentMin ? Number(currentMin) : NaN);
  const parsedMax = Number(currentMax ? Number(currentMax) : NaN);
  const [low, setLow] = useState(!Number.isNaN(parsedMin) ? Math.max(min, parsedMin) : min);
  const [high, setHigh] = useState(!Number.isNaN(parsedMax) ? Math.min(max, parsedMax) : max);
  const [draft, setDraft] = useState<{ low: number; high: number } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const syncUrl = useCallback(
    (nextLow: number, nextHigh: number) => {
      const params = new URLSearchParams();
      Object.entries(preserve ?? {}).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      const atMin = nextLow <= min;
      const atMax = nextHigh >= max;
      if (!atMin) params.set("precioMin", String(nextLow));
      if (!atMax) params.set("precioMax", String(nextHigh));
      const query = params.toString();
      router.push(query ? `/catalogo?${query}` : "/catalogo", { scroll: false });
    },
    [preserve, min, max, router]
  );

  function scheduleSync(nextLow: number, nextHigh: number) {
    setDraft({ low: nextLow, high: nextHigh });
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDraft(null);
      syncUrl(nextLow, nextHigh);
    }, 250);
  }

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const lowPct = max > min ? ((low - min) / (max - min)) * 100 : 0;
  const highPct = max > min ? ((high - min) / (max - min)) * 100 : 100;

  const range = max - min;
  const displayLow = draft?.low ?? low;
  const displayHigh = draft?.high ?? high;

  return (
    <div className="select-none">
      <div className="relative h-6">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1.5 rounded-full bg-secondary">
          <div
            className="absolute h-1.5 rounded-full bg-primary"
            style={{ left: `${lowPct}%`, right: `${100 - highPct}%` }}
          />
        </div>

        <input
          type="range"
          min={min}
          max={max}
          value={low}
          step={Math.max(1, Math.round(range / 100))}
          aria-label="Precio mínimo"
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), high);
            setLow(v);
            scheduleSync(v, high);
          }}
          className="absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-foreground [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:shadow"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={high}
          step={Math.max(1, Math.round(range / 100))}
          aria-label="Precio máximo"
          onChange={(e) => {
            const v = Math.max(Number(e.target.value), low);
            setHigh(v);
            scheduleSync(low, v);
          }}
          className="absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-foreground [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:shadow"
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatCOP(displayLow)}</span>
        <span>{formatCOP(displayHigh)}</span>
      </div>
    </div>
  );
}
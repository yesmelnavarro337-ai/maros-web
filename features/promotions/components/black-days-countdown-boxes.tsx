"use client";

import { useEffect, useState } from "react";
import {
  getBlackDaysCountdown,
  formatCountdownPart,
  BLACK_DAYS_START_MS,
  type BlackDaysCountdown,
} from "@/lib/promotions/black-days";

interface BlackDaysCountdownBoxesProps {
  className?: string;
  showRangeLabel?: boolean;
}

export function BlackDaysCountdownBoxes({
  className = "",
  showRangeLabel = true,
}: BlackDaysCountdownBoxesProps) {
  // Estado mounted para garantizar que SSR y primer render del cliente coincidan exactamente
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState<BlackDaysCountdown>(() =>
    getBlackDaysCountdown(BLACK_DAYS_START_MS)
  );

  useEffect(() => {
    setMounted(true);
    const update = () => {
      setCountdown(getBlackDaysCountdown(Date.now()));
    };

    update();
    const intervalId = window.setInterval(update, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  // Antes de montar en el cliente se usa el snapshot estático para evitar Hydration mismatch
  const current = mounted ? countdown : getBlackDaysCountdown(BLACK_DAYS_START_MS);

  const units = [
    { label: "DÍAS", value: current.days },
    { label: "HORAS", value: current.hours },
    { label: "MIN", value: current.minutes },
    { label: "SEG", value: current.seconds },
  ];

  return (
    <div className={`flex items-center gap-1 sm:gap-2 shrink-0 ${className}`}>
      {/* 4 Cajas oscuras translúcidas compactas y adaptables */}
      <div className="flex items-center gap-0.5 sm:gap-1.5">
        {units.map((u) => (
          <div
            key={u.label}
            className="bg-[#241E06]/88 border border-amber-400/30 rounded-md sm:rounded-lg px-1 sm:px-1.5 py-0.5 sm:py-1 min-w-[24px] sm:min-w-[32px] lg:min-w-[36px] text-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]"
          >
            <span
              suppressHydrationWarning
              className="block font-bold text-[10px] sm:text-xs lg:text-[13px] text-white tabular-nums leading-none tracking-tight"
            >
              {formatCountdownPart(u.value)}
            </span>
            <span className="block text-[6px] sm:text-[7.5px] font-bold text-amber-200/95 tracking-wider uppercase mt-0.5 leading-none">
              {u.label}
            </span>
          </div>
        ))}
      </div>

      {/* Rango de fechas: visible solo desde desktop (lg) para no saturar tablets o móviles */}
      {showRangeLabel && (
        <span className="hidden lg:inline-block font-bold text-[10px] sm:text-[11px] lg:text-xs text-white/95 tracking-wide whitespace-nowrap ml-1.5 sm:ml-2.5">
          27 — 29 NOV
        </span>
      )}
    </div>
  );
}

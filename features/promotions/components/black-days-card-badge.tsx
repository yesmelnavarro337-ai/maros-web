"use client";

import { useBlackDaysCountdown } from "./black-days-countdown-provider";
import { isPromoActive } from "@/features/product-detail/utils/price-helpers";

interface BlackDaysCardBadgeProps {
  className?: string;
}

/**
 * Badge superior izquierdo para tarjetas de producto y galerías durante Black Days.
 * Muestra una cápsula oscura con borde dorado sutil, destello ✦, texto BLACK DAYS,
 * divisor y 5% OFF, decorado con rayos dorados en la esquina superior izquierda.
 */
export function BlackDaysCardBadge({ className = "" }: BlackDaysCardBadgeProps) {
  let isActive = false;
  try {
    const countdown = useBlackDaysCountdown();
    isActive = countdown.isActive;
  } catch {
    isActive = isPromoActive();
  }

  if (!isActive) return null;

  return (
    <div className={`relative inline-flex items-center select-none ${className}`}>
      {/* Pequeños rayos / acentos en la esquina superior izquierda inspirados en la identidad Maro's */}
      <svg
        className="absolute -top-1.5 -left-1.5 w-5 h-5 text-[#E7CE6D] pointer-events-none drop-shadow-xs z-10"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <line x1="2" y1="8" x2="6" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="4" y1="4" x2="7" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {/* Píldora oscura con borde dorado sutil alineado a los tokens de la marca */}
      <div className="relative inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-[#262413]/92 backdrop-blur-xs border border-[#A38A3E]/55 px-2 sm:px-2.5 py-0.5 sm:py-1 shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
        <span className="text-[#E7CE6D] text-[9.5px] sm:text-[11px] leading-none shrink-0" aria-hidden="true">
          ✦
        </span>
        <span className="font-heading font-black text-white text-[8px] sm:text-[9.5px] tracking-wider uppercase leading-none shrink-0">
          BLACK DAYS
        </span>
        <span className="h-2.5 w-px bg-white/25 shrink-0" aria-hidden="true" />
        <span className="font-black text-[#F3DB7B] text-[8.5px] sm:text-[9.5px] tracking-tight leading-none whitespace-nowrap shrink-0">
          5% OFF
        </span>
      </div>
    </div>
  );
}

/**
 * Etiqueta 5% OFF inferior con divisor sutil, borde dorado y texto en tono dorado/ámbar oscuro
 * armonizado con los tokens del tema Maro's.
 */
export function BlackDaysPriceTag({ className = "" }: { className?: string }) {
  let isActive = false;
  try {
    const countdown = useBlackDaysCountdown();
    isActive = countdown.isActive;
  } catch {
    isActive = isPromoActive();
  }

  if (!isActive) return null;

  return (
    <div className={`flex items-center gap-1.5 shrink-0 select-none ${className}`}>
      <span className="h-3.5 w-px bg-border/80" aria-hidden="true" />
      <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-[#A38A3E]/60 bg-[#FAF8F4] dark:bg-[#34351F]/40 text-[#7A6424] dark:text-[#E7CE6D] text-[10px] sm:text-[10.5px] font-black tracking-tight whitespace-nowrap shadow-2xs">
        5% OFF
      </span>
    </div>
  );
}

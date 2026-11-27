"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { BlackDaysCountdownBoxes } from "./black-days-countdown-boxes";

export function BlackDaysTopBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      role="banner"
      aria-label="Promoción Black Days"
      className="relative w-full bg-[linear-gradient(90deg,#46370E_0%,#634F18_20%,#7C6420_50%,#634F18_80%,#46370E_100%)] text-white border-b border-[#382C0A]/40 shadow-xs select-none overflow-hidden"
    >
      {/* Destellos y halos dorados decorativos de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_15%_50%,rgba(255,223,128,0.35)_0%,transparent_45%),radial-gradient(circle_at_85%_50%,rgba(255,223,128,0.3)_0%,transparent_45%)]"
      />

      {/* Contenedor amplio (max-w-[1600px]) centrado y con balance simétrico entre extremos */}
      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 min-h-[44px] sm:h-[50px] py-1 sm:py-0 flex items-center justify-between gap-3 lg:gap-6 xl:gap-8 overflow-hidden">
        
        {/* GRUPO IZQUIERDO: Marca, badge y descuento 5% OFF */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-3.5 shrink-0">
          {/* Ilustración de regalo dorado (visible en pantallas grandes) */}
          <div className="hidden lg:flex relative w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 items-center justify-center shrink-0">
            <svg
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-xs"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="boxGrad" x1="4" y1="12" x2="32" y2="34" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F9E298" />
                  <stop offset="0.45" stopColor="#D9AA38" />
                  <stop offset="1" stopColor="#8A6715" />
                </linearGradient>
                <linearGradient id="lidGrad" x1="2" y1="8" x2="34" y2="15" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFF2B8" />
                  <stop offset="0.5" stopColor="#E0B644" />
                  <stop offset="1" stopColor="#A88120" />
                </linearGradient>
                <linearGradient id="ribbonGrad" x1="16" y1="8" x2="20" y2="34" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFDE0" />
                  <stop offset="0.3" stopColor="#F4D068" />
                  <stop offset="0.8" stopColor="#B3861A" />
                  <stop offset="1" stopColor="#E2B743" />
                </linearGradient>
              </defs>
              {/* Destellitos dorados flotantes */}
              <path d="M7 6L8 3L9 6L12 7L9 8L8 11L7 8L4 7L7 6Z" fill="#FFEAA3" />
              <path d="M29 5L29.7 3L30.4 5L32.4 5.7L30.4 6.4L29.7 8.4L29 6.4L27 5.7L29 5Z" fill="#FFEAA3" />
              <path d="M31 24L31.5 22.5L32 24L33.5 24.5L32 25L31.5 26.5L31 25L29.5 24.5L31 24Z" fill="#FFEAA3" />
              {/* Cuerpo de la caja */}
              <rect x="6" y="14" width="24" height="18" rx="2.5" fill="url(#boxGrad)" stroke="#74530E" strokeWidth="0.75" />
              {/* Tapa de la caja */}
              <rect x="4" y="10" width="28" height="6.5" rx="1.5" fill="url(#lidGrad)" stroke="#74530E" strokeWidth="0.75" />
              {/* Cinta vertical */}
              <rect x="15.5" y="10" width="5" height="22" fill="url(#ribbonGrad)" />
              {/* Cinta horizontal en la tapa */}
              <rect x="4" y="12" width="28" height="2.5" fill="url(#ribbonGrad)" opacity="0.9" />
              {/* Moño / Lazos dorados superiores */}
              <path
                d="M18 10.5C15 6 9.5 6 12 10.5C13.5 11.2 16.5 11 18 10.5Z"
                fill="url(#ribbonGrad)"
                stroke="#6B4D0B"
                strokeWidth="0.5"
              />
              <path
                d="M18 10.5C21 6 26.5 6 24 10.5C22.5 11.2 19.5 11 18 10.5Z"
                fill="url(#ribbonGrad)"
                stroke="#6B4D0B"
                strokeWidth="0.5"
              />
              <circle cx="18" cy="10.5" r="2" fill="#FFF4C2" stroke="#876011" strokeWidth="0.5" />
            </svg>
          </div>

          <span className="font-heading font-black text-white text-[11px] sm:text-xs md:text-sm tracking-wider uppercase shrink-0">
            BLACK DAYS
          </span>

          <span className="hidden sm:inline-flex border border-amber-300/80 bg-amber-400/15 text-amber-200 text-[8px] sm:text-[9px] font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full uppercase whitespace-nowrap shadow-xs shrink-0">
            OFERTA ESPECIAL
          </span>

          {/* Divisor vertical */}
          <div className="hidden sm:block h-4 sm:h-5 w-px bg-white/20 shrink-0" aria-hidden="true" />

          {/* 5% OFF con texto secundario */}
          <div className="flex items-center gap-1 shrink-0">
            <div className="flex items-baseline">
              <span className="font-black text-base sm:text-lg lg:text-xl text-white tracking-tight leading-none">
                5%
              </span>
              <span className="font-bold text-[9px] sm:text-[10px] lg:text-xs text-white uppercase tracking-wider ml-0.5 leading-none">
                OFF
              </span>
            </div>
            {/* Texto secundario (oculto en pantallas pequeñas) */}
            <div className="hidden md:flex flex-col text-[8px] lg:text-[9px] leading-[1.05] text-white/90 font-medium text-left ml-0.5 shrink-0">
              <span>En productos</span>
              <span>seleccionados</span>
            </div>
          </div>
        </div>

        {/* GRUPO CENTRAL: 4 Cajas del contador + 27 — 29 NOV + Divisor + Frase cursiva */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-3.5 shrink-0">
          <BlackDaysCountdownBoxes />

          {/* Divisor sutil entre fechas y frase cursiva */}
          <div className="hidden xl:block h-4 sm:h-5 w-px bg-white/20 shrink-0" aria-hidden="true" />

          {/* Frase cursiva elegante: visible en escritorio (xl+) para equilibrar el centro */}
          <span className="hidden xl:inline text-xs lg:text-[13px] text-amber-100/90 italic font-serif tracking-normal shrink-0">
            No dejes pasar esta oportunidad ♡
          </span>
        </div>

        {/* GRUPO DERECHO: CTA "VER PRODUCTOS →" y botón de cerrar */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <Link
            href="/catalogo"
            className="bg-white hover:bg-amber-50 text-[#544315] active:scale-95 transition-all duration-200 text-[10px] sm:text-[11px] md:text-xs font-bold px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full shadow-xs hover:shadow-md flex items-center gap-1 shrink-0 whitespace-nowrap group"
          >
            <span>VER PRODUCTOS</span>
            <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 stroke-[2.5] transition-transform group-hover:translate-x-0.5" />
          </Link>

          {/* Botón de cerrar con delimitador y margen para no quedar encajado */}
          <div className="border-l border-white/20 pl-1.5 sm:pl-2.5 ml-0.5 sm:ml-1 flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              aria-label="Cerrar banner de Black Days"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

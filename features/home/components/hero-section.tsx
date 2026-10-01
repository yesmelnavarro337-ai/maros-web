"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HeroContent, HeroSlide } from "../types";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

export function HeroSection({ hero }: { hero: HeroContent }) {
  const slides: HeroSlide[] =
    hero.slides && hero.slides.length > 0
      ? hero.slides
      : [
          {
            id: "main-slide",
            badgeLabel: hero.badgeLabel || "COLECCIÓN ESPECIAL",
            badgeSeason: hero.badgeSeason,
            title: hero.title,
            subtitle: hero.subtitle,
            image: hero.image,
            overlayNote: hero.overlayNote || "Juntos en pijama ♡",
            primaryCta: hero.primaryCta,
            secondaryCta: hero.secondaryCta,
          },
        ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const current = slides[currentIndex] || slides[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative w-full overflow-hidden bg-brand-dark border-b border-brand-border/40">
      {/* Contenedor principal del Hero con imagen de fondo completa (Full Bleed) */}
      <div className="relative min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] xl:min-h-[700px] w-full flex items-center">
        
        {/* FOTOGRAFÍA DE FONDO COMPLETA */}
        <div className="absolute inset-0 w-full h-full z-0">
          {current.image ? (
            <Image
              src={cloudinaryUrl(current.image)}
              alt={current.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_35%] lg:object-[65%_center] transition-all duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#EFE8D8] via-[#FAF8F4] to-[#D8CEBA]" />
          )}

          {/* DEGRADADO DE SOMBRA DESDE LA IZQUIERDA PARA MÁXIMA LEGIBILIDAD */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 sm:via-black/40 to-transparent z-[1]" />
        </div>

        {/* NOTA MANUSCRITA FLOTANTE (Superior Derecha) */}
        <div className="absolute top-5 right-5 sm:top-8 sm:right-10 lg:top-12 lg:right-14 z-10 pointer-events-none">
          <span className="font-heading italic text-base sm:text-2xl lg:text-3xl text-white/95 font-medium tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
            {current.overlayNote || "Juntos en pijama ♡"}
          </span>
        </div>

        {/* CONTENIDO ALINEADO A LA IZQUIERDA DIRECTO SOBRE EL DEGRADADO */}
        <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-10 sm:py-16 lg:py-20 flex items-center">
          <div className="w-full max-w-xl text-left">
            
            {/* Tag / Etiqueta de Colección */}
            <div className="mb-3 sm:mb-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-[#EFE8D8] text-[10px] sm:text-xs font-semibold tracking-[0.18em] uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B6AE3A]" />
                {current.badgeSeason ? `Colección Especial` : current.badgeLabel || "Colección Especial"}
              </span>
            </div>

            {/* Título Principal */}
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white font-normal leading-[1.1] sm:leading-[1.08] tracking-tight mb-3 sm:mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
              {current.title}
            </h1>

            {/* Subtítulo */}
            <p className="font-sans text-xs sm:text-sm lg:text-base text-white/90 leading-relaxed mb-6 sm:mb-8 max-w-lg drop-shadow-[0_1px_6px_rgba(0,0,0,0.3)]">
              {current.subtitle}
            </p>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Button
                size="lg"
                className="rounded-full px-7 sm:px-8 py-3.5 bg-brand-gold hover:bg-[#8C7633] text-white font-medium text-xs sm:text-sm transition-all duration-300 shadow-md hover:shadow-lg group w-full sm:w-auto justify-center"
                asChild
              >
                <Link href={current.primaryCta.href}>
                  <span>{current.primaryCta.label}</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-7 sm:px-8 py-3.5 border-white/40 hover:border-white bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm backdrop-blur-xs transition-all duration-300 shadow-none w-full sm:w-auto justify-center"
                asChild
              >
                <Link href={current.secondaryCta.href}>
                  <span>{current.secondaryCta.label}</span>
                </Link>
              </Button>
            </div>

            {/* Controles del Slider */}
            <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono text-white/80">
              <span className="font-semibold text-white tracking-widest text-[11px] sm:text-xs">
                {String(currentIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  aria-label="Campaña anterior"
                  className="h-8 w-8 rounded-full border border-white/30 bg-black/25 backdrop-blur-xs flex items-center justify-center hover:bg-white/20 hover:border-white text-white transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Siguiente campaña"
                  className="h-8 w-8 rounded-full border border-white/30 bg-black/25 backdrop-blur-xs flex items-center justify-center hover:bg-white/20 hover:border-white text-white transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {slides.length > 1 && (
                <div className="flex items-center gap-1 ml-2">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Ir al slide ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentIndex ? "w-6 bg-brand-gold" : "w-1.5 bg-white/40 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
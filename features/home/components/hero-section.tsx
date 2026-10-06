"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HeroContent, HeroSlide } from "../types";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

const MOBILE_CONTROLS_TIMEOUT_MS = 3500;

export function HeroSection({ hero }: { hero: HeroContent }) {
  const slides: HeroSlide[] =
    hero.slides && hero.slides.length > 0
      ? hero.slides
      : [
          {
            id: "main-slide",
            showOverlayText: true,
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

  // Los slides de temporada (1) y personalización (2) llevan overlay de texto;
  // a partir del tercer slide (imágenes adicionales) solo se ve la fotografía.
  const showOverlayText = current.showOverlayText !== false;
  const hasMultipleSlides = slides.length > 1;

  // Visibilidad de las flechas en móvil: se revelan con un tap sobre la imagen
  // y se ocultan solas tras unos segundos sin interacción. El nonce reinicia el
  // temporizador cada vez que el usuario interactúa (tap o cambio de slide).
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [controlsNonce, setControlsNonce] = useState(0);

  const revealControls = () => {
    setShowMobileControls(true);
    setControlsNonce((nonce) => nonce + 1);
  };

  useEffect(() => {
    if (!showMobileControls) return;
    const timer = setTimeout(() => {
      setShowMobileControls(false);
    }, MOBILE_CONTROLS_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [showMobileControls, controlsNonce]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita re-disparar el tap de la imagen
    revealControls(); // Reinicia el autocierre
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    revealControls();
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative w-full overflow-hidden bg-brand-dark border-b border-brand-border/40">
      {/* Contenedor principal del Hero con imagen de fondo completa (Full Bleed).
          Altura fluida por viewport para que la fotografía respire en móvil.
          `group` habilita el hover de escritorio y el tap revela las flechas en móvil. */}
      <div
        className="group relative h-[60vh] min-h-[420px] sm:h-[70vh] md:h-[80vh] w-full flex items-center"
        onClick={revealControls}
      >

        {/* FOTOGRAFÍA DE FONDO COMPLETA */}
        <div className="absolute inset-0 w-full h-full z-0">
          {current.image ? (
            <Image
              src={cloudinaryUrl(current.image)}
              alt={current.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center transform-gpu transition-all duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-warm-beige via-brand-ivory to-brand-border" />
          )}

          {/* DEGRADADO DE SOMBRA DESDE LA IZQUIERDA: solo cuando hay texto que leer */}
          {showOverlayText && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 sm:via-black/40 to-transparent z-[1]" />
          )}
        </div>

        {/* FLECHAS DE NAVEGACIÓN LATERALES
            Escritorio: ocultas por defecto, aparecen al hacer hover sobre el slider.
            Móvil: ocultas por defecto, aparecen al tocar la imagen y se ocultan
            solas tras unos segundos sin interacción. */}
        {hasMultipleSlides && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Campaña anterior"
              className={`absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-white/80 hover:bg-white text-brand-dark shadow-md backdrop-blur-xs flex items-center justify-center transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 ${
                showMobileControls
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none md:pointer-events-auto"
              }`}
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Siguiente campaña"
              className={`absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-white/80 hover:bg-white text-brand-dark shadow-md backdrop-blur-xs flex items-center justify-center transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 ${
                showMobileControls
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none md:pointer-events-auto"
              }`}
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </>
        )}

        {showOverlayText && (
          <>
            {/* NOTA MANUSCRITA FLOTANTE (Superior Derecha) */}
            <div className="absolute top-4 right-4 sm:top-8 sm:right-10 lg:top-12 lg:right-14 z-10 pointer-events-none">
              <span className="font-heading italic text-sm sm:text-2xl lg:text-3xl text-white/95 font-medium tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
                {current.overlayNote || "Juntos en pijama ♡"}
              </span>
            </div>

            {/* CONTENIDO ALINEADO A LA IZQUIERDA DIRECTO SOBRE EL DEGRADADO */}
            <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-16 lg:py-20 flex items-center">
              <div className="w-full max-w-xl text-left">

                {/* Tag / Etiqueta de Colección */}
                <div className="mb-1 sm:mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-brand-warm-beige text-[10px] sm:text-xs font-semibold tracking-[0.18em] uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {current.badgeSeason ? `Colección Especial` : current.badgeLabel || "Colección Especial"}
                  </span>
                </div>

                {/* Título Principal: solo si el slide trae texto */}
                {current.title && (
                  <h1 className="font-heading text-2xl sm:text-4xl lg:text-5xl xl:text-6xl text-white font-normal leading-tight sm:leading-[1.08] tracking-tight mb-1 sm:mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
                    {current.title}
                  </h1>
                )}

                {/* Subtítulo: solo si el slide trae texto */}
                {current.subtitle && (
                  <p className="font-sans text-xs sm:text-sm lg:text-base text-white/90 leading-relaxed mb-4 sm:mb-8 max-w-xs sm:max-w-lg line-clamp-3 drop-shadow-[0_1px_6px_rgba(0,0,0,0.3)]">
                    {current.subtitle}
                  </p>
                )}

                {/* Botones de Acción: ocultos por completo en móvil para no tapar
                    la fotografía; visibles desde sm en adelante */}
                {(current.primaryCta || current.secondaryCta) && (
                  <div className="hidden sm:flex flex-row items-center gap-3 sm:gap-4">
                    {current.primaryCta && (
                      <Button
                        size="lg"
                        className="rounded-full px-4 py-2.5 sm:px-8 sm:py-3.5 bg-brand-gold hover:bg-brand-gold/90 text-brand-gold-foreground font-medium text-xs sm:text-sm transition-all duration-300 shadow-md hover:shadow-lg group justify-center"
                        asChild
                      >
                        <Link href={current.primaryCta.href}>
                          <span>{current.primaryCta.label}</span>
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    )}

                    {current.secondaryCta && (
                      <Button
                        size="lg"
                        variant="outline"
                        className="rounded-full px-4 py-2.5 sm:px-8 sm:py-3.5 border-white/40 hover:border-white bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm backdrop-blur-xs transition-all duration-300 shadow-none justify-center"
                        asChild
                      >
                        <Link href={current.secondaryCta.href}>
                          <span>{current.secondaryCta.label}</span>
                        </Link>
                      </Button>
                    )}
                  </div>
                )}

              </div>
            </div>
          </>
        )}

        {/* PAGINACIÓN INFERIOR CENTRADA (dots): reemplaza al contador numérico.
            El dot activo se expande y se rellena con el dorado de marca. */}
        {hasMultipleSlides && (
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  revealControls();
                  setCurrentIndex(idx);
                }}
                aria-label={`Ir al slide ${idx + 1}`}
                className={`h-2 rounded-full shadow-sm transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-5 bg-brand-gold"
                    : "w-2 bg-white/40 border border-white/60 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

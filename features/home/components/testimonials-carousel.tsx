"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRatingDisplay } from "@/components/shared/star-rating-display";
import type { TestimonialPreview } from "@/features/testimonials/types";
import { Reveal } from "@/components/shared/reveal";

const AVATAR_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
];

export function TestimonialsCarousel({ testimonials }: { testimonials: TestimonialPreview[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const firstCard = el.firstElementChild as HTMLElement | null;
    if (firstCard && testimonials.length > 0) {
      const cardWidth = firstCard.getBoundingClientRect().width + 24;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.max(0, Math.min(testimonials.length - 1, index)));
    }
  }, [testimonials.length]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    updateScrollState();
    const handleResize = () => updateScrollState();
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [updateScrollState]);

  // Avanza o retrocede exactamente 1 testimonio a la vez
  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const firstCard = el.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : el.clientWidth * 0.85;
    const gap = 24; // gap-6
    const scrollAmount = cardWidth + gap;

    el.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollToIndex = (index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const firstCard = el.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : el.clientWidth * 0.85;
    const gap = 24;
    const targetLeft = index * (cardWidth + gap);

    el.scrollTo({
      left: targetLeft,
      behavior: "smooth",
    });
  };

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className="relative w-full group/testimonials">
      {/* Flecha Lateral Izquierda (en el extremo izquierdo del contenedor) */}
      <button
        type="button"
        onClick={() => handleScroll("left")}
        disabled={!canScrollLeft}
        aria-label="Testimonio anterior"
        className="absolute -left-3 sm:-left-5 lg:-left-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-stone-200/90 bg-white/95 dark:bg-card/95 backdrop-blur-md shadow-md hover:shadow-lg text-[#34351F] hover:bg-[#34351F] hover:text-white hover:border-[#34351F] transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none flex items-center justify-center active:scale-95 cursor-pointer touch-manipulation hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Flecha Lateral Derecha (en el extremo derecho del contenedor) */}
      <button
        type="button"
        onClick={() => handleScroll("right")}
        disabled={!canScrollRight}
        aria-label="Siguiente testimonio"
        className="absolute -right-3 sm:-right-5 lg:-right-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-stone-200/90 bg-white/95 dark:bg-card/95 backdrop-blur-md shadow-md hover:shadow-lg text-[#34351F] hover:bg-[#34351F] hover:text-white hover:border-[#34351F] transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none flex items-center justify-center active:scale-95 cursor-pointer touch-manipulation hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/*
        Carrusel deslizable:
        - En móviles: scroll lateral continuo con inercia gestual natural (snap-x snap-proximity y overscroll-x-contain).
          La distancia recorrida responde a la fuerza y velocidad de deslizamiento del usuario.
        - En desktop: pista deslizable de 3 columnas que avanza de 1 en 1 con las flechas laterales.
      */}
      <div
        ref={scrollContainerRef}
        onScroll={updateScrollState}
        className="flex overflow-x-auto scroll-smooth snap-x snap-proximity overscroll-x-contain scrollbar-none pb-4 pt-1 px-1 -mx-1 gap-4 sm:gap-6 touch-manipulation"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {testimonials.map((t, idx) => {
          const avatarUrl = AVATAR_FALLBACK_IMAGES[idx % AVATAR_FALLBACK_IMAGES.length];

          return (
            <div
              key={t.id}
              className="w-[85vw] sm:w-[380px] lg:w-[calc(33.333%-1rem)] shrink-0 snap-center sm:snap-start flex flex-col h-full"
            >
              <Reveal delay={idx * 60} className="h-full flex flex-col">
                <div className="bg-[#FDFBF7] rounded-3xl p-6 sm:p-7 border border-brand-border/60 shadow-2xs hover:shadow-xl hover:border-[#6B6832]/50 hover:-translate-y-2 transform-gpu transition-all duration-300 flex flex-col justify-between relative group h-full select-none">
                  {/* Rating y Quote Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <StarRatingDisplay rating={t.rating} size="sm" />
                    <Quote className="h-5 w-5 text-[#A38A3E]/40 group-hover:text-[#A38A3E] group-hover:rotate-12 transition-all duration-300" />
                  </div>

                  {/* Cita */}
                  <p className="font-serif text-sm sm:text-base text-[#34351F] italic leading-relaxed mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Autor del Testimonio */}
                  <div className="flex items-center gap-3 pt-4 border-t border-brand-border/40 mt-auto">
                    <Avatar className="h-11 w-11 ring-2 ring-[#A38A3E]/30 transition-transform duration-300 group-hover:scale-105">
                      <AvatarImage src={avatarUrl} alt={t.clientName} className="object-cover" />
                      <AvatarFallback className="bg-[#6B6832] text-white text-xs font-semibold">
                        {t.clientName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-[#34351F] leading-tight group-hover:text-primary transition-colors">
                        {t.clientName}
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5">Cliente verificada</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          );
        })}
      </div>

      {/* Indicadores de puntos inferiores para móvil y tablet */}
      {testimonials.length > 1 && (
        <div className="flex lg:hidden items-center justify-center gap-1.5 mt-3">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToIndex(idx)}
              aria-label={`Ver testimonio ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 touch-manipulation cursor-pointer ${
                idx === activeIndex
                  ? "w-6 bg-[#6B6832]"
                  : "w-1.5 bg-stone-300 hover:bg-stone-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

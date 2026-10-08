"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRatingDisplay } from "@/components/shared/star-rating-display";
import type { TestimonialPreview } from "@/features/testimonials/types";

const AVATAR_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
];

import { Reveal } from "@/components/shared/reveal";

export function TestimonialsCarousel({ testimonials }: { testimonials: TestimonialPreview[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full">
      {/* DESKTOP LAYOUT (>= 1024px): 3 Tarjetas en Grid elegante con controles */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6">
        {testimonials.slice(0, 3).map((t, idx) => {
          const avatarUrl = AVATAR_FALLBACK_IMAGES[idx % AVATAR_FALLBACK_IMAGES.length];
          return (
            <Reveal key={t.id} delay={idx * 90}>
              <div
                className="bg-[#FDFBF7] rounded-3xl p-7 border border-brand-border/60 shadow-2xs hover:shadow-xl hover:border-[#6B6832]/50 hover:-translate-y-2 transform-gpu transition-all duration-300 flex flex-col justify-between relative group h-full select-none"
              >
                <div className="flex items-center justify-between mb-4">
                  <StarRatingDisplay rating={t.rating} size="sm" />
                  <Quote className="h-5 w-5 text-[#A38A3E]/40 group-hover:text-[#A38A3E] group-hover:rotate-12 transition-all duration-300" />
                </div>

                <p className="font-serif text-sm text-[#34351F] italic leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-brand-border/40 mt-auto">
                  <Avatar className="h-11 w-11 ring-2 ring-[#A38A3E]/30 transition-transform duration-300 group-hover:scale-105">
                    <AvatarImage src={avatarUrl} alt={t.clientName} className="object-cover" />
                    <AvatarFallback className="bg-[#6B6832] text-white text-xs font-semibold">
                      {t.clientName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-[#34351F] leading-tight group-hover:text-primary transition-colors">{t.clientName}</p>
                    <p className="text-xs text-stone-500 mt-0.5">Cliente verificada</p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* MOBILE & TABLET LAYOUT (< 1024px): Carrusel Deslizable */}
      <div className="lg:hidden flex flex-col">
        {testimonials.length > 0 && (
          <div className="bg-[#FDFBF7] rounded-3xl p-6 sm:p-8 border border-brand-border/60 shadow-sm flex flex-col justify-between min-h-[220px]">
            <div className="flex items-center justify-between mb-4">
              <StarRatingDisplay rating={testimonials[currentIndex].rating} size="sm" />
              <Quote className="h-5 w-5 text-[#A38A3E]/50" />
            </div>

            <p className="font-serif text-sm sm:text-base text-[#34351F] italic leading-relaxed mb-6">
              &ldquo;{testimonials[currentIndex].quote}&rdquo;
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-brand-border/40 mt-auto">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-[#A38A3E]/30">
                  <AvatarImage
                    src={AVATAR_FALLBACK_IMAGES[currentIndex % AVATAR_FALLBACK_IMAGES.length]}
                    alt={testimonials[currentIndex].clientName}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-[#6B6832] text-white text-xs font-semibold">
                    {testimonials[currentIndex].clientName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-[#34351F] leading-tight">
                    {testimonials[currentIndex].clientName}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">Cliente verificada</p>
                </div>
              </div>

              {/* Botones de navegación en móvil */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  aria-label="Testimonio anterior"
                  className="h-8 w-8 rounded-full border border-stone-300 bg-white flex items-center justify-center text-[#34351F] hover:bg-stone-100 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Siguiente testimonio"
                  className="h-8 w-8 rounded-full border border-stone-300 bg-white flex items-center justify-center text-[#34351F] hover:bg-stone-100 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Indicadores de puntos en móvil */}
        {testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-5">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Ver testimonio ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "w-5 bg-[#6B6832]" : "w-1.5 bg-stone-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

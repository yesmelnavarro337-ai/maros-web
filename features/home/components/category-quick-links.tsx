"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { CategoryQuickLink } from "../types";
import { cloudinaryUrl } from "@/lib/images/cloudinary";
import { Reveal } from "@/components/shared/reveal";

const FALLBACK_CATEGORY_IMAGES: Record<string, string> = {
  algodon: "https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?q=80&w=800&auto=format&fit=crop",
  algodón: "https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?q=80&w=800&auto=format&fit=crop",
  algod: "https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?q=80&w=800&auto=format&fit=crop",
  mujer: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
  hombre: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
  familia: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop",
  pareja: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop",
  parejas: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop",
  niñ: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=800&auto=format&fit=crop",
  niños: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=800&auto=format&fit=crop",
  bata: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=800&auto=format&fit=crop",
  batas: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=800&auto=format&fit=crop",
};

function resolveCategoryImage(label: string, customImage?: string): string {
  if (customImage && customImage.trim().length > 0) {
    return cloudinaryUrl(customImage);
  }
  const normalized = label.toLowerCase();
  for (const [key, fallbackUrl] of Object.entries(FALLBACK_CATEGORY_IMAGES)) {
    if (normalized.includes(key)) {
      return fallbackUrl;
    }
  }
  return "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop";
}

export function CategoryQuickLinks({ categories }: { categories: CategoryQuickLink[] }) {
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
    if (firstCard && categories.length > 0) {
      const cardWidth = firstCard.getBoundingClientRect().width + 16;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.max(0, Math.min(categories.length - 1, index)));
    }
  }, [categories.length]);

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

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const firstCard = el.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : el.clientWidth * 0.82;
    const gap = 16;
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
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : el.clientWidth * 0.82;
    const gap = 16;
    const targetLeft = index * (cardWidth + gap);

    el.scrollTo({
      left: targetLeft,
      behavior: "smooth",
    });
  };

  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full py-6 sm:py-10">
      {/* Encabezado Editorial con flechas ubicadas justo al lado de "Ver todas" */}
      <Reveal>
        <div className="flex items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-[#34351F] font-medium tracking-tight">
              Descubre nuestras <span className="italic font-normal">categorías</span>
            </h2>
            <p className="font-sans text-xs sm:text-sm text-stone-500 mt-1 sm:mt-1.5">
              Encuentra el estilo perfecto para cada momento.
            </p>
          </div>

          {/* Bloque con enlace "Ver todas" y flechas de navegación adyacentes */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            <Link
              href="/catalogo"
              className="group inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[#6B6832] hover:text-[#34351F] transition-colors active:scale-95 py-1 px-1.5"
            >
              <span>Ver todas</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>

            {/* Flechas de navegación integradas junto al texto */}
            <div className="flex items-center gap-1 sm:gap-1.5 border-l border-stone-200/90 pl-2 sm:pl-3">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                disabled={!canScrollLeft}
                aria-label="Categoría anterior"
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-stone-200/90 bg-white/95 backdrop-blur-xs flex items-center justify-center text-[#34351F] hover:bg-[#34351F] hover:text-white hover:border-[#34351F] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/95 disabled:hover:text-[#34351F] shadow-2xs active:scale-95 cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                disabled={!canScrollRight}
                aria-label="Siguiente categoría"
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-stone-200/90 bg-white/95 backdrop-blur-xs flex items-center justify-center text-[#34351F] hover:bg-[#34351F] hover:text-white hover:border-[#34351F] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/95 disabled:hover:text-[#34351F] shadow-2xs active:scale-95 cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Carrusel Deslizante con CSS Scroll Snap (snap-x snap-mandatory) para móviles */}
      <div
        ref={scrollContainerRef}
        onScroll={updateScrollState}
        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none pb-4 pt-1 px-1 -mx-1 gap-3.5 sm:gap-5 lg:gap-6 touch-manipulation"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((c, index) => {
          const imageUrl = resolveCategoryImage(c.label, c.image);

          return (
            <div
              key={c.id}
              className="w-[82vw] xs:w-[75vw] sm:w-[46vw] md:w-[31vw] lg:w-[calc(16.666%-1.1rem)] shrink-0 snap-start snap-always"
            >
              <Reveal delay={index * 50}>
                <Link
                  href={c.href}
                  className="group relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-100 shadow-xs border border-brand-border/40 transform-gpu transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#6B6832]/50 active:-translate-y-1 active:scale-[0.98] active:shadow-md block select-none"
                >
                  {/* Imagen Fotográfica con zoom suave al interactuar */}
                  <Image
                    src={imageUrl}
                    alt={`Pijamas categoría ${c.label}`}
                    fill
                    sizes="(max-width: 640px) 82vw, (max-width: 1024px) 33vw, 17vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110 group-active:scale-105"
                  />

                  {/* Sutil sombreado inferior para contraste */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-65 group-hover:opacity-45 transition-opacity" />

                  {/* Botón / Píldora de Categoría en la parte inferior */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl py-2 px-3 sm:px-3.5 flex items-center justify-between shadow-sm transition-all duration-300 group-hover:bg-[#34351F] group-hover:text-white group-active:bg-[#34351F] group-active:text-white group-hover:scale-[1.02] group-active:scale-[0.98]">
                    <span className="font-medium text-xs sm:text-sm text-[#34351F] group-hover:text-white group-active:text-white transition-colors truncate">
                      {c.label}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#A38A3E] group-hover:text-white group-active:text-white group-hover:translate-x-1 group-active:translate-x-1 transition-all shrink-0 ml-1" />
                  </div>
                </Link>
              </Reveal>
            </div>
          );
        })}
      </div>

      {/* Indicadores de puntos de navegación para pantallas móviles */}
      <div className="flex lg:hidden items-center justify-center gap-1.5 mt-2">
        {categories.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => scrollToIndex(idx)}
            aria-label={`Ir a categoría ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 touch-manipulation cursor-pointer ${
              idx === activeIndex
                ? "w-6 bg-[#6B6832]"
                : "w-1.5 bg-stone-300 hover:bg-stone-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/shared/product-card";
import { ProductQuickViewModal } from "@/features/catalog/components/product-quick-view-modal";
import { useQuickView } from "@/features/catalog/hooks/use-quick-view";
import type { RelatedProduct } from "../services/product-detail.service";
import { Reveal } from "@/components/shared/reveal";

export function RelatedProducts({ products }: { products: RelatedProduct[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const { isOpen, isLoading, previewProduct, fullProduct, openQuickView, closeQuickView } =
    useQuickView();

  const updateScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const firstCard = el.firstElementChild as HTMLElement | null;
    if (firstCard && products.length > 0) {
      const cardWidth = firstCard.getBoundingClientRect().width + 20;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.max(0, Math.min(products.length - 1, index)));
    }
  }, [products.length]);

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
    const gap = 20;
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
    const gap = 20;
    const targetLeft = index * (cardWidth + gap);

    el.scrollTo({
      left: targetLeft,
      behavior: "smooth",
    });
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="mt-16 w-full">
      {/* Encabezado con flechas de desplazamiento adyacentes al enlace */}
      <div className="flex items-end justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl text-foreground">
            También te pueden <span className="text-primary italic">interesar</span>
          </h2>
          <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-1.5">
            Prendas seleccionadas especialmente para complementar tu estilo.
          </p>
        </div>

        {/* Enlace y flechas de navegación ítem a ítem */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          <Link
            href="/catalogo"
            className="group inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[#6B6832] dark:text-[#A38A3E] hover:text-foreground transition-colors active:scale-95 py-1 px-1.5"
          >
            <span>Ver catálogo</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>

          <div className="flex items-center gap-1 sm:gap-1.5 border-l border-border/70 pl-2 sm:pl-3">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              aria-label="Producto anterior"
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-border/80 bg-background/95 backdrop-blur-xs flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-background/95 disabled:hover:text-foreground shadow-2xs active:scale-95 cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              aria-label="Siguiente producto"
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-border/80 bg-background/95 backdrop-blur-xs flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-background/95 disabled:hover:text-foreground shadow-2xs active:scale-95 cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Pista deslizable con soporte gestual táctil y snap de 1 en 1 en móvil */}
      <div
        ref={scrollContainerRef}
        onScroll={updateScrollState}
        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none pb-4 pt-1 px-1 -mx-1 gap-4 sm:gap-5 touch-manipulation"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((p, index) => (
          <div
            key={p.id}
            className="w-[82vw] xs:w-[76vw] sm:w-[46vw] md:w-[32vw] lg:w-[calc(25%-0.95rem)] shrink-0 snap-start snap-always flex flex-col h-full"
          >
            <Reveal delay={index * 50} className="h-full flex flex-col">
              <ProductCard product={p} onQuickView={openQuickView} />
            </Reveal>
          </div>
        ))}
      </div>

      {/* Indicadores de puntos de navegación para pantallas móviles */}
      {products.length > 1 && (
        <div className="flex lg:hidden items-center justify-center gap-1.5 mt-2">
          {products.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToIndex(idx)}
              aria-label={`Ir a producto recomendado ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 touch-manipulation cursor-pointer ${
                idx === activeIndex
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      )}

      <ProductQuickViewModal
        isOpen={isOpen}
        previewProduct={previewProduct}
        fullProduct={fullProduct}
        isLoading={isLoading}
        onClose={closeQuickView}
      />
    </section>
  );
}

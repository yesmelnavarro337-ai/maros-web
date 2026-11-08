"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, ImageOff, Sparkles } from "lucide-react";
import { WishlistButton } from "@/components/shared/wishlist-button";
import { Reveal } from "@/components/shared/reveal";
import { ProductQuickViewModal } from "@/features/catalog/components/product-quick-view-modal";
import { useQuickView } from "@/features/catalog/hooks/use-quick-view";
import type { ProductPreview } from "@/types/product";
import { cloudinaryUrl } from "@/lib/images/cloudinary";
import { calculateProductPriceDetails } from "@/features/product-detail/utils/price-helpers";

export function FeaturedProducts({ products }: { products: ProductPreview[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const { isOpen, isLoading, previewProduct, fullProduct, openQuickView, closeQuickView } =
    useQuickView();

  const displayProducts = products && products.length > 0 ? products.slice(0, 12) : [];

  const updateScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const firstCard = el.firstElementChild as HTMLElement | null;
    if (firstCard && displayProducts.length > 0) {
      const cardWidth = firstCard.getBoundingClientRect().width + 16;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.max(0, Math.min(displayProducts.length - 1, index)));
    }
  }, [displayProducts.length]);

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
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : el.clientWidth * 0.7;
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
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : el.clientWidth * 0.7;
    const gap = 16;
    const targetLeft = index * (cardWidth + gap);

    el.scrollTo({
      left: targetLeft,
      behavior: "smooth",
    });
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      {/* Encabezado Editorial con flechas de desplazamiento adyacentes */}
      <Reveal>
        <div className="flex items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-[#34351F] font-medium tracking-tight">
              Productos <span className="italic font-normal">destacados</span>
            </h2>
            <p className="font-sans text-xs sm:text-sm text-stone-500 mt-1 sm:mt-1.5">
              Favoritos de nuestras clientas.
            </p>
          </div>

          {/* Enlace al catálogo y flechas de navegación ítem a ítem */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            <Link
              href="/catalogo"
              className="group inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[#6B6832] hover:text-[#34351F] transition-colors active:scale-95 py-1 px-1.5"
            >
              <span>Ver catálogo</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>

            <div className="flex items-center gap-1 sm:gap-1.5 border-l border-stone-200/90 pl-2 sm:pl-3">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                disabled={!canScrollLeft}
                aria-label="Producto anterior"
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-stone-200/90 bg-white/95 backdrop-blur-xs flex items-center justify-center text-[#34351F] hover:bg-[#34351F] hover:text-white hover:border-[#34351F] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/95 disabled:hover:text-[#34351F] shadow-2xs active:scale-95 cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                disabled={!canScrollRight}
                aria-label="Siguiente producto"
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-stone-200/90 bg-white/95 backdrop-blur-xs flex items-center justify-center text-[#34351F] hover:bg-[#34351F] hover:text-white hover:border-[#34351F] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/95 disabled:hover:text-[#34351F] shadow-2xs active:scale-95 cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      {/*
        Vitrina Deslizante con soporte gestual táctil:
        - En móvil: bleed con -mx-4 px-4 y ancho w-[70vw] xs:w-[68vw] para que la card siguiente SIEMPRE asome claramente con su foto.
        - snap-x snap-mandatory para navegar exactamente de 1 en 1 producto por impulso.
        - Las cards permanecen al 100% de opacidad sin quedar atrapadas por observers individuales.
      */}
      <div
        ref={scrollContainerRef}
        onScroll={updateScrollState}
        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none pb-4 pt-1 px-4 -mx-4 sm:px-6 sm:-mx-6 lg:px-0 lg:mx-0 gap-3.5 sm:gap-5 lg:gap-6 touch-manipulation"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {displayProducts.map((product) => {
          const productImages = product.images ?? [];
          const secondImage = productImages.length > 1 ? productImages[1] : undefined;
          const soldOut = product.available === false;

          const priceDetails = calculateProductPriceDetails({
            basePrice: product.price,
            categoryName: product.categoryName,
            styleName: product.styleName,
          });

          return (
            <div
              key={product.id}
              className="w-[70vw] xs:w-[68vw] sm:w-[45vw] md:w-[32vw] lg:w-[calc(25%-1.125rem)] shrink-0 snap-start snap-always flex flex-col h-full transform-gpu transition-all duration-300"
            >
              <div className="group flex flex-col h-full bg-[#FDFBF7] rounded-2xl sm:rounded-3xl border border-brand-border/50 p-3 sm:p-4 shadow-2xs hover:shadow-xl hover:border-[#6B6832]/50 hover:-translate-y-1.5 active:scale-[0.98] transform-gpu transition-all duration-300 select-none">
                {/* Zona de Imagen con zoom e intercambio de vista */}
                <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden bg-stone-100 mb-3 sm:mb-4">
                  <Link href={`/productos/${product.slug}`} className="block w-full h-full">
                    {product.image ? (
                      <>
                        <Image
                          src={cloudinaryUrl(product.image)}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 70vw, (max-width: 1024px) 45vw, 25vw"
                          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 group-active:scale-105"
                        />
                        {secondImage && (
                          <Image
                            src={cloudinaryUrl(secondImage)}
                            alt={`${product.name} vista alternativa`}
                            fill
                            sizes="(max-width: 640px) 70vw, (max-width: 1024px) 45vw, 25vw"
                            className="object-cover object-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500"
                          />
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-stone-100">
                        <ImageOff className="h-6 w-6 text-stone-300" />
                      </div>
                    )}
                  </Link>

                  {/* Badges superiores: Agotado ó 5% OFF */}
                  {soldOut ? (
                    <span className="absolute top-2.5 left-2.5 z-10 rounded-full bg-foreground/90 text-background text-[10px] font-medium uppercase tracking-wide px-2.5 py-1 shadow-xs">
                      Agotado
                    </span>
                  ) : priceDetails.hasDiscount ? (
                    <span className="absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1 rounded-full bg-[#34351F] text-white text-[9px] font-semibold tracking-wide px-2 py-1 shadow-xs max-w-[calc(100%-3rem)] animate-[pulse_3s_ease-in-out_infinite]">
                      <Sparkles className="h-3 w-3 shrink-0 text-[#B6AE3A]" />
                      5% OFF
                    </span>
                  ) : null}

                  {/* Botón de Favoritos flotante */}
                  <WishlistButton
                    className="absolute top-2.5 right-2.5 z-10 transition-transform duration-200 active:scale-125"
                    item={{
                      id: product.id,
                      type: "product",
                      name: product.name,
                      image: product.image,
                      slug: `/productos/${product.slug}`,
                      price: priceDetails.finalPrice,
                    }}
                  />

                  {/* Botón "Elegir": abre la vista previa rápida sin navegar */}
                  <button
                    type="button"
                    className="absolute bottom-2.5 right-2.5 z-10 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-200 opacity-100 pointer-events-auto sm:opacity-0 sm:pointer-events-none sm:group-hover:opacity-100 sm:group-hover:pointer-events-auto"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openQuickView(product);
                    }}
                    aria-label={`Elegir ${product.name}`}
                  >
                    Elegir
                  </button>
                </div>

                {/* Datos del Producto */}
                <div className="mt-auto">
                  <h3 className="font-heading text-xs sm:text-sm lg:text-base text-[#34351F] font-medium leading-snug truncate group-hover:text-[#6B6832] transition-colors">
                    <Link href={`/productos/${product.slug}`}>{product.name}</Link>
                  </h3>

                  {/* Precio con descuento promocional */}
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="font-sans text-xs sm:text-sm font-semibold text-[#34351F]">
                      $ {priceDetails.finalPrice.toLocaleString("es-CO")}
                    </span>
                    {priceDetails.hasDiscount && (
                      <span className="text-[11px] text-stone-400 line-through">
                        $ {priceDetails.subtotalPrice.toLocaleString("es-CO")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicadores de puntos de navegación para pantallas móviles */}
      {displayProducts.length > 1 && (
        <div className="flex lg:hidden items-center justify-center gap-1.5 mt-3">
          {displayProducts.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToIndex(idx)}
              aria-label={`Ir a producto ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 touch-manipulation cursor-pointer ${
                idx === activeIndex
                  ? "w-6 bg-[#6B6832]"
                  : "w-1.5 bg-stone-300 hover:bg-stone-400"
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

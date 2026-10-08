"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ImageOff, Sparkles } from "lucide-react";
import { WishlistButton } from "@/components/shared/wishlist-button";
import { Reveal } from "@/components/shared/reveal";
import { ProductQuickViewModal } from "@/features/catalog/components/product-quick-view-modal";
import { useQuickView } from "@/features/catalog/hooks/use-quick-view";
import type { ProductPreview } from "@/types/product";
import { cloudinaryUrl } from "@/lib/images/cloudinary";
import { calculateProductPriceDetails } from "@/features/product-detail/utils/price-helpers";

export function FeaturedProducts({ products }: { products: ProductPreview[] }) {
  const { isOpen, isLoading, previewProduct, fullProduct, openQuickView, closeQuickView } =
    useQuickView();

  if (!products || products.length === 0) return null;

  const displayProducts = products.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      {/* Encabezado Editorial */}
      <div className="flex items-end justify-between mb-6 sm:mb-8">
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-[#34351F] font-medium tracking-tight">
            Productos <span className="italic font-normal">destacados</span>
          </h2>
          <p className="font-sans text-xs sm:text-sm text-stone-500 mt-1 sm:mt-1.5">
            Favoritos de nuestras clientas.
          </p>
        </div>

        <Link
          href="/catalogo"
          className="group inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[#6B6832] hover:text-[#34351F] transition-colors"
        >
          <span>Ver catálogo</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Grid de Productos Ecommerce */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
        {displayProducts.map((product, index) => {
          const productImages = product.images ?? [];
          const secondImage = productImages.length > 1 ? productImages[1] : undefined;
          const soldOut = product.available === false;

          const priceDetails = calculateProductPriceDetails({
            basePrice: product.price,
            categoryName: product.categoryName,
            styleName: product.styleName,
          });

          return (
            <Reveal
              key={product.id}
              delay={index * 90}
              className="flex flex-col h-full"
            >
              <div className="group flex flex-col h-full bg-[#FDFBF7] rounded-2xl sm:rounded-3xl border border-brand-border/50 p-3 sm:p-4 shadow-2xs hover:shadow-xl hover:border-[#6B6832]/50 hover:-translate-y-2 active:-translate-y-1 active:scale-[0.98] active:shadow-md transform-gpu transition-all duration-300 select-none">
              {/* Imagen: única zona que navega al detalle junto con el título */}
              <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden bg-stone-100 mb-3 sm:mb-4">
                <Link href={`/productos/${product.slug}`} className="block">
                  {product.image ? (
                    <>
                      <Image
                        src={cloudinaryUrl(product.image)}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 group-active:scale-105"
                      />
                      {secondImage && (
                        <Image
                          src={cloudinaryUrl(secondImage)}
                          alt={`${product.name} vista alternativa`}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
              <div>
                <h3 className="font-heading text-xs sm:text-sm lg:text-base text-[#34351F] font-medium leading-snug truncate group-hover:text-[#6B6832] transition-colors">
                  <Link href={`/productos/${product.slug}`}>{product.name}</Link>
                </h3>

                {/* Precio con descuento del 5% */}
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
          </Reveal>
        );
        })}
      </div>

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
"use client";

import Link from "next/link";
import Image from "next/image";
import { ImageOff, Check, Sparkles } from "lucide-react";
import { StarRatingDisplay } from "./star-rating-display";
import { WishlistButton } from "./wishlist-button";
import type { ProductPreview } from "@/types/product";
import { cloudinaryUrl } from "@/lib/images/cloudinary";
import { sortSizes } from "@/lib/sizes";
import { calculateProductPriceDetails } from "@/features/product-detail/utils/price-helpers";

export function ProductCard({
  product,
  categorySlug,
  onQuickView,
}: {
  product: ProductPreview;
  categorySlug?: string;
  onQuickView?: (product: ProductPreview) => void;
}) {
  const soldOut = product.available === false;
  const productImages = product.images ?? [];
  const secondImage = productImages.length > 1 ? productImages[1] : undefined;
  const href = categorySlug
    ? `/productos/${product.slug}?categoria=${encodeURIComponent(categorySlug)}`
    : `/productos/${product.slug}`;

  const priceDetails = calculateProductPriceDetails({
    basePrice: product.price,
    // El nombre del estilo define la tarifa; la categoría solo aporta el género.
    categoryName: product.categoryName ?? categorySlug,
    styleName: product.styleName,
  });

  return (
    <Link
      href={href}
      className="group block transform-gpu transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-1.5 active:scale-[0.98] select-none"
    >
      <div className="relative aspect-square rounded-xl bg-secondary overflow-hidden shadow-xs group-hover:shadow-lg group-active:shadow-md transition-shadow duration-300">
        {product.image ? (
          <>
            <Image
              src={cloudinaryUrl(product.image)}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-108 group-active:scale-105 transition-transform duration-500 ease-out"
            />
            {secondImage && (
              <Image
                src={cloudinaryUrl(secondImage)}
                alt={`${product.name} vista alternativa`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-400 ease-out"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="h-6 w-6 text-muted-foreground" />
          </div>
        )}

        {/* Badges superiores: Agotado ó 5% OFF */}
        {soldOut ? (
          <span className="absolute top-2 left-2 rounded-full bg-foreground/90 text-background text-[10px] font-medium uppercase tracking-wide px-2.5 py-1 z-10 shadow-xs">
            Agotado
          </span>
        ) : priceDetails.hasDiscount ? (
          <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 rounded-full bg-[#34351F] text-white text-[9px] font-semibold tracking-wide px-2 py-1 shadow-xs max-w-[calc(100%-3rem)] animate-[pulse_3s_ease-in-out_infinite]">
            <Sparkles className="h-3 w-3 shrink-0 text-[#B6AE3A] animate-spin-slow" />
            5% OFF
          </span>
        ) : null}

        <WishlistButton
          className="absolute top-2 right-2 z-10 transition-transform duration-200 active:scale-125"
          item={{
            id: product.id,
            type: "product",
            name: product.name,
            image: product.image,
            slug: `/productos/${product.slug}`,
            price: priceDetails.finalPrice,
          }}
        />

        <button
          type="button"
          className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-md hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-200 opacity-100 pointer-events-auto sm:opacity-0 sm:pointer-events-none sm:group-hover:opacity-100 sm:group-hover:pointer-events-auto flex items-center gap-1.5 z-10"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onQuickView?.(product);
          }}
          aria-label={`Vista previa rápida de ${product.name}`}
        >
          Elegir
        </button>
      </div>

      <p className="font-heading text-base text-foreground mt-2.5 truncate group-hover:text-primary transition-colors duration-200">{product.name}</p>

      {/* Bloque de Precio con Descuento del 5% */}
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <span className="text-sm font-bold text-foreground">
          ${priceDetails.finalPrice.toLocaleString("es-CO")} COP
        </span>
        {priceDetails.hasDiscount && (
          <span className="text-xs text-muted-foreground line-through">
            ${priceDetails.subtotalPrice.toLocaleString("es-CO")}
          </span>
        )}
      </div>

      {soldOut ? (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
          Sin disponible en tallas
        </span>
      ) : product.sizes && product.sizes.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
          {/* Se ordenan para que el resumen de tallas sea siempre el mismo,
              y no dependa del orden en que la API las devuelve. */}
          {sortSizes(product.sizes).slice(0, 4).map((s) => (
            <span
              key={s}
              className="h-6 min-w-6 px-1.5 inline-flex items-center justify-center rounded-md border border-border text-[10px] font-medium text-foreground"
            >
              {s}
            </span>
          ))}
          {product.sizes.length > 4 && (
            <span className="text-[10px] text-muted-foreground">+{product.sizes.length - 4}</span>
          )}
          {product.sizes.length > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-primary">
              <Check className="h-3 w-3" />
              {product.sizes.length} tallas
            </span>
          )}
        </div>
      ) : null}

      {!!product.reviewCount && product.reviewCount > 0 && (
        <div className="flex items-center gap-1 mt-1.5">
          <StarRatingDisplay rating={product.rating ?? 0} size="xs" />
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>
      )}
    </Link>
  );
}
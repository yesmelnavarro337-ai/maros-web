"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRatingDisplay } from "@/components/shared/star-rating-display";
import { SizeSelector } from "@/components/shared/size-selector";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { AddToCartButton } from "@/features/cart/add-to-cart-button";
import { SizeGuideModal } from "@/features/products/components/size-guide-modal";
import { ColorSelector } from "./color-selector";
import type { ProductColorOption, ProductDetail } from "../types";
import { PriceNoticeBanner } from "./price-notice-banner";
import {
  isLargeSize,
  computeSizeSurcharge,
  computeCategorySurcharge,
  findActiveCategory,
} from "../utils/price-helpers";

interface ProductInfoPanelProps {
  product: ProductDetail;
  /** Lista de colores disponibles unificados (variantes + imágenes). */
  availableColors?: ProductColorOption[];
  /** Controlled color name from parent (used for gallery sync). */
  selectedColorName?: string;
  /** Controlled color hex from parent (fallback). */
  selectedColor?: string;
  /** Callback when color changes (used for gallery sync). */
  onColorChange?: (colorName: string) => void;
  /** Category slug from URL query param, used to filter notice banners. */
  categorySlug?: string;
}

export function ProductInfoPanel({
  product,
  availableColors: propAvailableColors,
  selectedColorName,
  selectedColor,
  onColorChange,
  categorySlug,
}: ProductInfoPanelProps) {
  const colorsList = useMemo(() => {
    if (propAvailableColors && propAvailableColors.length > 0) {
      return propAvailableColors;
    }
    return product.colors;
  }, [propAvailableColors, product.colors]);

  // Internal color name state (used when not controlled by parent)
  const [internalColorName, setInternalColorName] = useState(
    colorsList[0]?.name ?? ""
  );

  // Use controlled colorName if provided, otherwise use internal state
  const colorName = selectedColorName ?? selectedColor ?? internalColorName;
  const handleColorChange = onColorChange ?? setInternalColorName;

  const selectedColorObj = useMemo(() => {
    return (
      colorsList.find((c) => c.name.toLowerCase() === colorName.toLowerCase()) ||
      colorsList.find((c) => c.hex.toLowerCase() === colorName.toLowerCase()) ||
      colorsList[0]
    );
  }, [colorsList, colorName]);

  const [size, setSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = useMemo(() => {
    return (
      product.variants.find(
        (v) =>
          v.size === size &&
          selectedColorObj?.name &&
          v.colorName.toLowerCase() === selectedColorObj.name.toLowerCase()
      ) ||
      product.variants.find(
        (v) =>
          v.size === size &&
          selectedColorObj?.hex &&
          v.colorHex.toLowerCase() === selectedColorObj.hex.toLowerCase()
      )
    );
  }, [product.variants, size, selectedColorObj]);

  // ── Precio: desglose con helpers compartidos ──
  const basePrice = product.basePrice;
  const sizeSurcharge = computeSizeSurcharge(selectedVariant?.price, basePrice);
  const isPlusSize = isLargeSize(size);

  // Categoría activa (solo cuando se seleccionó una en el filtro del catálogo)
  const activeCategory = useMemo(
    () => findActiveCategory(product.categories, categorySlug),
    [product.categories, categorySlug]
  );
  const categorySurcharge = computeCategorySurcharge(activeCategory, basePrice);

  // Precio final = base + recargo por talla + recargo por categoría
  const finalPrice = basePrice + sizeSurcharge + categorySurcharge;
  const totalSurcharge = sizeSurcharge + categorySurcharge;
  const hasSurcharge = totalSurcharge > 0;

  // Tallas que no tienen NINGUNA combinación con stock, sin importar el color.
  const disabledSizes = useMemo(
    () => product.sizes.filter((s) => !product.variants.some((v) => v.size === s && v.stock > 0)),
    [product.sizes, product.variants]
  );

  // Colores sin stock específicamente para la talla actualmente seleccionada.
  const disabledColorsForSize = useMemo(() => {
    return colorsList
      .filter((c) => {
        const variant = product.variants.find(
          (v) => v.size === size && v.colorName.toLowerCase() === c.name.toLowerCase()
        );
        return variant ? variant.stock <= 0 : false;
      })
      .map((c) => c.name);
  }, [colorsList, product.variants, size]);

  const selectedCombinationAvailable = (selectedVariant?.stock ?? 0) > 0;

  const customizeHref = `/personaliza?producto=${product.slug}&talla=${size}&color=${encodeURIComponent(selectedColorObj?.name ?? colorName)}&cantidad=${quantity}`;
  const quoteHref = `/cotizar?producto=${product.slug}&talla=${size}&color=${encodeURIComponent(selectedColorObj?.name ?? colorName)}&cantidad=${quantity}`;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Badge variant="secondary" className="mb-2">{product.categoryName}</Badge>
        <h1 className="font-heading text-3xl text-foreground">{product.name}</h1>
        {!!product.reviewCount && product.reviewCount > 0 && (
          <div className="flex items-center gap-2 mt-1.5">
            <StarRatingDisplay rating={product.rating ?? 0} />
            <span className="text-sm text-muted-foreground">({product.reviewCount} opiniones)</span>
          </div>
        )}
      </div>

      {/* ── Bloque de precio con desglose ── */}
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-heading text-2xl text-foreground">
            ${finalPrice.toLocaleString("es-CO")} COP
          </span>
          {hasSurcharge && (
            <span className="text-sm text-muted-foreground line-through">
              ${basePrice.toLocaleString("es-CO")} COP
            </span>
          )}
        </div>

        {hasSurcharge && (
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            {sizeSurcharge > 0 && (
              <Badge variant="secondary" className="bg-amber-100/80 text-amber-900 border-amber-200/60">
                Talla {size.toUpperCase()} +${sizeSurcharge.toLocaleString("es-CO")}
              </Badge>
            )}
            {categorySurcharge > 0 && activeCategory && (
              <Badge variant="secondary" className="bg-rose-100/80 text-rose-900 border-rose-200/60">
                {activeCategory.name} +${categorySurcharge.toLocaleString("es-CO")}
              </Badge>
            )}
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground">{product.description}</p>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-foreground">Talla</p>
          <SizeGuideModal />
        </div>
        <SizeSelector sizes={product.sizes} selected={size} onChange={setSize} disabledSizes={disabledSizes} />
      </div>

      {colorsList.length > 0 && (
        <ColorSelector
          imageDetails={product.imageDetails ?? []}
          colors={colorsList}
          selectedColorName={selectedColorObj?.name ?? colorName}
          onColorChange={handleColorChange}
          disabledColorNames={disabledColorsForSize}
        />
      )}

      <div>
        <p className="text-sm font-medium text-foreground mb-2">Cantidad</p>
        <QuantityStepper value={quantity} onChange={setQuantity} />
      </div>

      <PriceNoticeBanner
        selectedSize={size}
        categories={product.categories}
        categoryName={product.categoryName}
        basePrice={product.basePrice}
        filterCategorySlug={categorySlug}
      />

      {selectedVariant && selectedVariant.stock <= 0 && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
          Agotado. Esta combinación de talla y color no tiene stock disponible.
        </p>
      )}

      <div className="flex flex-col gap-3 mt-2">
        <AddToCartButton
          productId={product.id}
          slug={product.slug}
          name={product.name}
          price={finalPrice}
          size={size}
          colorName={selectedColorObj?.name ?? ""}
          colorHex={selectedColorObj?.primaryHex ?? selectedColorObj?.hex ?? ""}
          quantity={quantity}
          image={product.images[0] ?? ""}
          disabled={!selectedCombinationAvailable}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {product.allowCustomization && (
            <Button asChild variant="outline" className="w-full">
              <Link href={customizeHref}>
                <Sparkles className="mr-2 h-4 w-4 text-brand-rose" />
                Personalizar
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" className="w-full">
            <Link href={quoteHref}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Solicitar cotización
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

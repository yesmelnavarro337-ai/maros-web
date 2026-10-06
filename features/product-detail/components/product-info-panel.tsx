"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRatingDisplay } from "@/components/shared/star-rating-display";
import { SizeSelector } from "@/components/shared/size-selector";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { AddToCartButton } from "@/features/cart/add-to-cart-button";
import { SizeGuideModal } from "@/features/products/components/size-guide-modal";
import { sortSizes } from "@/lib/sizes";
import { ColorSelector } from "./color-selector";
import type { ProductColorOption, ProductDetail } from "../types";
import { PriceNoticeBanner } from "./price-notice-banner";
import {
  filterSizesForStyle,
  isInfantilCategory,
  resolveSelectedSize,
} from "../utils/size-helpers";
import {
  isLargeSize,
  computeSizeSurcharge,
  computeCategorySurcharge,
  findActiveCategory,
  calculateProductPriceDetails,
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

  // Se ordena la lista para que la talla inicial sea la más pequeña del catálogo
// y no la primera según el orden arbitrario de la API.
const [size, setSize] = useState(() => sortSizes(product.sizes)[0] ?? "");
  const [style, setStyle] = useState(product.styles?.[0] ?? "");
  const [material, setMaterial] = useState(product.materials?.[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [hasEmbroidery, setHasEmbroidery] = useState(false);

  /**
   * El estilo (o la categoría) determina la línea del producto y, con ella, el
   * catálogo de tallas: un estilo infantil no muestra tallas de adulto y viceversa.
   */
  const visibleSizes = useMemo(
    () => filterSizesForStyle(product.sizes, style, isInfantilCategory(product.categoryName)),
    [product.sizes, style, product.categoryName]
  );

  // Al cambiar de estilo se selecciona la primera talla del nuevo rango para no
  // dejar una talla que ya no existe en el catálogo vigente.
  useEffect(() => {
    setSize((prev) => resolveSelectedSize(prev, visibleSizes));
  }, [visibleSizes]);

  const selectedVariant = useMemo(() => {
    return (
      product.variants.find(
        (v) =>
          (!size || v.size === size) &&
          (selectedColorObj?.name
            ? v.colorName.toLowerCase() === selectedColorObj.name.toLowerCase()
            : true) &&
          (!style || !v.styleName || v.styleName.toLowerCase() === style.toLowerCase()) &&
          (!material || !v.materialName || v.materialName.toLowerCase() === material.toLowerCase())
      ) ||
      product.variants.find(
        (v) =>
          (!size || v.size === size) &&
          (selectedColorObj?.name
            ? v.colorName.toLowerCase() === selectedColorObj.name.toLowerCase()
            : true)
      )
    );
  }, [product.variants, size, selectedColorObj, style, material]);

  // ── Precio: desglose dinámico con precios fijos, +10.000 COP por talla > L, +7.000 COP bordado y 5% de descuento ──
  const priceDetails = calculateProductPriceDetails({
    basePrice: product.basePrice,
    variantPrice: selectedVariant?.price,
    categoryName: product.categoryName,
    styleName: style || selectedVariant?.styleName,
    size,
    hasEmbroidery,
  });

  const finalPrice = priceDetails.finalPrice;

  // Tallas que no tienen NINGUNA combinación con stock para el color/estilo actual.
  const disabledSizes = useMemo(
    () =>
      visibleSizes.filter(
        (s) =>
          !product.variants.some(
            (v) =>
              v.size === s &&
              (!colorName || v.colorName.toLowerCase() === colorName.toLowerCase()) &&
              (!style || !v.styleName || v.styleName.toLowerCase() === style.toLowerCase()) &&
              (!material || !v.materialName || v.materialName.toLowerCase() === material.toLowerCase()) &&
              v.stock > 0
          )
      ),
    [visibleSizes, product.variants, colorName, style, material]
  );

  // Colores sin stock específicamente para la talla, estilo y material seleccionados.
  const disabledColorsForSize = useMemo(() => {
    return colorsList
      .filter((c) => {
        const variant = product.variants.find(
          (v) =>
            (!size || v.size === size) &&
            v.colorName.toLowerCase() === c.name.toLowerCase() &&
            (!style || !v.styleName || v.styleName.toLowerCase() === style.toLowerCase()) &&
            (!material || !v.materialName || v.materialName.toLowerCase() === material.toLowerCase())
        );
        return variant ? variant.stock <= 0 : false;
      })
      .map((c) => c.name);
  }, [colorsList, product.variants, size, style, material]);

  const selectedCombinationAvailable = (selectedVariant?.stock ?? 0) > 0;

  // La ruta real de la sección es /personaliza (no /personalizacion), y el
  // producto viaja en `product` para que la página lo auto-seleccione.
  const personalizeParams = new URLSearchParams({
    product: product.slug,
    talla: size,
    color: selectedColorObj?.name ?? colorName,
    estilo: style,
    material,
    cantidad: String(quantity),
  });
  const customizeHref = `/personaliza?${personalizeParams.toString()}`;
  // /cotizar sigue leyendo el parámetro `producto`: se mantiene por compatibilidad.
  const quoteParams = new URLSearchParams(personalizeParams);
  quoteParams.set("producto", product.slug);
  quoteParams.delete("product");
  const quoteHref = `/cotizar?${quoteParams.toString()}`;

  return (
    <div className="flex flex-col gap-5">
      <div>
        {/* Categorías: fila compacta con scroll horizontal suave en móvil para
            que no ocupen espacio vertical cuando el producto tiene varias. */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar mb-2 pb-0.5">
          {(product.categories?.length
            ? product.categories.map((c) => c.name)
            : [product.categoryName]
          )
            .filter(Boolean)
            .map((name) => (
              <Badge
                key={name}
                variant="secondary"
                className="text-[11px] px-2 py-0.5 whitespace-nowrap shrink-0"
              >
                <span className="line-clamp-1">{name}</span>
              </Badge>
            ))}
        </div>
        <h1 className="font-heading text-2xl md:text-4xl font-bold text-foreground">{product.name}</h1>
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
          <span className="font-heading text-3xl font-extrabold text-[#34351F]">
            ${priceDetails.finalPrice.toLocaleString("es-CO")} COP
          </span>
          {priceDetails.hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              ${priceDetails.subtotalPrice.toLocaleString("es-CO")} COP
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-0.5">
          {priceDetails.hasDiscount && (
            <Badge variant="secondary" className="bg-[#34351F] text-white border-[#34351F]">
              <Sparkles className="h-3 w-3 mr-1 text-[#B6AE3A]" />
              5% OFF
            </Badge>
          )}
          {priceDetails.isPlusSize && (
            <Badge variant="secondary" className="bg-amber-100/80 text-amber-900 border-amber-200/60">
              Talla {size.toUpperCase()} (Exceso +$10.000 COP)
            </Badge>
          )}
          {priceDetails.isInfantilYouthSize && (
            <Badge variant="secondary" className="bg-sky-100/80 text-sky-900 border-sky-200/60">
              Talla {size.toUpperCase()} (Rango Juvenil +$10.000 COP)
            </Badge>
          )}
          {priceDetails.hasEmbroidery && (
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-900 border-emerald-300">
              Bordado Incluido (+$7.000 COP)
            </Badge>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{product.description}</p>

      {/* SELECCIÓN DE COLOR */}
      {colorsList.length > 0 && (
        <ColorSelector
          imageDetails={product.imageDetails ?? []}
          colors={colorsList}
          selectedColorName={selectedColorObj?.name ?? colorName}
          onColorChange={handleColorChange}
          disabledColorNames={disabledColorsForSize}
        />
      )}

      {/* SELECCIÓN DE ESTILO */}
      {product.styles && product.styles.length > 0 && (
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Estilo</p>
          <div className="flex flex-wrap gap-2">
            {product.styles.map((st) => {
              const isSelected = style.toLowerCase() === st.toLowerCase();
              /**
               * La disponibilidad del estilo NO debe depender de la talla
               * seleccionada: si se evaluara contra la talla actual, cambiar de
               * línea (p. ej. de infantil a "Batas") dejaría el botón sin
               *stock y por tanto inclicable (deadlock). Se evalúa contra las
               * tallas propias de la línea del estilo, que es lo que el usuario
               * podrá elegir en cuanto lo seleccione.
               */
              const styleSizes = filterSizesForStyle(
                product.sizes,
                st,
                isInfantilCategory(product.categoryName)
              );
              const isAvailable =
                style === st ||
                styleSizes.some((sz) =>
                  product.variants.some(
                    (v) =>
                      (!v.styleName || v.styleName.toLowerCase() === st.toLowerCase()) &&
                      v.size === sz &&
                      (!colorName || v.colorName.toLowerCase() === colorName.toLowerCase()) &&
                      v.stock > 0
                  )
                );

              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    if (!isAvailable) return;
                    // Se actualiza estilo y talla en el mismo clic para que el
                    // selector de Talla reaccione de inmediato a la nueva línea.
                    setStyle(st);
                    setSize(
                      resolveSelectedSize(
                        size,
                        filterSizesForStyle(
                          product.sizes,
                          st,
                          isInfantilCategory(product.categoryName)
                        )
                      )
                    );
                  }}
                  disabled={!isAvailable}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all shadow-2xs ${
                    isSelected
                      ? "bg-[#34351F] text-white border-[#34351F] shadow-xs font-bold"
                      : isAvailable
                      ? "bg-white border-neutral-200 text-neutral-800 hover:border-[#34351F]/60 cursor-pointer"
                      : "bg-neutral-100/70 border-neutral-200 text-neutral-400 opacity-40 cursor-not-allowed pointer-events-none line-through"
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SELECCIÓN DE MATERIAL */}
      {product.materials && product.materials.length > 0 && (
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Material</p>
          <div className="flex flex-wrap gap-2">
            {product.materials.map((mat) => {
              const isSelected = material.toLowerCase() === mat.toLowerCase();
              const isAvailable = product.variants.some(
                (v) =>
                  (!v.materialName || v.materialName.toLowerCase() === mat.toLowerCase()) &&
                  (!size || v.size === size) &&
                  (!colorName || v.colorName.toLowerCase() === colorName.toLowerCase()) &&
                  (!style || !v.styleName || v.styleName.toLowerCase() === style.toLowerCase()) &&
                  v.stock > 0
              );

              return (
                <button
                  key={mat}
                  type="button"
                  onClick={() => isAvailable && setMaterial(mat)}
                  disabled={!isAvailable}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all shadow-2xs ${
                    isSelected
                      ? "bg-[#8B7D4E] text-white border-[#8B7D4E] shadow-xs"
                      : isAvailable
                      ? "bg-white border-neutral-200 text-neutral-800 hover:border-[#8B7D4E]/50 cursor-pointer"
                      : "bg-neutral-100/70 border-neutral-200 text-neutral-400 opacity-40 cursor-not-allowed pointer-events-none line-through"
                  }`}
                >
                  {mat}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* OPCIÓN DE BORDADO (+ $7.000 COP) */}
      <div className="p-3.5 rounded-xl border border-[#34351F]/15 bg-[#FAF9F4] space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="embroidery-toggle" className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-bold text-neutral-800">
            <input
              id="embroidery-toggle"
              type="checkbox"
              checked={hasEmbroidery}
              onChange={(e) => setHasEmbroidery(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300 text-[#34351F] focus:ring-[#34351F] cursor-pointer"
            />
            <span>Incluir bordado de diseño (+ $7.000 COP)</span>
          </label>
          {hasEmbroidery && (
            <Badge className="bg-[#34351F] text-white text-[10px] font-bold">
              +$7.000 COP
            </Badge>
          )}
        </div>
        <p className="text-[11px] text-neutral-600 leading-relaxed">
          ¿Quieres un diseño o texto personalizado a tu gusto?{" "}
          <Link href={customizeHref} className="font-semibold text-[#8B7D4E] underline hover:text-[#34351F]">
            Dirígete a la sección de Personalización →
          </Link>
        </p>
      </div>

      {/* SELECCIÓN DE TALLA */}
      {visibleSizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">Talla</p>
            <SizeGuideModal />
          </div>
          <SizeSelector
            sizes={visibleSizes}
            selected={size}
            onChange={setSize}
            disabledSizes={disabledSizes}
          />
        </div>
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

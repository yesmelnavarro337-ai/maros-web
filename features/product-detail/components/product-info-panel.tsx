import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, MessageCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRatingDisplay } from "@/components/shared/star-rating-display";
import { SizeSelector } from "@/components/shared/size-selector";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { AddToCartButton } from "@/features/cart/add-to-cart-button";
import { SizeGuideModal } from "@/features/products/components/size-guide-modal";
import { sortSizes } from "@/lib/sizes";
import { ColorSelector } from "./color-selector";
import { RichText } from "@/components/shared/rich-text";
import type { ProductColorOption, ProductDetail } from "../types";
import { PriceNoticeBanner } from "./price-notice-banner";
import {
  filterSizesForStyle,
  isInfantilCategory,
  isInfantilStyleName,
  resolveSelectedSize,
} from "../utils/size-helpers";
import {
  calculateProductPriceDetails,
  ADULT_STYLES,
  INFANTIL_STYLES,
} from "../utils/price-helpers";

/**
 * Coincidencia tolerante de estilo: compara nombres normalizados ignorando sufijos
 * entre paréntesis como "(Infantil)", "(Mujer)", "(Hombre)", etc.
 */
function isStyleMatch(vStyle?: string | null, targetStyle?: string | null): boolean {
  if (!vStyle || !targetStyle) return true;
  const vNorm = vStyle.trim().toLowerCase();
  const tNorm = targetStyle.trim().toLowerCase();
  if (vNorm === tNorm) return true;
  const cleanV = vNorm.replace(/\s*\([^)]*\)/g, "").trim();
  const cleanT = tNorm.replace(/\s*\([^)]*\)/g, "").trim();
  return cleanV === cleanT;
}

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

  // ── Selector de Categoría (Adultos vs Infantil) ──
  const isProductCategoryInfantil =
    isInfantilCategory(product.categoryName) ||
    isInfantilCategory(categorySlug) ||
    (product.categories?.some((c) => isInfantilCategory(c.name) || isInfantilCategory(c.slug)) ?? false);

  const initialCandidate = product.styles?.[0] ?? "";
  const initialLine: "adulto" | "infantil" =
    isProductCategoryInfantil || (initialCandidate ? isInfantilStyleName(initialCandidate) : false)
      ? "infantil"
      : "adulto";

  const [selectedLine, setSelectedLine] = useState<"adulto" | "infantil">(initialLine);
  const [styleError, setStyleError] = useState(false);
  const styleSectionRef = useRef<HTMLDivElement>(null);

  const availableStylesForLine = useMemo(() => {
    const rawStyles = product.styles && product.styles.length > 0 ? product.styles : [];
    const filtered = rawStyles.filter((st) =>
      selectedLine === "infantil" ? isInfantilStyleName(st) : !isInfantilStyleName(st)
    );

    if (filtered.length > 0) return filtered;

    // Si el producto no tiene estilos asignados de esta línea, mostramos los estilos oficiales correspondientes
    return selectedLine === "infantil"
      ? INFANTIL_STYLES.map((s) => s.name)
      : ADULT_STYLES.map((s) => s.name);
  }, [product.styles, selectedLine]);

  // Se inicializa el estilo garantizando auto-selección del primer estilo disponible
  const [style, setStyle] = useState<string>(() => {
    const rawStyles = product.styles && product.styles.length > 0 ? product.styles : [];
    const filtered = rawStyles.filter((st) =>
      initialLine === "infantil" ? isInfantilStyleName(st) : !isInfantilStyleName(st)
    );
    const stylesList =
      filtered.length > 0
        ? filtered
        : initialLine === "infantil"
        ? INFANTIL_STYLES.map((s) => s.name)
        : ADULT_STYLES.map((s) => s.name);
    return stylesList[0] ?? "";
  });

  // Tallas iniciales según el estilo inicial
  const [size, setSize] = useState<string>(() => {
    const rawStyles = product.styles && product.styles.length > 0 ? product.styles : [];
    const filtered = rawStyles.filter((st) =>
      initialLine === "infantil" ? isInfantilStyleName(st) : !isInfantilStyleName(st)
    );
    const stylesList =
      filtered.length > 0
        ? filtered
        : initialLine === "infantil"
        ? INFANTIL_STYLES.map((s) => s.name)
        : ADULT_STYLES.map((s) => s.name);
    const defaultStyle = stylesList[0] ?? "";
    const lineSizes = filterSizesForStyle(product.sizes, defaultStyle, initialLine === "infantil");
    return lineSizes[0] ?? "";
  });

  const [material, setMaterial] = useState(product.materials?.[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [hasEmbroidery, setHasEmbroidery] = useState(false);

  // Auto-selección y sincronización defensiva:
  // Al cambiar la categoría o al montar el componente, si no hay estilo seleccionado
  // o no pertenece a la línea activa, se auto-selecciona el primer estilo disponible.
  useEffect(() => {
    const isCurrentStyleValid =
      Boolean(style) &&
      availableStylesForLine.some((st) => st.toLowerCase() === style.toLowerCase());

    if (!isCurrentStyleValid && availableStylesForLine.length > 0) {
      const defaultStyle = availableStylesForLine[0];
      setStyle(defaultStyle);
      const nextSizes = filterSizesForStyle(
        product.sizes,
        defaultStyle,
        selectedLine === "infantil"
      );
      setSize((prevSize) => resolveSelectedSize(prevSize, nextSizes));
      setStyleError(false);
    }
  }, [availableStylesForLine, style, product.sizes, selectedLine]);

  const handleLineChange = (newLine: "adulto" | "infantil") => {
    if (newLine === selectedLine) return;
    setSelectedLine(newLine);

    const rawStyles = product.styles && product.styles.length > 0 ? product.styles : [];
    const filtered = rawStyles.filter((st) =>
      newLine === "infantil" ? isInfantilStyleName(st) : !isInfantilStyleName(st)
    );
    const nextStyles =
      filtered.length > 0
        ? filtered
        : newLine === "infantil"
        ? INFANTIL_STYLES.map((s) => s.name)
        : ADULT_STYLES.map((s) => s.name);

    const nextStyle = nextStyles[0] ?? "";
    setStyle(nextStyle);
    setStyleError(false);

    const nextSizes = filterSizesForStyle(
      product.sizes,
      nextStyle,
      newLine === "infantil"
    );
    setSize(resolveSelectedSize(size, nextSizes));
  };

  /**
   * Validación defensiva de estilo: si no hay estilo seleccionado, alerta al usuario
   * y resalta la sección de estilos.
   */
  const requireStyleSelection = (): boolean => {
    if (!style) {
      setStyleError(true);
      toast.error("Por favor selecciona un estilo primero");
      styleSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return false;
    }
    return true;
  };

  /**
   * El estilo y la línea seleccionada determinan el catálogo de tallas:
   * Adultos: XS a 3XL | Infantil: 0-3M a 16.
   */
  const visibleSizes = useMemo(
    () => filterSizesForStyle(product.sizes, style, selectedLine === "infantil"),
    [product.sizes, style, selectedLine]
  );

  // Al cambiar el rango de tallas, se reajusta la talla guardada
  const [previousVisibleSizes, setPreviousVisibleSizes] = useState(visibleSizes);
  if (previousVisibleSizes !== visibleSizes) {
    setPreviousVisibleSizes(visibleSizes);
    setSize((prev) => resolveSelectedSize(prev, visibleSizes));
  }

  const selectedVariant = useMemo(() => {
    return (
      product.variants.find(
        (v) =>
          (!size || v.size.trim().toUpperCase() === size.trim().toUpperCase()) &&
          (selectedColorObj?.name
            ? v.colorName.toLowerCase() === selectedColorObj.name.toLowerCase()
            : true) &&
          (!style || isStyleMatch(v.styleName, style)) &&
          (!material || !v.materialName || v.materialName.toLowerCase() === material.toLowerCase())
      ) ||
      product.variants.find(
        (v) =>
          (!size || v.size.trim().toUpperCase() === size.trim().toUpperCase()) &&
          (selectedColorObj?.name
            ? v.colorName.toLowerCase() === selectedColorObj.name.toLowerCase()
            : true)
      )
    );
  }, [product.variants, size, selectedColorObj, style, material]);

  // ── Precio: desglose dinámico con precios fijos según estilo y tallas escalonadas ──
  const priceDetails = calculateProductPriceDetails({
    basePrice: product.basePrice,
    variantPrice: selectedVariant?.price,
    categoryName: selectedLine === "infantil" ? "Infantil" : product.categoryName,
    styleName: style || selectedVariant?.styleName,
    size,
    hasEmbroidery,
  });

  const finalPrice = priceDetails.finalPrice;

  // Tallas que no tienen NINGUNA combinación con stock para el color/estilo actual.
  const disabledSizes = useMemo(
    () => {
      if (!style) {
        return visibleSizes;
      }
      return visibleSizes.filter(
        (s) =>
          !product.variants.some(
            (v) =>
              v.size.trim().toUpperCase() === s.trim().toUpperCase() &&
              (!colorName || v.colorName.toLowerCase() === colorName.toLowerCase()) &&
              (!v.styleName || isStyleMatch(v.styleName, style)) &&
              (!material || !v.materialName || v.materialName.toLowerCase() === material.toLowerCase()) &&
              v.stock > 0
          ) && !product.allowCustomization
      );
    },
    [visibleSizes, product.variants, colorName, style, material, product.allowCustomization]
  );

  // Colores sin stock específicamente para la talla, estilo y material seleccionados.
  const disabledColorsForSize = useMemo(() => {
    return colorsList
      .filter((c) => {
        const variant = product.variants.find(
          (v) =>
            (!size || v.size.trim().toUpperCase() === size.trim().toUpperCase()) &&
            v.colorName.toLowerCase() === c.name.toLowerCase() &&
            (!style || isStyleMatch(v.styleName, style)) &&
            (!material || !v.materialName || v.materialName.toLowerCase() === material.toLowerCase())
        );
        return variant ? variant.stock <= 0 && !product.allowCustomization : false;
      })
      .map((c) => c.name);
  }, [colorsList, product.variants, size, style, material, product.allowCustomization]);

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
    // Arrastra el checklist de bordado y aterriza directo en el paso 2 (tela).
    bordado: hasEmbroidery ? "1" : "0",
    paso: "tela",
  });
  const customizeHref = `/personaliza?${personalizeParams.toString()}`;
  // /cotizar sigue leyendo el parámetro `producto`: se mantiene por compatibilidad.
  const quoteParams = new URLSearchParams(personalizeParams);
  quoteParams.set("producto", product.slug);
  quoteParams.delete("product");
  // `bordado`/`paso` son solo para el flujo de personalización; no aplican a /cotizar.
  quoteParams.delete("bordado");
  quoteParams.delete("paso");
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
          <span className="font-heading text-3xl font-extrabold text-foreground">
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
            <Badge variant="secondary" className="bg-primary text-primary-foreground border-transparent shadow-xs">
              <Sparkles className="h-3 w-3 mr-1 text-accent" />
              5% OFF
            </Badge>
          )}
          {priceDetails.isPlusSize && (
            <Badge variant="secondary" className="bg-amber-100/90 text-amber-900 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800/60 shadow-xs">
              Talla {size.toUpperCase()} (+${priceDetails.sizeSurcharge.toLocaleString("es-CO")} COP)
            </Badge>
          )}

          {priceDetails.hasEmbroidery && (
            <Badge variant="secondary" className="bg-emerald-100/90 text-emerald-900 border-emerald-300/80 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800/60 shadow-xs">
              Bordado Incluido (+$7.000 COP)
            </Badge>
          )}
        </div>
      </div>

      {product.description && (
        <RichText html={product.description} className="text-sm text-muted-foreground" />
      )}

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

      {/* ── Control de Categoría / Línea (Adultos vs Infantil) ── */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Línea / Categoría
          </p>
          <span className="text-[11px] text-muted-foreground font-medium">
            {selectedLine === "infantil" ? "Tallas 0-3M a 16" : "Tallas XS a 3XL"}
          </span>
        </div>
        <div
          className="grid grid-cols-2 p-1 bg-muted/70 rounded-xl border border-border shadow-2xs"
          role="tablist"
          aria-label="Selección de línea de producto"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedLine === "adulto"}
            onClick={() => handleLineChange("adulto")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              selectedLine === "adulto"
                ? "bg-background text-foreground shadow-xs border border-border/80 scale-[1.01]"
                : "text-muted-foreground hover:text-foreground active:scale-95"
            }`}
          >
            <span>Adultos</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold transition-colors ${
                selectedLine === "adulto"
                  ? "bg-primary/10 text-primary dark:bg-primary/25 dark:text-accent"
                  : "text-muted-foreground/60"
              }`}
            >
              XS – 3XL
            </span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedLine === "infantil"}
            onClick={() => handleLineChange("infantil")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              selectedLine === "infantil"
                ? "bg-background text-foreground shadow-xs border border-border/80 scale-[1.01]"
                : "text-muted-foreground hover:text-foreground active:scale-95"
            }`}
          >
            <span>Infantil</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold transition-colors ${
                selectedLine === "infantil"
                  ? "bg-primary/10 text-primary dark:bg-primary/25 dark:text-accent"
                  : "text-muted-foreground/60"
              }`}
            >
              0-3M – 16
            </span>
          </button>
        </div>
      </div>

      {/* SELECCIÓN DE ESTILO */}
      {availableStylesForLine.length > 0 && (
        <div
          ref={styleSectionRef}
          className={`space-y-1.5 p-2 rounded-xl transition-all ${
            styleError && !style
              ? "ring-2 ring-destructive/80 bg-destructive/5"
              : ""
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">Estilo</p>
              {styleError && !style && (
                <span className="text-xs font-semibold text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  Por favor selecciona un estilo primero
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {availableStylesForLine.length} {availableStylesForLine.length === 1 ? "opción" : "opciones"}
            </span>
          </div>
          <div
            className="flex flex-wrap gap-2"
            role="radiogroup"
            aria-label="Estilos disponibles"
          >
            {availableStylesForLine.map((st) => {
              const isSelected = Boolean(style) && style.toLowerCase() === st.toLowerCase();
              /**
               * La disponibilidad del estilo NO debe depender de la talla
               * seleccionada: se evalúa contra las tallas propias de la línea del estilo.
               */
              const styleSizes = filterSizesForStyle(
                product.sizes,
                st,
                selectedLine === "infantil"
              );
              const isAvailable =
                style === st ||
                styleSizes.some((sz) =>
                  product.variants.some(
                    (v) =>
                      (!v.styleName || isStyleMatch(v.styleName, st)) &&
                      v.size.trim().toUpperCase() === sz.trim().toUpperCase() &&
                      (!colorName || v.colorName.toLowerCase() === colorName.toLowerCase()) &&
                      v.stock > 0
                  )
                ) ||
                product.allowCustomization;

              return (
                <button
                  key={st}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => {
                    // Se actualiza estilo y talla en el mismo clic para que el
                    // selector de Talla reaccione de inmediato a la nueva línea.
                    setStyle(st);
                    setStyleError(false);
                    setSize(
                      resolveSelectedSize(
                        size,
                        filterSizesForStyle(
                          product.sizes,
                          st,
                          selectedLine === "infantil"
                        )
                      )
                    );
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-xs font-bold scale-[1.01]"
                      : isAvailable
                      ? "bg-card border-border text-foreground hover:border-primary/60 hover:bg-secondary/40 cursor-pointer active:scale-95"
                      : "bg-muted/40 border-border/60 text-muted-foreground/60 opacity-60 hover:opacity-100 cursor-pointer"
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
          <div
            className="flex flex-wrap gap-2"
            role="radiogroup"
            aria-label="Materiales disponibles"
          >
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
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => isAvailable && setMaterial(mat)}
                  disabled={!isAvailable}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-xs font-bold scale-[1.01]"
                      : isAvailable
                      ? "bg-card border-border text-foreground hover:border-primary/60 hover:bg-secondary/40 cursor-pointer active:scale-95"
                      : "bg-muted/40 border-border/60 text-muted-foreground/40 opacity-40 cursor-not-allowed pointer-events-none line-through"
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
      <div className="p-3.5 rounded-xl border border-border/80 bg-card/70 dark:bg-card/40 backdrop-blur-xs space-y-2 shadow-2xs">
        <div className="flex items-center justify-between">
          <label htmlFor="embroidery-toggle" className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-bold text-foreground">
            <input
              id="embroidery-toggle"
              type="checkbox"
              checked={hasEmbroidery}
              onChange={(e) => setHasEmbroidery(e.target.checked)}
              className="h-4 w-4 rounded border-input text-primary focus:ring-ring cursor-pointer accent-primary"
            />
            <span>Incluir bordado de diseño (+ $7.000 COP)</span>
          </label>
          {hasEmbroidery && (
            <Badge className="bg-primary text-primary-foreground text-[10px] font-bold shadow-2xs">
              +$7.000 COP
            </Badge>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          ¿Quieres un diseño o texto personalizado a tu gusto?{" "}
          <Link href={customizeHref} className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">
            Dirígete a la sección de Personalización →
          </Link>
        </p>
      </div>

      {/* SELECCIÓN DE TALLA */}
      {visibleSizes.length > 0 && (
        <div
          onClickCapture={(e) => {
            if (!style) {
              e.preventDefault();
              e.stopPropagation();
              requireStyleSelection();
            }
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">Talla</p>
            <SizeGuideModal />
          </div>
          <SizeSelector
            sizes={visibleSizes}
            selected={size}
            onChange={(selectedSize) => {
              if (!requireStyleSelection()) return;
              setSize(selectedSize);
            }}
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

      <div
        className="flex flex-col gap-3 mt-2"
        onClickCapture={(e) => {
          if (!style) {
            e.preventDefault();
            e.stopPropagation();
            requireStyleSelection();
          }
        }}
      >
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
          disabled={!selectedCombinationAvailable || !style}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {product.allowCustomization && (
            <Button asChild variant="outline" className="w-full">
              <Link href={customizeHref}>
                <Sparkles className="mr-2 h-4 w-4 text-brand-olive-gold" />
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

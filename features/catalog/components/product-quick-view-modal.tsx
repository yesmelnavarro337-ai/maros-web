"use client";

import * as React from "react";
import { useState, useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  MessageCircle,
  Sparkles,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Loader2,
  Eye,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { cloudinaryUrl } from "@/lib/images/cloudinary";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { RichText } from "@/components/shared/rich-text";
import { useCart } from "@/features/cart/cart-context";
import {
  calculateProductPriceDetails,
  ADULT_STYLES,
  INFANTIL_STYLES,
} from "@/features/product-detail/utils/price-helpers";
import { filterImagesByColor } from "@/features/product-detail/utils/image-filter";
import { sortSizes } from "@/lib/sizes";
import {
  filterSizesForStyle,
  isInfantilCategory,
  isInfantilStyleName,
  resolveSelectedSize,
} from "@/features/product-detail/utils/size-helpers";

import type { ProductPreview } from "@/types/product";
import type {
  ProductDetail,
  ProductColorOption,
  ProductDetailImage,
} from "@/features/product-detail/types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface QuickViewModalProps {
  /** The preview product that triggered the modal (minimal data). */
  previewProduct: ProductPreview | null;
  /** Full product detail — may arrive asynchronously after open. */
  fullProduct: ProductDetail | null;
  /** Loading state while fetching full product detail. */
  isLoading?: boolean;
  /** Controls modal open/close. */
  isOpen: boolean;
  onClose: () => void;
  /**
   * Modo personalización: oculta los botones de compra ("Agregar al carrito" y
   * "Solicitar cotización") y permite interceptar el botón "Personalizar" con
   * `onPersonalize` en lugar de navegar a /personaliza. Por defecto `false`, de
   * modo que el catálogo y demás consumidores no cambian su comportamiento.
   */
  personalizeMode?: boolean;
  /** Callback al pulsar «Personalizar» cuando `personalizeMode` está activo. */
  onPersonalize?: (selection: PersonalizeSelection) => void;
}

/** Datos del modelo/estilo elegido que viajan al flujo de personalización. */
export interface PersonalizeSelection {
  id: string;
  slug: string;
  name: string;
  image: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  allowCustomization: boolean;
  customizationOptionIds: string[];
  styleName: string;
  materialName: string;
  colorName: string;
  size: string;
  quantity: number;
  basePrice: number;
  finalPrice: number;
  /** True si el usuario marcó «Incluir bordado de diseño» en la vista previa. */
  hasEmbroidery: boolean;
  /** Texto/idea de bordado opcional que viaje al asistente. */
  embroideryText?: string;
}

function isStyleMatch(vStyle?: string | null, targetStyle?: string | null): boolean {
  if (!vStyle || !targetStyle) return true;
  const vNorm = vStyle.trim().toLowerCase();
  const tNorm = targetStyle.trim().toLowerCase();
  if (vNorm === tNorm) return true;
  const cleanV = vNorm.replace(/\s*\([^)]*\)/g, "").trim();
  const cleanT = tNorm.replace(/\s*\([^)]*\)/g, "").trim();
  return cleanV === cleanT;
}

// ─── Color Swatch (supports solid + 50/50 gradient for combined colors) ──────

function QuickViewColorSwatch({
  color,
  isSelected,
  isDisabled,
  thumbnail,
  onClick,
}: {
  color: ProductColorOption;
  isSelected: boolean;
  isDisabled: boolean;
  thumbnail: string | null;
  onClick: () => void;
}) {
  const swatchBg =
    color.isCombined && color.secondaryHex
      ? `linear-gradient(135deg, ${color.primaryHex || color.hex} 50%, ${color.secondaryHex} 50%)`
      : color.primaryHex || color.hex || "#6B6832";

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      aria-label={color.name}
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        "relative w-14 h-[4.5rem] rounded-lg border-2 overflow-hidden transition-all flex-shrink-0 group/swatch text-left",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        isSelected && !isDisabled
          ? "border-primary ring-2 ring-primary/30 shadow-md scale-[1.04]"
          : "border-border hover:border-muted-foreground/40",
        isDisabled && "opacity-40 cursor-not-allowed"
      )}
      title={isDisabled ? `${color.name} — sin stock` : color.name}
    >
      {thumbnail ? (
        <div className="relative w-full h-full bg-secondary/30">
          <Image
            src={cloudinaryUrl(thumbnail)}
            alt={color.name}
            fill
            sizes="56px"
            className="object-cover transition-transform group-hover/swatch:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      ) : (
        <div
          className="w-full h-full relative"
          style={{ background: swatchBg }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      )}
      {thumbnail && (
        <span
          className="absolute top-1 right-1 w-3 h-3 rounded-full border border-white shadow-xs z-10"
          style={{ background: swatchBg }}
        />
      )}
      <span className="absolute bottom-0 inset-x-0 bg-black/55 backdrop-blur-[2px] text-[9px] text-white text-center py-0.5 truncate px-0.5 font-medium leading-tight z-10">
        {color.name}
      </span>
      {isDisabled && (
        <span className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <span className="h-[2px] w-10 bg-destructive/80 rotate-45 shadow-xs" />
        </span>
      )}
    </button>
  );
}

// ─── Mini Gallery ────────────────────────────────────────────────────────────

function QuickViewGallery({
  images,
  productName,
  selectedColorName,
  selectedColorHex,
}: {
  images: ProductDetailImage[];
  productName: string;
  selectedColorName?: string;
  selectedColorHex?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Filtro normalizado por color (mismo helper que la galería del detalle)
  const displayImages = useMemo<ProductDetailImage[]>(() => {
    return filterImagesByColor(images, {
      colorName: selectedColorName,
      colorHex: selectedColorHex,
    });
  }, [images, selectedColorName, selectedColorHex]);

  // Al cambiar de color (incluido un combinado) se muestra la primera imagen
  // del set filtrado. Se ajusta en el render comparando con la clave anterior
  // (patrón recomendado por React) en lugar de usar un effect.
  const filterKey = useMemo(
    () => displayImages.map((i) => i.url).join("|") + "|" + (selectedColorName ?? ""),
    [displayImages, selectedColorName]
  );
  const [previousFilterKey, setPreviousFilterKey] = useState(filterKey);
  if (previousFilterKey !== filterKey) {
    setPreviousFilterKey(filterKey);
    setActiveIndex(0);
  }

  const safeIndex =
    activeIndex < displayImages.length ? activeIndex : 0;
  const activeImage = displayImages[safeIndex];

  const step = (dir: 1 | -1) => {
    setActiveIndex(
      (prev) =>
        (prev + dir + displayImages.length) % displayImages.length
    );
  };

  return (
    <div className="flex gap-2.5 h-full self-start">
      {/* Thumbnail strip: acotado para no superar la altura de la imagen */}
      {displayImages.length > 1 && (
        <div className="hidden sm:flex flex-col gap-1.5 shrink-0 max-h-[min(500px,calc(90vh-3rem))] overflow-y-auto scrollbar-thin pr-0.5">
          {displayImages.map((img, i) => (
            <button
              key={`${img.url}-${i}`}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative h-14 w-14 rounded-lg bg-secondary flex items-center justify-center overflow-hidden border-2 transition-all shrink-0",
                i === safeIndex
                  ? "border-primary ring-2 ring-primary/20 scale-[1.03]"
                  : "border-transparent hover:border-muted-foreground/30"
              )}
              title={
                img.colorName
                  ? `Color: ${img.colorName}`
                  : `${productName} ${i + 1}`
              }
            >
              {img.url ? (
                <Image
                  src={cloudinaryUrl(img.url)}
                  alt={`${productName} ${i + 1}`}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              ) : (
                <ImageOff className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Main image: proporción fija 3/4 y alto acotado (500px o el espacio real
          disponible en el modal). No se estira con el panel derecho. */}
      <div
        className="relative flex-1 w-full min-w-0 aspect-[3/4] max-h-[500px] md:max-h-[min(500px,calc(90vh-3rem))] rounded-xl bg-secondary overflow-hidden select-none"
        style={{ touchAction: "pan-y" }}
      >
        {activeImage?.url ? (
          <Image
            src={cloudinaryUrl(activeImage.url)}
            alt={productName}
            fill
            priority={safeIndex < 2}
            sizes="(max-width: 1024px) 100vw, 400px"
            className="object-cover transform-gpu transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="h-10 w-10 text-muted-foreground" />
          </div>
        )}

        {/* Nav arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md backdrop-blur-sm h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-10"
              aria-label="Foto anterior"
              onClick={() => step(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md backdrop-blur-sm h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-10"
              aria-label="Foto siguiente"
              onClick={() => step(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-[10px] text-white/90 z-10">
              {safeIndex + 1} / {displayImages.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Loading Skeleton ────────────────────────────────────────────────────────

function QuickViewSkeleton({ previewImage, productName }: { previewImage?: string; productName: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
      {/* Left: image placeholder */}
      <div className="relative aspect-[3/4] max-h-[500px] md:max-h-[min(500px,calc(90vh-3rem))] rounded-xl bg-secondary overflow-hidden">
        {previewImage ? (
          <Image
            src={cloudinaryUrl(previewImage)}
            alt={productName}
            fill
            className="object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      </div>
      {/* Right: skeleton blocks */}
      <div className="flex flex-col gap-4 py-2">
        <div className="h-6 bg-secondary rounded w-3/4" />
        <div className="h-8 bg-secondary rounded w-1/3" />
        <div className="h-4 bg-secondary rounded w-full" />
        <div className="h-4 bg-secondary rounded w-5/6" />
        <div className="flex gap-2 mt-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 w-14 rounded-lg bg-secondary" />
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-9 w-12 rounded-md bg-secondary" />
          ))}
        </div>
        <div className="h-12 bg-secondary rounded-lg mt-auto" />
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function ProductQuickViewModal({
  previewProduct,
  fullProduct,
  isLoading,
  isOpen,
  onClose,
  personalizeMode = false,
  onPersonalize,
}: QuickViewModalProps) {
  const { addItem } = useCart();

  const product = fullProduct;
  const productName = product?.name || previewProduct?.name || "";

  // ── Color state ──
  const availableColors = useMemo<ProductColorOption[]>(() => {
    if (!product) return [];
    const colorMap = new Map<string, ProductColorOption>();
    product.colors?.forEach((c) => {
      if (c.name && !colorMap.has(c.name.trim().toLowerCase())) {
        colorMap.set(c.name.trim().toLowerCase(), {
          name: c.name.trim(),
          hex: c.primaryHex || c.hex || "#6B6832",
          primaryHex: c.primaryHex || c.hex || "#6B6832",
          secondaryHex: c.secondaryHex || null,
          isCombined: Boolean(c.isCombined || c.secondaryHex),
        });
      }
    });
    product.variants?.forEach((v) => {
      const name = (v.colorName || "").trim();
      if (name && !colorMap.has(name.toLowerCase())) {
        colorMap.set(name.toLowerCase(), {
          name,
          hex: v.primaryHex || v.colorHex || "#6B6832",
          primaryHex: v.primaryHex || v.colorHex || "#6B6832",
          secondaryHex: v.secondaryHex || null,
          isCombined: Boolean(v.isCombined || v.secondaryHex),
        });
      }
    });
    return Array.from(colorMap.values());
  }, [product]);

  const [selectedColorName, setSelectedColorName] = useState("");

  const selectedColorObj = useMemo(
    () =>
      availableColors.find(
        (c) => c.name.toLowerCase() === selectedColorName.toLowerCase()
      ) ??
      availableColors[0] ??
      null,
    [availableColors, selectedColorName]
  );

  // ── Selector de Categoría (Adultos vs Infantil) ──
  const isProductCategoryInfantil = isInfantilCategory(product?.categoryName);
  const initialCandidate = product?.styles?.[0] ?? "";
  const initialLine: "adulto" | "infantil" =
    isProductCategoryInfantil || (initialCandidate ? isInfantilStyleName(initialCandidate) : false)
      ? "infantil"
      : "adulto";

  const [selectedLine, setSelectedLine] = useState<"adulto" | "infantil">(initialLine);

  const availableStylesForLine = useMemo(() => {
    const rawStyles = product?.styles && product.styles.length > 0 ? product.styles : [];
    const filtered = rawStyles.filter((st) =>
      selectedLine === "infantil" ? isInfantilStyleName(st) : !isInfantilStyleName(st)
    );

    if (filtered.length > 0) return filtered;

    return selectedLine === "infantil"
      ? INFANTIL_STYLES.map((s) => s.name)
      : ADULT_STYLES.map((s) => s.name);
  }, [product?.styles, selectedLine]);

  // ── Size, Style, Material, Quantity, Embroidery states ──
  const initialStyle = useMemo(() => {
    const rawStyles = product?.styles && product.styles.length > 0 ? product.styles : [];
    const filtered = rawStyles.filter((st) =>
      initialLine === "infantil" ? isInfantilStyleName(st) : !isInfantilStyleName(st)
    );
    const finalStyles =
      filtered.length > 0
        ? filtered
        : initialLine === "infantil"
        ? INFANTIL_STYLES.map((s) => s.name)
        : ADULT_STYLES.map((s) => s.name);
    return finalStyles[0] ?? "";
  }, [product?.styles, initialLine]);

  const [selectedStyle, setSelectedStyle] = useState<string>(initialStyle);

  const initialSizes = useMemo(() => {
    return filterSizesForStyle(product?.sizes ?? [], initialStyle, initialLine === "infantil");
  }, [product?.sizes, initialStyle, initialLine]);

  const [selectedSize, setSelectedSize] = useState<string>(() => initialSizes[0] ?? "");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [hasEmbroidery, setHasEmbroidery] = useState(false);

  // Auto-selección defensiva de estilo en el modal
  useEffect(() => {
    const isCurrentValid =
      Boolean(selectedStyle) &&
      availableStylesForLine.some((st) => st.toLowerCase() === selectedStyle.toLowerCase());

    if (!isCurrentValid && availableStylesForLine.length > 0) {
      const defaultStyle = availableStylesForLine[0];
      setSelectedStyle(defaultStyle);
      const nextSizes = filterSizesForStyle(
        product?.sizes ?? [],
        defaultStyle,
        selectedLine === "infantil"
      );
      setSelectedSize((prev) => resolveSelectedSize(prev, nextSizes));
    }
  }, [availableStylesForLine, selectedStyle, product?.sizes, selectedLine]);

  /**
   * Cada vez que cambia el producto (apertura del modal o cambio de preview con
   * el modal abierto) las selecciones vuelven a sus valores iniciales acordes a la línea.
   */
  const [previousProductId, setPreviousProductId] = useState<string | number | undefined>(product?.id);
  if (previousProductId !== product?.id) {
    setPreviousProductId(product?.id);
    const prodInfantil = isInfantilCategory(product?.categoryName);
    const prodFirstStyle = product?.styles?.[0] ?? "";
    const nextLine: "adulto" | "infantil" =
      prodInfantil || (prodFirstStyle ? isInfantilStyleName(prodFirstStyle) : false)
        ? "infantil"
        : "adulto";
    setSelectedLine(nextLine);

    const nextStyles = (product?.styles && product.styles.length > 0 ? product.styles : [])
      .filter((st) => nextLine === "infantil" ? isInfantilStyleName(st) : !isInfantilStyleName(st));
    const finalStyles = nextStyles.length > 0
      ? nextStyles
      : (nextLine === "infantil" ? INFANTIL_STYLES.map((s) => s.name) : ADULT_STYLES.map((s) => s.name));
    const nextStyle = finalStyles[0] ?? "";

    setSelectedColorName(availableColors[0]?.name ?? "");
    setSelectedStyle(nextStyle);
    const initialLineSizes = filterSizesForStyle(product?.sizes ?? [], nextStyle, nextLine === "infantil");
    setSelectedSize(sortSizes(initialLineSizes)[0] ?? "");
    setSelectedMaterial(product?.materials?.[0] ?? "");
    setQuantity(1);
    setHasEmbroidery(false);
  }

  const handleLineChange = (newLine: "adulto" | "infantil") => {
    if (newLine === selectedLine) return;
    setSelectedLine(newLine);

    const rawStyles = product?.styles && product.styles.length > 0 ? product.styles : [];
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
    setSelectedStyle(nextStyle);

    const nextSizes = filterSizesForStyle(
      product?.sizes ?? [],
      nextStyle,
      newLine === "infantil"
    );
    setSelectedSize(resolveSelectedSize(selectedSize, nextSizes));
  };

  /**
   * El estilo y la línea seleccionada determinan el catálogo de tallas:
   * Adultos: XS a 3XL | Infantil: 0-3M a 16.
   */
  const visibleSizes = useMemo(() => {
    if (!product) return [];
    return filterSizesForStyle(
      product.sizes,
      selectedStyle,
      selectedLine === "infantil"
    );
  }, [product, selectedStyle, selectedLine]);

  // Al cambiar de estilo se selecciona la primera talla del nuevo rango para no
  // dejar una talla que ya no existe en el catálogo vigente.
  const [previousVisibleSizes, setPreviousVisibleSizes] = useState(visibleSizes);
  if (previousVisibleSizes !== visibleSizes) {
    setPreviousVisibleSizes(visibleSizes);
    setSelectedSize((prev) => resolveSelectedSize(prev, visibleSizes));
  }

  // ── Image details ──
  const allImageDetails = useMemo<ProductDetailImage[]>(() => {
    if (!product) return [];
    if (product.imageDetails && product.imageDetails.length > 0) {
      return product.imageDetails;
    }
    return (product.images || []).map((url, idx) => ({ url, order: idx }));
  }, [product]);

  // ── Variant availability ──
  const selectedVariant = useMemo(() => {
    if (!product) return undefined;
    return (
      product.variants.find(
        (v) =>
          (!selectedSize || v.size.trim().toUpperCase() === selectedSize.trim().toUpperCase()) &&
          (selectedColorObj?.name
            ? v.colorName.toLowerCase() === selectedColorObj.name.toLowerCase()
            : true) &&
          (!selectedStyle || isStyleMatch(v.styleName, selectedStyle)) &&
          (!selectedMaterial || !v.materialName || v.materialName.toLowerCase() === selectedMaterial.toLowerCase())
      ) ||
      product.variants.find(
        (v) =>
          (!selectedSize || v.size.trim().toUpperCase() === selectedSize.trim().toUpperCase()) &&
          (selectedColorObj?.name
            ? v.colorName.toLowerCase() === selectedColorObj.name.toLowerCase()
            : true)
      )
    );
  }, [product, selectedSize, selectedColorObj, selectedStyle, selectedMaterial]);

  const disabledSizes = useMemo(() => {
    if (!product) return [];
    if (!selectedStyle) return visibleSizes;
    return visibleSizes.filter(
      (s) =>
        !product.variants.some(
          (v) =>
            v.size.trim().toUpperCase() === s.trim().toUpperCase() &&
            (!selectedColorName || v.colorName.toLowerCase() === selectedColorName.toLowerCase()) &&
            (!v.styleName || isStyleMatch(v.styleName, selectedStyle)) &&
            (!selectedMaterial || !v.materialName || v.materialName.toLowerCase() === selectedMaterial.toLowerCase()) &&
            v.stock > 0
        ) && !product.allowCustomization
    );
  }, [product, visibleSizes, selectedColorName, selectedStyle, selectedMaterial]);

  const disabledColors = useMemo(() => {
    if (!product) return [];
    return availableColors
      .filter((c) => {
        const v = product.variants.find(
          (v) =>
            (!selectedSize || v.size === selectedSize) &&
            v.colorName.toLowerCase() === c.name.toLowerCase() &&
            (!selectedStyle || !v.styleName || v.styleName.toLowerCase() === selectedStyle.toLowerCase()) &&
            (!selectedMaterial || !v.materialName || v.materialName.toLowerCase() === selectedMaterial.toLowerCase())
        );
        return v ? v.stock <= 0 : false;
      })
      .map((c) => c.name.toLowerCase());
  }, [product, selectedSize, availableColors, selectedStyle, selectedMaterial]);

  // Color thumbnails for color swatches
  const colorThumbnails = useMemo(() => {
    const map = new Map<string, string>();
    allImageDetails.forEach((img) => {
      const name = (
        img.colorName ||
        img.color?.name ||
        ""
      )
        .trim()
        .toLowerCase();
      if (name && !map.has(name) && img.url) {
        map.set(name, img.url);
      }
    });
    return map;
  }, [allImageDetails]);

  const canAddToCart =
    product && (selectedVariant?.stock ?? 0) > 0;

  const priceDetails = calculateProductPriceDetails({
    basePrice: product?.basePrice ?? previewProduct?.price,
    variantPrice: selectedVariant?.price,
    categoryName: selectedLine === "infantil" ? "Infantil" : product?.categoryName,
    styleName: selectedStyle || selectedVariant?.styleName,
    size: selectedSize,
    hasEmbroidery,
  });

  const finalPrice = priceDetails.finalPrice;

  // En modo personalización el botón «Personalizar» no navega: entrega el estilo
  // elegido con su precio real (base del estilo) y la página avanza al paso 2.
  const handlePersonalize = useCallback(() => {
    if (!product || !onPersonalize) return;
    onPersonalize({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images?.[0] ?? "",
      sizes: visibleSizes,
      colors: (product.colors ?? []).map((c) => ({
        name: c.name,
        hex: c.primaryHex || c.hex,
      })),
      allowCustomization: product.allowCustomization ?? false,
      customizationOptionIds: product.customizationOptionIds ?? [],
      styleName: selectedStyle || selectedVariant?.styleName || "",
      materialName: selectedMaterial,
      colorName: selectedColorObj?.name ?? "",
      size: selectedSize,
      quantity,
      basePrice: priceDetails.basePrice,
      finalPrice: priceDetails.finalPrice,
      hasEmbroidery,
    });
  }, [
    product,
    onPersonalize,
    selectedStyle,
    selectedVariant,
    selectedMaterial,
    selectedColorObj,
    selectedSize,
    quantity,
    priceDetails.basePrice,
    priceDetails.finalPrice,
    hasEmbroidery,
  ]);

  // ── Action URLs ──
  // La ruta real es /personaliza (no /personalizacion). El producto viaja en
  // `product` para que esa página lo auto-seleccione.
  const personalizeParams = new URLSearchParams({
    product: product?.slug ?? "",
    talla: selectedSize,
    color: selectedColorObj?.name ?? "",
    estilo: selectedStyle,
    material: selectedMaterial,
    cantidad: String(quantity),
    // Arrastra el estado del checklist de bordado y aterriza directo en el paso 2
    // (tela) para no obligar a re-elegir el modelo.
    bordado: hasEmbroidery ? "1" : "0",
    paso: "tela",
  });
  const customizeHref = product ? `/personaliza?${personalizeParams.toString()}` : "#";
  // /cotizar sigue leyendo el parámetro `producto`: se mantiene por compatibilidad.
  const quoteParams = new URLSearchParams(personalizeParams);
  quoteParams.set("producto", product?.slug ?? "");
  quoteParams.delete("product");
  // `bordado`/`paso` son solo para el flujo de personalización; no aplican a /cotizar.
  quoteParams.delete("bordado");
  quoteParams.delete("paso");
  const quoteHref = product ? `/cotizar?${quoteParams.toString()}` : "#";
  const productHref = product
    ? `/productos/${product.slug}`
    : previewProduct
      ? `/productos/${previewProduct.slug}`
      : "#";

  const handleAddToCart = useCallback(() => {
    if (!product || !canAddToCart) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: finalPrice,
      image: product.images?.[0] ?? "",
      size: selectedSize,
      colorName: selectedColorObj?.name ?? "",
      colorHex: selectedColorObj?.primaryHex ?? selectedColorObj?.hex ?? "",
      quantity,
    });
    toast.success(`${product.name} (${selectedSize}) agregado al carrito`);
    onClose();
  }, [product, canAddToCart, addItem, finalPrice, selectedSize, selectedColorObj, quantity, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        // En móvil (<md) las columnas se apilan y el modal entero hace scroll;
        // en md+ el modal se recorta y el panel derecho scrollea por dentro.
        className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto md:overflow-hidden rounded-2xl border-border/60 p-0"
        showCloseButton
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{productName || "Vista previa"}</DialogTitle>
          <DialogDescription>
            Vista previa rápida del producto
          </DialogDescription>
        </DialogHeader>

        {/* Loading state */}
        {(isLoading || !product) && previewProduct ? (
          <div className="p-6">
            <QuickViewSkeleton previewImage={previewProduct.image} productName={previewProduct.name} />
          </div>
        ) : !product ? null : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:items-start">
            {/* ═══ Left Column: Gallery ═══ */}
            <div className="p-4 sm:p-5 bg-secondary/20 md:self-start">
              <QuickViewGallery
                images={allImageDetails}
                productName={product.name}
                selectedColorName={selectedColorObj?.name}
                selectedColorHex={selectedColorObj?.hex}
              />
            </div>

            {/* ═══ Right Column: Info + Controls ═══ */}
            {/* Panel con scroll propio en md+: la columna de la imagen queda fija
                sin deformarse. En móvil el scroll lo hace el modal completo. */}
            <div className="flex flex-col gap-4 p-5 sm:p-6 scroll-smooth custom-scrollbar md:max-h-[80vh] md:overflow-y-auto md:pr-3">
              {/* Title + Category */}
              <div>
                <Badge variant="secondary" className="mb-1.5 text-[10px]">
                  {product.categoryName}
                </Badge>
                <h2 className="font-heading text-xl sm:text-2xl text-foreground leading-tight">
                  {product.name}
                </h2>
                {product.description && (
                  <RichText
                    html={product.description}
                    className="text-xs sm:text-sm text-muted-foreground mt-1.5 line-clamp-2"
                  />
                )}
              </div>

              {/* Price */}
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-2xl font-bold text-foreground">
                    ${priceDetails.finalPrice.toLocaleString("es-CO")} COP
                  </span>
                  {priceDetails.hasDiscount && (
                    <span className="text-xs text-muted-foreground line-through">
                      ${priceDetails.subtotalPrice.toLocaleString("es-CO")} COP
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                  {priceDetails.hasDiscount && (
                    <Badge variant="secondary" className="bg-primary text-primary-foreground border-transparent text-[10px] shadow-xs">
                      <Sparkles className="h-2.5 w-2.5 mr-1 text-accent" />
                      5% OFF
                    </Badge>
                  )}
                  {priceDetails.isPlusSize && (
                    <Badge variant="secondary" className="bg-amber-100/90 text-amber-900 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800/60 text-[10px] shadow-xs">
                      Talla {selectedSize} (+${priceDetails.sizeSurcharge.toLocaleString("es-CO")} COP)
                    </Badge>
                  )}

                  {priceDetails.hasEmbroidery && (
                    <Badge variant="secondary" className="bg-emerald-100/90 text-emerald-900 border-emerald-300/80 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800/60 text-[10px] shadow-xs">
                      Bordado Incluido (+$7.000 COP)
                    </Badge>
                  )}
                </div>
              </div>

              {/* ── Color Selector ── */}
              {availableColors.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-foreground mb-1.5">
                    Color:{" "}
                    <span className="font-semibold capitalize">
                      {selectedColorObj?.name || ""}
                    </span>
                  </p>
                  <div
                    className="flex flex-wrap gap-2"
                    role="radiogroup"
                    aria-label="Colores disponibles"
                  >
                    {availableColors.map((color) => (
                      <QuickViewColorSwatch
                        key={color.name}
                        color={color}
                        isSelected={
                          selectedColorObj?.name?.toLowerCase() ===
                          color.name.toLowerCase()
                        }
                        isDisabled={disabledColors.includes(
                          color.name.toLowerCase()
                        )}
                        thumbnail={
                          colorThumbnails.get(color.name.toLowerCase()) ?? null
                        }
                        onClick={() => setSelectedColorName(color.name)}
                      />
                    ))}
                  </div>
                </div>
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
                    className={cn(
                      "flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      selectedLine === "adulto"
                        ? "bg-background text-foreground shadow-xs border border-border/80 scale-[1.01]"
                        : "text-muted-foreground hover:text-foreground active:scale-95"
                    )}
                  >
                    <span>Adultos</span>
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.2 rounded-full font-semibold transition-colors",
                        selectedLine === "adulto"
                          ? "bg-primary/10 text-primary dark:bg-primary/25 dark:text-accent"
                          : "text-muted-foreground/60"
                      )}
                    >
                      XS – 3XL
                    </span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={selectedLine === "infantil"}
                    onClick={() => handleLineChange("infantil")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      selectedLine === "infantil"
                        ? "bg-background text-foreground shadow-xs border border-border/80 scale-[1.01]"
                        : "text-muted-foreground hover:text-foreground active:scale-95"
                    )}
                  >
                    <span>Infantil</span>
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.2 rounded-full font-semibold transition-colors",
                        selectedLine === "infantil"
                          ? "bg-primary/10 text-primary dark:bg-primary/25 dark:text-accent"
                          : "text-muted-foreground/60"
                      )}
                    >
                      0-3M – 16
                    </span>
                  </button>
                </div>
              </div>

              {/* ── Estilo Selector ── */}
              {availableStylesForLine.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-medium text-foreground">
                      Estilo
                    </p>
                    <span className="text-[11px] text-muted-foreground">
                      {availableStylesForLine.length} {availableStylesForLine.length === 1 ? "opción" : "opciones"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Estilos disponibles">
                    {availableStylesForLine.map((st) => {
                      const isSelected = selectedStyle.toLowerCase() === st.toLowerCase();
                      const styleSizes = filterSizesForStyle(
                        product.sizes,
                        st,
                        selectedLine === "infantil"
                      );
                      const isAvailable =
                        selectedStyle === st ||
                        styleSizes.some((sz) =>
                          product.variants.some(
                            (v) =>
                              (!v.styleName || v.styleName.toLowerCase() === st.toLowerCase()) &&
                              v.size === sz &&
                              (!selectedColorName ||
                                v.colorName.toLowerCase() === selectedColorName.toLowerCase()) &&
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
                            setSelectedStyle(st);
                            setSelectedSize(
                              resolveSelectedSize(
                                selectedSize,
                                filterSizesForStyle(
                                  product.sizes,
                                  st,
                                  selectedLine === "infantil"
                                )
                              )
                            );
                          }}
                          className={cn(
                            "px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary shadow-xs font-bold scale-[1.01]"
                              : isAvailable
                              ? "bg-card border-border text-foreground hover:border-primary/60 hover:bg-secondary/40 cursor-pointer active:scale-95"
                              : "bg-muted/40 border-border/60 text-muted-foreground/60 opacity-60 hover:opacity-100 cursor-pointer"
                          )}
                        >
                          {st}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Material Selector ── */}
              {product.materials && product.materials.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-foreground mb-1.5">
                    Material
                  </p>
                  <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Materiales disponibles">
                    {product.materials.map((mat) => {
                      const isSelected = selectedMaterial.toLowerCase() === mat.toLowerCase();
                      const isAvailable = product.variants.some(
                        (v) =>
                          (!v.materialName || v.materialName.toLowerCase() === mat.toLowerCase()) &&
                          (!selectedSize || v.size === selectedSize) &&
                          (!selectedColorName || v.colorName.toLowerCase() === selectedColorName.toLowerCase()) &&
                          (!selectedStyle || !v.styleName || v.styleName.toLowerCase() === selectedStyle.toLowerCase()) &&
                          v.stock > 0
                      );
                      return (
                        <button
                          key={mat}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          disabled={!isAvailable}
                          onClick={() => isAvailable && setSelectedMaterial(mat)}
                          className={cn(
                            "h-9 px-3.5 rounded-lg border text-xs font-semibold transition-all duration-150 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary shadow-xs font-bold scale-[1.01]"
                              : isAvailable
                              ? "bg-card border-border text-foreground hover:border-primary/60 hover:bg-secondary/40 cursor-pointer active:scale-95"
                              : "opacity-35 cursor-not-allowed line-through bg-muted/40 pointer-events-none"
                          )}
                        >
                          {mat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── OPCIÓN DE BORDADO (+ $7.000 COP) ── */}
              <div className="p-3 rounded-xl border border-border/80 bg-card/70 dark:bg-card/40 backdrop-blur-xs space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label htmlFor="qv-embroidery-toggle" className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-foreground">
                    <input
                      id="qv-embroidery-toggle"
                      type="checkbox"
                      checked={hasEmbroidery}
                      onChange={(e) => setHasEmbroidery(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-input text-primary focus:ring-ring cursor-pointer accent-primary"
                    />
                    <span>Incluir bordado de diseño (+ $7.000 COP)</span>
                  </label>
                  {hasEmbroidery && (
                    <Badge className="bg-primary text-primary-foreground text-[9px] font-bold shadow-2xs">
                      +$7.000 COP
                    </Badge>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  ¿Quieres un diseño o texto personalizado a tu gusto?{" "}
                  <Link href={customizeHref} className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">
                    Personalización →
                  </Link>
                </p>
              </div>

              {/* ── Size Selector (pills) ── */}
              {visibleSizes.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-foreground mb-1.5">
                    Talla
                  </p>
                  <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Tallas disponibles">
                    {visibleSizes.map((s) => {
                      const isDisabled = disabledSizes.includes(s);
                      const isSelected = selectedSize === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          disabled={isDisabled}
                          onClick={() => !isDisabled && setSelectedSize(s)}
                          className={cn(
                            "h-9 min-w-[2.75rem] px-3.5 rounded-lg border text-xs font-semibold transition-all duration-150 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            isSelected && !isDisabled
                              ? "bg-primary text-primary-foreground border-primary shadow-xs font-bold scale-[1.02]"
                              : "bg-card border-border text-foreground hover:border-primary/60 hover:bg-secondary/40 cursor-pointer active:scale-95",
                            isDisabled &&
                              "opacity-40 cursor-not-allowed line-through bg-muted/40 pointer-events-none"
                          )}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Quantity Stepper ── */}
              <div>
                <p className="text-xs font-medium text-foreground mb-1.5">
                  Cantidad
                </p>
                <div className="inline-flex items-center gap-0 rounded-lg border border-border overflow-hidden">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.max(1, q - 1))
                    }
                    disabled={quantity <= 1}
                    className="h-9 w-9 flex items-center justify-center text-foreground hover:bg-secondary transition-colors disabled:opacity-40"
                    aria-label="Reducir cantidad"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="h-9 w-10 flex items-center justify-center text-sm font-semibold text-foreground border-x border-border bg-card">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.min(99, q + 1))
                    }
                    disabled={quantity >= 99}
                    className="h-9 w-9 flex items-center justify-center text-foreground hover:bg-secondary transition-colors disabled:opacity-40"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Out of stock notice */}
              {selectedVariant && selectedVariant.stock <= 0 && (
                <p className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">
                  Agotado — esta combinación de talla y color no tiene stock.
                </p>
              )}

              {/* ── Action buttons ── */}
              <div className="flex flex-col gap-2.5 mt-auto pt-3 border-t border-border/60">
                {!personalizeMode && (
                  <>
                    <Button
                      size="lg"
                      className="w-full h-11 bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90 text-sm font-semibold"
                      disabled={!canAddToCart}
                      onClick={handleAddToCart}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Agregar al carrito
                    </Button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                      >
                        <Link href={quoteHref}>
                          <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                          Solicitar cotización
                        </Link>
                      </Button>

                      {product.allowCustomization && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="w-full text-xs text-primary border-primary/30 hover:bg-primary/5"
                        >
                          <Link href={customizeHref}>
                            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                            Personalizar
                          </Link>
                        </Button>
                      )}
                    </div>
                  </>
                )}

                {personalizeMode && product.allowCustomization && (
                  <>
                    {onPersonalize ? (
                      <Button
                        size="lg"
                        className="w-full h-11 bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90 text-sm font-semibold"
                        onClick={handlePersonalize}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Personalizar
                      </Button>
                    ) : (
                      <Button
                        asChild
                        size="lg"
                        className="w-full h-11 bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90 text-sm font-semibold"
                      >
                        <Link href={customizeHref}>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Personalizar
                        </Link>
                      </Button>
                    )}
                  </>
                )}

                {/* Link to full product page */}
                <Link
                  href={productHref}
                  className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Ver todos los detalles
                </Link>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
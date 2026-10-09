"use client";

import * as React from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
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
import { useCart } from "@/features/cart/cart-context";
import { calculateProductPriceDetails } from "@/features/product-detail/utils/price-helpers";
import { filterImagesByColor } from "@/features/product-detail/utils/image-filter";
import { sortSizes } from "@/lib/sizes";
import {
  filterSizesForStyle,
  isInfantilCategory,
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
  styleName: string;
  materialName: string;
  colorName: string;
  size: string;
  quantity: number;
  basePrice: number;
  finalPrice: number;
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
  // del set filtrado.
  useEffect(() => {
    setActiveIndex(0);
  }, [displayImages, selectedColorName]);

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

  // Reset selections when product changes
  useEffect(() => {
    if (availableColors.length > 0) {
      setSelectedColorName(availableColors[0].name);
    } else {
      setSelectedColorName("");
    }
    setSelectedSize("");
    setQuantity(1);
  }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedColorObj = useMemo(
    () =>
      availableColors.find(
        (c) => c.name.toLowerCase() === selectedColorName.toLowerCase()
      ) ??
      availableColors[0] ??
      null,
    [availableColors, selectedColorName]
  );

  // ── Size, Style, Material, Quantity, Embroidery states ──
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [hasEmbroidery, setHasEmbroidery] = useState(false);

  useEffect(() => {
    if (product?.sizes?.length && !selectedSize) {
      // Orden canónico: la talla inicial es la más pequeña del catálogo.
      setSelectedSize(sortSizes(product.sizes)[0]);
    }
    if (product?.styles?.length && !selectedStyle) {
      setSelectedStyle(product.styles[0]);
    }
    if (product?.materials?.length && !selectedMaterial) {
      setSelectedMaterial(product.materials[0]);
    }
  }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * El estilo seleccionado determina la línea del producto y, con ella, el
   * catálogo de tallas: un estilo infantil no muestra tallas de adulto y viceversa.
   */
  const visibleSizes = useMemo(() => {
    if (!product) return [];
    return filterSizesForStyle(
      product.sizes,
      selectedStyle,
      isInfantilCategory(product.categoryName)
    );
  }, [product, selectedStyle]);

  // Al cambiar de estilo se selecciona la primera talla del nuevo rango para no
  // dejar una talla que ya no existe en el catálogo vigente.
  useEffect(() => {
    setSelectedSize((prev) => resolveSelectedSize(prev, visibleSizes));
  }, [visibleSizes]);

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
          (!selectedSize || v.size === selectedSize) &&
          (selectedColorObj?.name
            ? v.colorName.toLowerCase() === selectedColorObj.name.toLowerCase()
            : true) &&
          (!selectedStyle || !v.styleName || v.styleName.toLowerCase() === selectedStyle.toLowerCase()) &&
          (!selectedMaterial || !v.materialName || v.materialName.toLowerCase() === selectedMaterial.toLowerCase())
      ) ||
      product.variants.find(
        (v) =>
          (!selectedSize || v.size === selectedSize) &&
          (selectedColorObj?.name
            ? v.colorName.toLowerCase() === selectedColorObj.name.toLowerCase()
            : true)
      )
    );
  }, [product, selectedSize, selectedColorObj, selectedStyle, selectedMaterial]);

  const disabledSizes = useMemo(() => {
    if (!product) return [];
    return visibleSizes.filter(
      (s) =>
        !product.variants.some(
          (v) =>
            v.size === s &&
            (!selectedColorName || v.colorName.toLowerCase() === selectedColorName.toLowerCase()) &&
            (!selectedStyle || !v.styleName || v.styleName.toLowerCase() === selectedStyle.toLowerCase()) &&
            (!selectedMaterial || !v.materialName || v.materialName.toLowerCase() === selectedMaterial.toLowerCase()) &&
            v.stock > 0
        )
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
        (img as any).color?.name ||
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
    categoryName: product?.categoryName,
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
      sizes: product.sizes ?? [],
      colors: (product.colors ?? []).map((c) => ({
        name: c.name,
        hex: c.primaryHex || c.hex,
      })),
      allowCustomization: product.allowCustomization ?? false,
      styleName: selectedStyle || selectedVariant?.styleName || "",
      materialName: selectedMaterial,
      colorName: selectedColorObj?.name ?? "",
      size: selectedSize,
      quantity,
      basePrice: priceDetails.basePrice,
      finalPrice: priceDetails.finalPrice,
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
  });
  const customizeHref = product ? `/personaliza?${personalizeParams.toString()}` : "#";
  // /cotizar sigue leyendo el parámetro `producto`: se mantiene por compatibilidad.
  const quoteParams = new URLSearchParams(personalizeParams);
  quoteParams.set("producto", product?.slug ?? "");
  quoteParams.delete("product");
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
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 line-clamp-2">
                    {product.description}
                  </p>
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
                    <Badge variant="secondary" className="bg-[#34351F] text-white border-[#34351F] text-[10px]">
                      <Sparkles className="h-2.5 w-2.5 mr-1 text-[#B6AE3A]" />
                      5% OFF
                    </Badge>
                  )}
                  {priceDetails.isPlusSize && (
                    <Badge variant="secondary" className="bg-amber-100/80 text-amber-900 border-amber-200/60 text-[10px]">
                      Talla {selectedSize} (+ $10.000 COP)
                    </Badge>
                  )}
                  {priceDetails.isInfantilYouthSize && (
                    <Badge variant="secondary" className="bg-sky-100/80 text-sky-900 border-sky-200/60 text-[10px]">
                      Talla {selectedSize} (Juvenil + $10.000 COP)
                    </Badge>
                  )}
                  {priceDetails.hasEmbroidery && (
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-900 border-emerald-300 text-[10px]">
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

              {/* ── Estilo Selector ── */}
              {product.styles && product.styles.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-foreground mb-1.5">
                    Estilo
                  </p>
                  <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Estilos disponibles">
                    {product.styles.map((st) => {
                      const isSelected = selectedStyle.toLowerCase() === st.toLowerCase();
                      /**
                       * La disponibilidad del estilo NO debe depender de la talla
                       * seleccionada: si se evaluara contra la talla actual, cambiar
                       * de línea dejaría el botón sin stock y por tanto inclicable
                       * (deadlock). Se evalúa contra las tallas propias del estilo.
                       */
                      const styleSizes = filterSizesForStyle(
                        product.sizes,
                        st,
                        isInfantilCategory(product.categoryName)
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
                        );
                      return (
                        <button
                          key={st}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          disabled={!isAvailable}
                          onClick={() => {
                            if (!isAvailable) return;
                            // Estilo y talla se actualizan en el mismo clic para
                            // que el grupo de Tallas reaccione de inmediato.
                            setSelectedStyle(st);
                            setSelectedSize(
                              resolveSelectedSize(
                                selectedSize,
                                filterSizesForStyle(
                                  product.sizes,
                                  st,
                                  isInfantilCategory(product.categoryName)
                                )
                              )
                            );
                          }}
                          className={cn(
                            "px-4 py-2 rounded-xl text-xs font-semibold border transition-all shadow-2xs",
                            isSelected
                              ? "bg-[#34351F] text-white border-[#34351F] shadow-xs font-bold"
                              : isAvailable
                              ? "bg-white border-neutral-200 text-neutral-800 hover:border-[#34351F]/60 cursor-pointer"
                              : "opacity-40 cursor-not-allowed line-through bg-neutral-100/60 pointer-events-none"
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
                            "h-9 px-3.5 rounded-lg border text-xs font-semibold transition-all shadow-2xs",
                            isSelected
                              ? "bg-[#8B7D4E] text-white border-[#8B7D4E] shadow-xs"
                              : isAvailable
                              ? "bg-card border-border text-foreground hover:border-[#8B7D4E]/50 cursor-pointer"
                              : "opacity-35 cursor-not-allowed line-through bg-neutral-100/60 pointer-events-none"
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
              <div className="p-3 rounded-xl border border-[#34351F]/15 bg-[#FAF9F4] space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="qv-embroidery-toggle" className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-neutral-800">
                    <input
                      id="qv-embroidery-toggle"
                      type="checkbox"
                      checked={hasEmbroidery}
                      onChange={(e) => setHasEmbroidery(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-neutral-300 text-[#34351F] focus:ring-[#34351F] cursor-pointer"
                    />
                    <span>Incluir bordado de diseño (+ $7.000 COP)</span>
                  </label>
                  {hasEmbroidery && (
                    <Badge className="bg-[#34351F] text-white text-[9px] font-bold">
                      +$7.000 COP
                    </Badge>
                  )}
                </div>
                <p className="text-[10px] text-neutral-600 leading-relaxed">
                  ¿Quieres un diseño o texto personalizado a tu gusto?{" "}
                  <Link href={customizeHref} className="font-semibold text-[#8B7D4E] underline hover:text-[#34351F]">
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
                            "h-9 min-w-[2.75rem] px-3.5 rounded-lg border text-xs font-semibold transition-all shadow-2xs",
                            isSelected && !isDisabled
                              ? "bg-[#34351F] text-white border-[#34351F] shadow-xs"
                              : "bg-card border-border text-foreground hover:border-[#34351F]/50",
                            isDisabled &&
                              "opacity-35 cursor-not-allowed line-through bg-neutral-100/60"
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
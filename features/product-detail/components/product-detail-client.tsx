"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductGallery } from "./product-gallery";
import { ProductInfoPanel } from "./product-info-panel";
import type { ProductColorOption, ProductDetail, ProductDetailImage } from "../types";

interface ProductDetailClientProps {
  product: ProductDetail;
  categorySlug?: string;
}

/**
 * Client wrapper that manages selected color state so both
 * the gallery and the info panel (with ColorSelector) stay strictly synchronized.
 */
export function ProductDetailClient({ product, categorySlug }: ProductDetailClientProps) {
  // Extraer lista de colores únicos considerando variantes, imágenes y colors
  const availableColors = useMemo<ProductColorOption[]>(() => {
    const colorMap = new Map<string, ProductColorOption>();

    // 1. Agregar desde variantes
    product.variants?.forEach((v) => {
      if (v.colorName && !colorMap.has(v.colorName.trim())) {
        colorMap.set(v.colorName.trim(), {
          name: v.colorName.trim(),
          hex: v.primaryHex || v.colorHex || "#6B6832",
          primaryHex: v.primaryHex || v.colorHex || "#6B6832",
          secondaryHex: v.secondaryHex || null,
          isCombined: Boolean(v.isCombined || v.secondaryHex),
        });
      }
    });

    // 2. Agregar desde imágenes si alguna no estaba en las variantes
    product.imageDetails?.forEach((img) => {
      if (img.colorName && !colorMap.has(img.colorName.trim())) {
        colorMap.set(img.colorName.trim(), {
          name: img.colorName.trim(),
          hex: img.primaryHex || img.colorHex || "#6B6832",
          primaryHex: img.primaryHex || img.colorHex || "#6B6832",
          secondaryHex: img.secondaryHex || null,
          isCombined: Boolean(img.isCombined || img.secondaryHex),
        });
      }
    });

    // 3. Agregar desde product.colors
    product.colors?.forEach((c) => {
      if (c.name && !colorMap.has(c.name.trim())) {
        colorMap.set(c.name.trim(), {
          name: c.name.trim(),
          hex: c.primaryHex || c.hex || "#6B6832",
          primaryHex: c.primaryHex || c.hex || "#6B6832",
          secondaryHex: c.secondaryHex || null,
          isCombined: Boolean(c.isCombined || c.secondaryHex),
        });
      }
    });

    return Array.from(colorMap.values());
  }, [product]);

  const [selectedColorName, setSelectedColorName] = useState<string>(
    () => availableColors[0]?.name ?? ""
  );

  // Sync color selection if product prop changes or on initial load
  useEffect(() => {
    if (availableColors.length > 0) {
      if (
        !selectedColorName ||
        !availableColors.some(
          (c) => c.name.toLowerCase() === selectedColorName.toLowerCase()
        )
      ) {
        setSelectedColorName(availableColors[0].name);
      }
    }
  }, [availableColors, selectedColorName]);

  // Encontrar objeto de color seleccionado
  const selectedColorObj = useMemo(() => {
    return (
      availableColors.find(
        (c) => c.name.toLowerCase() === selectedColorName.toLowerCase()
      ) ?? availableColors[0] ?? null
    );
  }, [availableColors, selectedColorName]);

  // Normalizar lista completa de imágenes con metadatos de color
  const allImageDetails = useMemo<ProductDetailImage[]>(() => {
    if (product.imageDetails && product.imageDetails.length > 0) {
      return product.imageDetails;
    }
    return (product.images || []).map((url, idx) => ({ url, order: idx }));
  }, [product.imageDetails, product.images]);

  // Comprobar si existen fotos etiquetadas con color
  const hasColorTaggedImages = useMemo(() => {
    return allImageDetails.some(
      (img) => Boolean(img.colorName && img.colorName.trim() !== "")
    );
  }, [allImageDetails]);

  // Filtrar las fotos de la galería según el color activo
  const displayImages = useMemo<ProductDetailImage[]>(() => {
    if (!allImageDetails || allImageDetails.length === 0) return [];
    if (!hasColorTaggedImages || !selectedColorObj) {
      return allImageDetails;
    }

    const filtered = allImageDetails
      .filter((img) => {
        // Coincidencia exacta por nombre de color prioritariamente
        if (img.colorName && selectedColorObj.name) {
          if (img.colorName.trim().toLowerCase() === selectedColorObj.name.trim().toLowerCase()) {
            return true;
          }
        }
        // Coincidencia secundaria por hex
        if (img.colorHex && selectedColorObj.hex) {
          if (img.colorHex.trim().toLowerCase() === selectedColorObj.hex.trim().toLowerCase()) {
            return true;
          }
        }
        return false;
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    // Fallback: si el color seleccionado no tiene fotos asignadas aún, mostrar toda la galería
    return filtered.length > 0 ? filtered : allImageDetails;
  }, [allImageDetails, selectedColorObj, hasColorTaggedImages]);

  const handleColorChange = (colorName: string) => {
    setSelectedColorName(colorName);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <ProductGallery
        images={displayImages}
        productName={product.name}
        selectedColorName={selectedColorObj?.name ?? selectedColorName}
        onImageColorSelect={handleColorChange}
      />
      <ProductInfoPanel
        product={product}
        availableColors={availableColors}
        selectedColorName={selectedColorObj?.name ?? selectedColorName}
        onColorChange={handleColorChange}
        categorySlug={categorySlug}
      />
    </div>
  );
}

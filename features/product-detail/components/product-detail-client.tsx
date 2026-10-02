"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductGallery } from "./product-gallery";
import { ProductInfoPanel } from "./product-info-panel";
import type { ProductColorOption, ProductDetail } from "../types";

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

  // Determine if imageDetails contain color info
  const hasColorTaggedImages = useMemo(() => {
    return (product.imageDetails ?? []).some(
      (img) =>
        (img.colorHex && img.colorHex.trim() !== "") ||
        (img.colorName && img.colorName.trim() !== "")
    );
  }, [product.imageDetails]);

  // Find currently selected color object
  const selectedColorObj = useMemo(() => {
    return (
      availableColors.find(
        (c) => c.name.toLowerCase() === selectedColorName.toLowerCase()
      ) ?? availableColors[0] ?? null
    );
  }, [availableColors, selectedColorName]);

  // Filter gallery images by the selected color, falling back to full gallery if untagged
  const filteredImages = useMemo(() => {
    if (!product.images || product.images.length === 0) return [];
    if (!hasColorTaggedImages || !selectedColorObj) {
      return product.images;
    }

    const imageDetails = product.imageDetails ?? [];
    const colorFiltered = imageDetails
      .filter((img) => {
        // Coincidencia exacta por nombre de color prioritariamente
        if (img.colorName && selectedColorObj.name) {
          if (img.colorName.trim().toLowerCase() === selectedColorObj.name.trim().toLowerCase()) {
            return true;
          }
        }
        // Coincidencia por colorHex si colorName no estuviera presente
        if (img.colorHex && selectedColorObj.hex) {
          if (img.colorHex.trim().toLowerCase() === selectedColorObj.hex.trim().toLowerCase()) {
            return true;
          }
        }
        return false;
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((img) => img.url);

    // Fallback: si el color seleccionado no tiene fotos asignadas aún, mostrar toda la galería
    return colorFiltered.length > 0 ? colorFiltered : product.images;
  }, [product.images, product.imageDetails, selectedColorObj, hasColorTaggedImages]);

  const handleColorChange = (colorName: string) => {
    setSelectedColorName(colorName);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <ProductGallery
        images={filteredImages}
        productName={product.name}
        selectedColorHex={selectedColorObj?.hex}
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

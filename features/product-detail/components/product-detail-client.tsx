"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductGallery } from "./product-gallery";
import { ProductInfoPanel } from "./product-info-panel";
import type { ProductDetail } from "../types";

interface ProductDetailClientProps {
  product: ProductDetail;
  categorySlug?: string;
}

/**
 * Client wrapper that manages selected color state so both
 * the gallery and the info panel (with ColorSelector) stay strictly synchronized.
 */
export function ProductDetailClient({ product, categorySlug }: ProductDetailClientProps) {
  const defaultColorHex = product.colors[0]?.hex ?? "";
  const [selectedColorHex, setSelectedColorHex] = useState(defaultColorHex);

  // Sync color selection if product prop changes or on initial load
  useEffect(() => {
    if (product.colors.length > 0) {
      setSelectedColorHex(product.colors[0].hex);
    }
  }, [product]);

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
      product.colors.find(
        (c) => c.hex.toLowerCase() === selectedColorHex.toLowerCase()
      ) ?? product.colors[0]
    );
  }, [product.colors, selectedColorHex]);

  // Filter gallery images by the selected color, falling back to full gallery if untagged
  const filteredImages = useMemo(() => {
    if (!product.images || product.images.length === 0) return [];
    if (!hasColorTaggedImages || !selectedColorObj) {
      return product.images;
    }

    const imageDetails = product.imageDetails ?? [];
    const colorFiltered = imageDetails
      .filter((img) => {
        const matchesHex =
          img.colorHex &&
          selectedColorObj.hex &&
          img.colorHex.toLowerCase() === selectedColorObj.hex.toLowerCase();
        const matchesName =
          img.colorName &&
          selectedColorObj.name &&
          img.colorName.toLowerCase() === selectedColorObj.name.toLowerCase();
        return matchesHex || matchesName;
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((img) => img.url);

    // Fallback: if the selected color has no dedicated images, show all product images
    return colorFiltered.length > 0 ? colorFiltered : product.images;
  }, [product.images, product.imageDetails, selectedColorObj, hasColorTaggedImages]);

  const handleColorChange = (hex: string) => {
    setSelectedColorHex(hex);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <ProductGallery
        images={filteredImages}
        productName={product.name}
        selectedColorHex={selectedColorHex}
      />
      <ProductInfoPanel
        product={product}
        selectedColor={selectedColorHex}
        onColorChange={handleColorChange}
        categorySlug={categorySlug}
      />
    </div>
  );
}


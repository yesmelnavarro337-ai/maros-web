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

  // Filtrar las fotos de la galería según el color activo con lógica tolerante y robusta
  const displayImages = useMemo<ProductDetailImage[]>(() => {
    if (!allImageDetails || allImageDetails.length === 0) return [];
    if (!selectedColorObj) return allImageDetails;

    const normalize = (str?: string | null) =>
      (str || "").trim().toLowerCase().replace(/\s+/g, " ");

    const selectedName = normalize(selectedColorObj.name);
    const selectedHex = normalize(selectedColorObj.hex || selectedColorObj.primaryHex);
    const selectedId = (selectedColorObj as any)?.id;

    const filtered = allImageDetails
      .filter((img) => {
        // 1. Coincidencia por ID si existe
        const imgColorId = (img as any).colorId || (img as any).color_id;
        if (imgColorId && selectedId && String(imgColorId) === String(selectedId)) {
          return true;
        }

        // 2. Coincidencia por Nombre de color normalizado (tolerante a espacios/mayúsculas)
        const imgColorName = normalize(
          img.colorName || (img as any).color?.name || (img as any).color_name
        );
        if (imgColorName && selectedName) {
          if (imgColorName === selectedName) return true;
          if (imgColorName.includes(selectedName) || selectedName.includes(imgColorName)) {
            return true;
          }
        }

        // 3. Coincidencia por Hexadecimal sólo si la imagen no tiene nombre definido
        const imgHex = normalize(img.colorHex || img.primaryHex);
        if (!imgColorName && imgHex && selectedHex) {
          if (imgHex === selectedHex) return true;
        }

        return false;
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    // Si se encontraron imágenes específicas para ese color, retornarlas; de lo contrario retorno fallback de todas las fotos
    return filtered.length > 0 ? filtered : allImageDetails;
  }, [allImageDetails, selectedColorObj]);

  const handleColorChange = (colorName: string) => {
    setSelectedColorName(colorName);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <ProductGallery
        images={allImageDetails}
        productName={product.name}
        selectedColor={selectedColorObj}
        selectedColorName={selectedColorObj?.name ?? selectedColorName}
        selectedColorId={selectedColorObj?.id}
        selectedColorHex={selectedColorObj?.hex}
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

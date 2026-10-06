"use client";

import { useState, useCallback } from "react";
import { clientApiFetch } from "@/lib/api/client-fetch";
import type { ProductPreview } from "@/types/product";
import type {
  ProductDetail,
  ProductColorOption,
  ProductDetailImage,
} from "@/features/product-detail/types";

// ─── Size ordering (mirrors backend service logic) ───────────────────────────
const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "2XL", "XXL", "3XL", "XXXL", "4XL", "XXXXL", "5XL"];
function sortSizes(sizes: string[]): string[] {
  return [...sizes].sort((a, b) => {
    const ai = SIZE_ORDER.indexOf(a.trim().toUpperCase());
    const bi = SIZE_ORDER.indexOf(b.trim().toUpperCase());
    return (ai === -1 ? SIZE_ORDER.length : ai) - (bi === -1 ? SIZE_ORDER.length : bi);
  });
}

// ─── Adapt API response to ProductDetail ─────────────────────────────────────

function adaptApiProduct(raw: any): ProductDetail {
  const categoryIds = raw.categoryIds?.length
    ? raw.categoryIds
    : raw.categoryId
      ? [raw.categoryId]
      : [];

  const categories = raw.categories?.length
    ? raw.categories.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        defaultPrice: c.defaultPrice ?? null,
        surchargeReason: c.surchargeReason ?? null,
        price: c.price ?? null,
        productSurchargeReason: c.productSurchargeReason ?? null,
      }))
    : raw.categoryId
      ? [{ id: raw.categoryId, name: raw.categoryName || "", slug: "" }]
      : [];

  // Build image details
  const rawImgs: any[] = raw.imageDetails?.length
    ? raw.imageDetails
    : Array.isArray(raw.images)
      ? raw.images
      : [];

  const imageDetails: ProductDetailImage[] = rawImgs.map((img: any, idx: number) => {
    if (typeof img === "string") return { url: img, order: idx };
    return {
      id: img.id,
      url: img.url || img.imageUrl || "",
      order: img.order ?? idx,
      colorId: img.colorId || img.color_id || img.color?.id || undefined,
      colorHex: img.colorHex || img.hex || img.color?.hex || undefined,
      colorName: (img.colorName || img.color_name || img.color?.name || "").trim() || undefined,
      primaryHex: img.primaryHex || img.colorHex || img.hex || img.color?.primaryHex || undefined,
      secondaryHex: img.secondaryHex || img.color?.secondaryHex || undefined,
      isCombined: img.isCombined ?? img.color?.isCombined ?? undefined,
      color: img.color ?? null,
    };
  });

  // Build unique colors
  const colorMap = new Map<string, ProductColorOption>();
  raw.colors?.forEach((c: any) => {
    const name = (c.name || "").trim();
    if (name && !colorMap.has(name.toLowerCase())) {
      colorMap.set(name.toLowerCase(), {
        name,
        hex: c.primaryHex || c.hex || "#6B6832",
        primaryHex: c.primaryHex || c.hex || "#6B6832",
        secondaryHex: c.secondaryHex || null,
        isCombined: Boolean(c.isCombined || c.secondaryHex),
      });
    }
  });
  raw.variants?.forEach((v: any) => {
    const name = (v.colorName || v.color?.name || "").trim();
    if (name && !colorMap.has(name.toLowerCase())) {
      colorMap.set(name.toLowerCase(), {
        name,
        hex: v.colorHex || v.hex || "#6B6832",
        primaryHex: v.primaryHex || v.colorHex || v.hex || "#6B6832",
        secondaryHex: v.secondaryHex || v.color?.secondaryHex || null,
        isCombined: Boolean(v.isCombined || v.secondaryHex || v.color?.isCombined),
      });
    }
  });
  imageDetails.forEach((img) => {
    const name = (img.colorName || (img as any).color?.name || "").trim();
    if (name && !colorMap.has(name.toLowerCase())) {
      colorMap.set(name.toLowerCase(), {
        name,
        hex: img.primaryHex || img.colorHex || "#6B6832",
        primaryHex: img.primaryHex || img.colorHex || "#6B6832",
        secondaryHex: img.secondaryHex || null,
        isCombined: Boolean(img.isCombined || img.secondaryHex),
      });
    }
  });

  const styleSet = new Set<string>();
  const materialSet = new Set<string>();
  raw.styles?.forEach((st: string) => {
    if (st?.trim()) styleSet.add(st.trim());
  });
  raw.variants?.forEach((v: any) => {
    if (v.styleName?.trim()) styleSet.add(v.styleName.trim());
    if (v.materialName?.trim()) materialSet.add(v.materialName.trim());
  });

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    basePrice: raw.basePrice,
    price: raw.basePrice,
    description: raw.description || "",
    images: raw.images || [],
    imageDetails,
    sizes: sortSizes(raw.sizes || []),
    colors: Array.from(colorMap.values()),
    styles: Array.from(styleSet),
    materials: Array.from(materialSet),
    variants: (raw.variants || []).map((v: any) => ({
      ...v,
      styleName: v.styleName ?? null,
      materialName: v.materialName ?? null,
      primaryHex: v.primaryHex || v.colorHex,
      secondaryHex: v.secondaryHex,
      isCombined: v.isCombined,
      stock: v.stock ?? (v.available ? 1 : 0),
      price: v.price ?? null,
    })),
    categoryIds,
    categories,
    categoryName: raw.categoryName || categories.map((c: any) => c.name).join(", "),
    categoryId: categoryIds[0] ?? "",
    collectionIds: raw.collectionIds ?? [],
    available: raw.available,
    allowCustomization: raw.allowCustomization ?? false,
    deliveryTime: raw.deliveryTime || "",
    rating: raw.rating,
    reviewCount: raw.reviewCount,
  };
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useQuickView() {
  const [isOpen, setIsOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<ProductPreview | null>(null);
  const [fullProduct, setFullProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openQuickView = useCallback((product: ProductPreview) => {
    setPreviewProduct(product);
    setFullProduct(null);
    setIsOpen(true);
    setIsLoading(true);

    // Fetch full product detail client-side
    clientApiFetch<any>(`products/${product.slug}`)
      .then((data) => {
        setFullProduct(adaptApiProduct(data));
      })
      .catch((err) => {
        console.error("Failed to load product detail for quick view:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const closeQuickView = useCallback(() => {
    setIsOpen(false);
    // Small delay before clearing data to allow close animation
    setTimeout(() => {
      setPreviewProduct(null);
      setFullProduct(null);
    }, 200);
  }, []);

  return {
    isOpen,
    isLoading,
    previewProduct,
    fullProduct,
    openQuickView,
    closeQuickView,
  };
}

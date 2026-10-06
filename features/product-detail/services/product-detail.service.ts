import { serverApiFetch } from "@/lib/api/server-fetch";
import type { ProductDetail } from "../types";

interface ApiProductColor {
  name: string;
  hex: string;
  primaryHex?: string;
  secondaryHex?: string | null;
  isCombined?: boolean;
}

interface ApiProductVariant {
  size: string;
  colorName: string;
  colorHex: string;
  styleName?: string | null;
  materialName?: string | null;
  primaryHex?: string;
  secondaryHex?: string | null;
  isCombined?: boolean;
  available: boolean;
  stock: number;
  price?: number | null;
}

interface ApiProductCategory {
  id: string;
  name: string;
  slug: string;
  defaultPrice?: number | null;
  surchargeReason?: string | null;
  price?: number | null;
  productSurchargeReason?: string | null;
}

interface ApiProductImage {
  id: string;
  url: string;
  order: number;
  colorHex?: string | null;
  colorName?: string | null;
  primaryHex?: string | null;
  secondaryHex?: string | null;
  isCombined?: boolean | null;
}

interface ApiProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  categoryIds?: string[] | null;
  categories?: ApiProductCategory[] | null;
  categoryName: string;
  categoryId?: string | null;
  images: string[];
  imageDetails?: ApiProductImage[] | null;
  sizes: string[];
  colors: ApiProductColor[];
  variants: ApiProductVariant[];
  available: boolean;
  allowCustomization: boolean;
  deliveryTime: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoSocialImageUrl?: string | null;
  seoAltText?: string | null;
  collectionIds?: string[] | null;
  styles?: string[] | null;
  materials?: string[] | null;
}

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "2XL", "XXL", "3XL", "XXXL", "4XL", "XXXXL", "5XL"];

function getSizeRank(size: string): number {
  const normalized = size.trim().toUpperCase();
  const rank = SIZE_ORDER.indexOf(normalized);
  return rank === -1 ? SIZE_ORDER.length : rank;
}

function sortSizes(sizes: string[]): string[] {
  return [...sizes].sort((a, b) => {
    const rank = getSizeRank(a) - getSizeRank(b);
    return rank !== 0 ? rank : a.localeCompare(b, "es");
  });
}

function adaptDetail(p: ApiProductDetail): ProductDetail {
  const categoryIds = p.categoryIds?.length ? p.categoryIds : p.categoryId ? [p.categoryId] : [];
  const categories = p.categories?.length
    ? p.categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        defaultPrice: c.defaultPrice,
        surchargeReason: c.surchargeReason,
        price: c.price,
        productSurchargeReason: c.productSurchargeReason,
      }))
    : p.categoryId
      ? [{ id: p.categoryId, name: p.categoryName || "Pijamas de mujer", slug: "" }]
      : [];

  const rawImages: any[] = p.imageDetails?.length
    ? p.imageDetails
    : Array.isArray(p.images)
      ? p.images
      : [];

  const imageDetails = rawImages.map((img, idx) => {
    if (typeof img === "string") {
      return { url: img, order: idx };
    }
    const colorId = img.colorId || img.color_id || img.color?.id || undefined;
    const colorName = (img.colorName || img.color_name || img.color?.name || "").trim() || undefined;
    const colorHex = img.colorHex || img.hex || img.color?.hex || undefined;
    const primaryHex = img.primaryHex || img.colorHex || img.hex || img.color?.primaryHex || undefined;
    const secondaryHex = img.secondaryHex || img.color?.secondaryHex || undefined;
    const isCombined = img.isCombined ?? img.color?.isCombined ?? undefined;

    return {
      id: img.id,
      url: img.url || img.imageUrl || "",
      order: img.order ?? idx,
      colorId,
      colorHex,
      colorName,
      primaryHex,
      secondaryHex,
      isCombined,
      color: img.color ?? (colorName ? { id: colorId, name: colorName, hex: colorHex, primaryHex, secondaryHex, isCombined } : null),
    };
  });

  // Extraer lista de colores únicos considerando colors, variants e imageDetails
  const colorMap = new Map<string, { id?: string; name: string; hex: string; primaryHex?: string; secondaryHex?: string | null; isCombined?: boolean }>();

  p.colors?.forEach((c: any) => {
    const name = (c.name || "").trim();
    if (name && !colorMap.has(name.toLowerCase())) {
      colorMap.set(name.toLowerCase(), {
        id: c.id || c.colorId,
        name,
        hex: c.primaryHex || c.hex || "#6B6832",
        primaryHex: c.primaryHex || c.hex || "#6B6832",
        secondaryHex: c.secondaryHex || null,
        isCombined: Boolean(c.isCombined || c.secondaryHex),
      });
    }
  });

  p.variants?.forEach((v: any) => {
    const name = (v.colorName || v.color?.name || "").trim();
    if (name && !colorMap.has(name.toLowerCase())) {
      colorMap.set(name.toLowerCase(), {
        id: v.colorId || v.color?.id,
        name,
        hex: v.colorHex || v.hex || "#6B6832",
        primaryHex: v.primaryHex || v.colorHex || v.hex || "#6B6832",
        secondaryHex: v.secondaryHex || v.color?.secondaryHex || null,
        isCombined: Boolean(v.isCombined || v.secondaryHex || v.color?.isCombined),
      });
    }
  });

  imageDetails.forEach((img) => {
    const name = (img.colorName || img.color?.name || "").trim();
    if (name && !colorMap.has(name.toLowerCase())) {
      colorMap.set(name.toLowerCase(), {
        id: img.colorId || img.color?.id,
        name,
        hex: img.primaryHex || img.colorHex || "#6B6832",
        primaryHex: img.primaryHex || img.colorHex || "#6B6832",
        secondaryHex: img.secondaryHex || img.color?.secondaryHex || null,
        isCombined: Boolean(img.isCombined || img.secondaryHex || img.color?.isCombined),
      });
    }
  });

  const uniqueColors = Array.from(colorMap.values());

  const styleSet = new Set<string>();
  const materialSet = new Set<string>();
  p.styles?.forEach((st) => {
    if (st?.trim()) styleSet.add(st.trim());
  });
  p.variants?.forEach((v) => {
    if (v.styleName?.trim()) styleSet.add(v.styleName.trim());
    if (v.materialName?.trim()) materialSet.add(v.materialName.trim());
  });

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    basePrice: p.basePrice,
    price: p.basePrice,
    description: p.description,
    images: p.images,
    imageDetails,
    sizes: sortSizes(p.sizes),
    colors: uniqueColors,
    styles: Array.from(styleSet),
    materials: Array.from(materialSet),
    variants: p.variants.map((v) => ({
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
    categoryName: p.categoryName || categories.map((c) => c.name).join(", "),
    categoryId: categoryIds[0] ?? "",
    collectionIds: p.collectionIds ?? [],
    available: p.available,
    allowCustomization: p.allowCustomization,
    deliveryTime: p.deliveryTime,
    seoTitle: p.seoTitle ?? undefined,
    seoDescription: p.seoDescription ?? undefined,
    seoSocialImageUrl: p.seoSocialImageUrl ?? undefined,
    seoAltText: p.seoAltText ?? undefined,
  };
}

export async function getProductDetail(slug: string): Promise<ProductDetail | undefined> {
  try {
    const product = await serverApiFetch<ApiProductDetail>(`products/${slug}`, { tags: ["products"] });
    return adaptDetail(product);
  } catch {
    return undefined;
  }
}

interface ApiProductListItem {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  thumbnailUrl?: string | null;
  images?: string[] | null;
  available: boolean;
  sizes: string[];
  categoryName?: string | null;
  styleName?: string | null;
}

export interface RelatedProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  available: boolean;
  sizes: string[];
  categoryName?: string;
  styleName?: string;
}

function adaptListItem(p: ApiProductListItem): RelatedProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.basePrice,
    image: p.thumbnailUrl ?? "",
    images: p.images ?? [],
    available: p.available,
    sizes: p.sizes,
    categoryName: p.categoryName ?? undefined,
    styleName: p.styleName ?? undefined,
  };
}

async function fetchRelatedList(query: URLSearchParams): Promise<RelatedProduct[]> {
  try {
    const qs = query.toString();
    const products = await serverApiFetch<ApiProductListItem[]>(`products?${qs}`, { tags: ["products"] });
    return products.map(adaptListItem);
  } catch {
    return [];
  }
}

export async function getRelatedProducts(product: ProductDetail, currentSlug: string): Promise<RelatedProduct[]> {
  const results: RelatedProduct[] = [];
  const seen = new Set<string>([currentSlug]);

  const push = (items: RelatedProduct[]) => {
    for (const item of items) {
      if (seen.has(item.slug)) continue;
      seen.add(item.slug);
      results.push(item);
    }
  };

  for (const categoryId of product.categoryIds) {
    if (results.length >= 4) break;
    const categoryProducts = await fetchRelatedList(new URLSearchParams({ categoryId }));
    push(categoryProducts.filter((p) => p.available));
  }

  if (results.length < 4) {
    for (const collectionId of product.collectionIds) {
      if (results.length >= 4) break;
      const collectionProducts = await fetchRelatedList(new URLSearchParams({ collectionId }));
      push(collectionProducts.filter((p) => p.available));
    }
  }

  if (results.length < 4) {
    const latest = await fetchRelatedList(new URLSearchParams());
    push(latest.filter((p) => p.available));
  }

  return results.slice(0, 4);
}

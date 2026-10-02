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

  const imageDetails = p.imageDetails?.length
    ? p.imageDetails.map((img) => ({
        id: img.id,
        url: img.url,
        order: img.order,
        colorHex: img.colorHex,
        colorName: img.colorName,
        primaryHex: img.primaryHex || img.colorHex || undefined,
        secondaryHex: img.secondaryHex || undefined,
        isCombined: img.isCombined ?? undefined,
      }))
    : p.images.map((url, idx) => ({ url, order: idx }));

  // Extraer lista de colores únicos considerando colors, variants e imageDetails
  const colorMap = new Map<string, { name: string; hex: string; primaryHex?: string; secondaryHex?: string | null; isCombined?: boolean }>();

  p.colors?.forEach((c) => {
    if (c.name && !colorMap.has(c.name)) {
      colorMap.set(c.name, {
        name: c.name,
        hex: c.primaryHex || c.hex || "#6B6832",
        primaryHex: c.primaryHex || c.hex || "#6B6832",
        secondaryHex: c.secondaryHex || null,
        isCombined: Boolean(c.isCombined || c.secondaryHex),
      });
    }
  });

  p.variants?.forEach((v) => {
    if (v.colorName && !colorMap.has(v.colorName)) {
      colorMap.set(v.colorName, {
        name: v.colorName,
        hex: v.colorHex || "#6B6832",
        primaryHex: v.primaryHex || v.colorHex || "#6B6832",
        secondaryHex: v.secondaryHex || null,
        isCombined: Boolean(v.isCombined || v.secondaryHex),
      });
    }
  });

  p.imageDetails?.forEach((img) => {
    if (img.colorName && !colorMap.has(img.colorName)) {
      colorMap.set(img.colorName, {
        name: img.colorName,
        hex: img.primaryHex || img.colorHex || "#6B6832",
        primaryHex: img.primaryHex || img.colorHex || "#6B6832",
        secondaryHex: img.secondaryHex || null,
        isCombined: Boolean(img.isCombined || img.secondaryHex),
      });
    }
  });

  const uniqueColors = Array.from(colorMap.values());

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
    variants: p.variants.map((v) => ({
      ...v,
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

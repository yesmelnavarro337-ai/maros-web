import { serverApiFetch } from "@/lib/api/server-fetch";
import type { ProductDetail } from "../types";

interface ApiProductColor {
  name: string;
  hex: string;
}

interface ApiProductVariant {
  size: string;
  colorName: string;
  colorHex: string;
  available: boolean;
}

interface ApiProductCategory {
  id: string;
  name: string;
  slug: string;
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

function adaptDetail(p: ApiProductDetail): ProductDetail {
  const categoryIds = p.categoryIds?.length ? p.categoryIds : p.categoryId ? [p.categoryId] : [];
  const categories = p.categories?.length
    ? p.categories
    : p.categoryId
      ? [{ id: p.categoryId, name: p.categoryName || "Pijamas de mujer", slug: "" }]
      : [];

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.basePrice,
    description: p.description,
    images: p.images,
    sizes: p.sizes,
    colors: p.colors,
    variants: p.variants,
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

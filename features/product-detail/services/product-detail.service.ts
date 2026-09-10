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

interface ApiProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  categoryName: string;
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
}

function adaptDetail(p: ApiProductDetail): ProductDetail {
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
    categoryName: p.categoryName,
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
    const product = await serverApiFetch<ApiProductDetail>(`products/${slug}`);
    return adaptDetail(product);
  } catch {
    return undefined;
  }
}
import { clientApiFetch } from "@/lib/api/client-fetch";

export interface ProductClientSummary {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  sizes: string[];
  colors: { name: string; hex: string }[];
  allowCustomization: boolean;
}

interface ApiProductDetail {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  sizes: string[];
  colors: { name: string; hex: string }[];
  allowCustomization: boolean;
}

export async function getProductSummaryClient(slug: string): Promise<ProductClientSummary | undefined> {
  try {
    const p = await clientApiFetch<ApiProductDetail>(`products/${slug}`);
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      basePrice: p.basePrice,
      sizes: p.sizes,
      colors: p.colors,
      allowCustomization: p.allowCustomization,
    };
  } catch {
    return undefined;
  }
}
import { serverApiFetch } from "@/lib/api/server-fetch";
import type { CollectionSummary } from "@/types/collection";
import type { ProductPreview } from "@/types/product";

interface ApiCollectionSummary {
  id: string;
  name: string;
  description: string;
  coverImageUrl?: string | null;
  accentHex: string;
  productCount: number;
}

interface ApiProductListItem {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  basePrice: number;
  thumbnailUrl?: string | null;
  images?: string[] | null;
  available: boolean;
}

function adaptCollection(c: ApiCollectionSummary): CollectionSummary {
  return {
    id: c.id,
    name: c.name,
    description: c.description,
    image: c.coverImageUrl ?? undefined,
    accentHex: c.accentHex,
    productCount: c.productCount,
  };
}

// rating/reviewCount en 0 — no existe sistema de reseñas en el backend todavía
// (gap identificado en Fase 12). Se resuelve formalmente en Fase 20.
function adaptProduct(p: ApiProductListItem): ProductPreview {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.basePrice,
    image: p.thumbnailUrl ?? "",
    images: p.images ?? [],
  };
}

export async function getCollections(): Promise<CollectionSummary[]> {
  try {
    const data = await serverApiFetch<ApiCollectionSummary[]>("collection");
    return data.map(adaptCollection);
  } catch {
    return [];
  }
}

export async function getCollectionById(id: string): Promise<CollectionSummary | undefined> {
  const all = await getCollections();
  return all.find((c) => c.id === id);
}

export async function getProductsByCollection(id: string): Promise<ProductPreview[]> {
  try {
    const data = await serverApiFetch<ApiProductListItem[]>(`products?collectionId=${id}`);
    return data.map(adaptProduct);
  } catch {
    return [];
  }
}
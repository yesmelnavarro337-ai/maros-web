import { serverApiFetch } from "@/lib/api/server-fetch";
import type { CatalogProductItem, CatalogSearchParams, SortOption } from "../types";

interface ApiProductColor {
  name: string;
  hex: string;
}

interface ApiCatalogProduct {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  basePrice: number;
  thumbnailUrl?: string | null;
  available: boolean;
  sizes: string[];
  colors: ApiProductColor[];
}

interface ApiCategory {
  id: string;
  name: string;
  slug: string;
}

function adaptProduct(p: ApiCatalogProduct): CatalogProductItem {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.basePrice,
    image: p.thumbnailUrl ?? "",
    available: p.available,
    categoryName: p.categoryName,
    sizes: p.sizes,
    colors: p.colors,
  };
}

export async function getCategories(): Promise<ApiCategory[]> {
  return serverApiFetch<ApiCategory[]>("categories");
}

function applySort(products: CatalogProductItem[], sort?: SortOption): CatalogProductItem[] {
  const list = [...products];
  if (sort === "precio-asc") return list.sort((a, b) => a.price - b.price);
  if (sort === "precio-desc") return list.sort((a, b) => b.price - a.price);
  if (sort === "nombre") return list.sort((a, b) => a.name.localeCompare(b.name));
  return list; // "recientes" = orden que ya entrega el backend (CreatedAt desc)
}

export async function getCatalogProducts(params: CatalogSearchParams): Promise<CatalogProductItem[]> {
  const query = new URLSearchParams();

  if (params.categoria) {
    const categories = await getCategories();
    const match = categories.find((c) => c.slug === params.categoria || c.id === params.categoria);
    if (match) query.set("categoryId", match.id);
  }

  if (params.buscar) query.set("search", params.buscar);

  let products = await serverApiFetch<ApiCatalogProduct[]>(`products?${query.toString()}`);
  let adapted = products.map(adaptProduct);

  // Talla y Color se filtran en memoria: el backend ya redujo el conjunto
  // por categoría/búsqueda, y estos dos son atributos de variante, no
  // columnas indexables de forma simple en el listado — filtrar aquí sobre
  // un conjunto ya acotado es más simple que agregar más query params
  // combinables al backend por ahora.
  if (params.talla) {
    adapted = adapted.filter((p) => p.sizes.includes(params.talla!));
  }
  if (params.color) {
    adapted = adapted.filter((p) => p.colors.some((c) => c.hex === params.color));
  }

  return applySort(adapted, params.orden);
}
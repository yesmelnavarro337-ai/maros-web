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
  images?: string[] | null;
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
    images: p.images ?? [],
    available: p.available,
    categoryName: p.categoryName,
    sizes: p.sizes,
    colors: p.colors,
  };
}

export async function getCategories(): Promise<ApiCategory[]> {
  return serverApiFetch<ApiCategory[]>("categories", { tags: ["categories"] });
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

  const products = await serverApiFetch<ApiCatalogProduct[]>(`products?${query.toString()}`, {
    tags: ["products", "categories"],
  });
  let adapted = products.map(adaptProduct);

  // Talla, Color y Precio se filtran en memoria: el backend ya redujo el
  // conjunto por categoría/búsqueda, y estos atributos de variante/valor no
  // son columnas indexables de forma simple en el listado — filtrar aquí
  // sobre un conjunto ya acotado es más simple que agregar más query params
  // combinables al backend por ahora.
  if (params.talla) {
    adapted = adapted.filter((p) => p.sizes.includes(params.talla!));
  }
  if (params.color) {
    adapted = adapted.filter((p) => p.colors.some((c) => c.hex === params.color));
  }
  if (params.precioMin) {
    const min = Number(params.precioMin);
    if (!Number.isNaN(min)) adapted = adapted.filter((p) => p.price >= min);
  }
  if (params.precioMax) {
    const max = Number(params.precioMax);
    if (!Number.isNaN(max)) adapted = adapted.filter((p) => p.price <= max);
  }

  return applySort(adapted, params.orden);
}

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];

export async function getCatalogFilterOptions(filters: {
  categoria?: string;
  buscar?: string;
}): Promise<{ sizes: string[]; colors: { hex: string; label: string }[]; priceMin: number; priceMax: number }> {
  const products = await getCatalogProducts({ ...filters, orden: "recientes" });

  const sizes = [...new Set(products.flatMap((p) => p.sizes))].sort((a, b) => {
    const ia = SIZE_ORDER.indexOf(a);
    const ib = SIZE_ORDER.indexOf(b);
    return (ia === -1 ? SIZE_ORDER.length : ia) - (ib === -1 ? SIZE_ORDER.length : ib);
  });

  const colorMap = new Map<string, { hex: string; label: string }>();
  products.forEach((p) =>
    p.colors.forEach((c) => {
      const key = c.hex.toLowerCase();
      if (!colorMap.has(key)) colorMap.set(key, { hex: c.hex, label: c.name });
    })
  );
  const colors = [...colorMap.values()].sort((a, b) => a.label.localeCompare(b.label));

  const prices = products.map((p) => p.price);
  const priceMin = prices.length ? Math.min(...prices) : 0;
  const priceMax = prices.length ? Math.max(...prices) : 1;

  return { sizes, colors, priceMin, priceMax };
}
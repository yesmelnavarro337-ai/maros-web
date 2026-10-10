import { serverApiFetch } from "@/lib/api/server-fetch";
import { parseFilterList } from "../filter-utils";
import type { CatalogProductItem, CatalogSearchParams, SortOption } from "../types";

interface ApiProductColor {
  name: string;
  hex: string;
}

interface ApiProductCategory {
  id: string;
  name: string;
  slug: string;
}

interface ApiCatalogProduct {
  id: string;
  name: string;
  slug: string;
  categoryId?: string | null;
  categoryName: string;
  categoryIds?: string[] | null;
  categories?: ApiProductCategory[] | null;
  basePrice: number;
  thumbnailUrl?: string | null;
  images?: string[] | null;
  available: boolean;
  sizes: string[];
  colors: ApiProductColor[];
  styleName?: string | null;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  defaultPrice?: number | null;
  surchargeReason?: string | null;
}

function adaptProduct(p: ApiCatalogProduct): CatalogProductItem {
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
    image: p.thumbnailUrl ?? "",
    images: p.images ?? [],
    available: p.available,
    categoryIds,
    categories,
    categoryName: p.categoryName || categories.map((c) => c.name).join(", "),
    styleName: p.styleName ?? undefined,
    sizes: p.sizes,
    colors: p.colors,
  };
}

export async function getCategories(): Promise<ApiCategory[]> {
  return serverApiFetch<ApiCategory[]>("categories", { tags: ["categories"] });
}

export async function getFeaturedCatalog(): Promise<CatalogProductItem[]> {
  const products = await serverApiFetch<ApiCatalogProduct[]>("products/featured-catalog", {
    tags: ["featured-catalog"],
  });
  return products.map(adaptProduct);
}

function applySort(products: CatalogProductItem[], sort?: SortOption): CatalogProductItem[] {
  const list = [...products];
  if (sort === "precio-asc") return list.sort((a, b) => a.price - b.price);
  if (sort === "precio-desc") return list.sort((a, b) => b.price - a.price);
  if (sort === "nombre") return list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}

export async function getCatalogProducts(params: CatalogSearchParams): Promise<CatalogProductItem[]> {
  const query = new URLSearchParams();

  // Filtros multi-valor: el backend espera valores separados por coma.
  if (params.categoria) query.set("categories", params.categoria);
  if (params.talla) query.set("sizes", params.talla);
  if (params.color) query.set("colors", params.color);
  if (params.buscar) query.set("search", params.buscar);

  const queryString = query.toString();
  const products = await serverApiFetch<ApiCatalogProduct[]>(
    `products${queryString ? `?${queryString}` : ""}`,
    {
      tags: ["products", "categories"],
    }
  );
  let adapted = products.map(adaptProduct);

  // Filtrado defensivo en memoria (por si el catálogo se sirve desde una API
  // sin soporte multi-valor): mantiene coherencia con los filtros de la URL.
  const categorySlugs = parseFilterList(params.categoria).map((slug) => slug.toLowerCase());
  if (categorySlugs.length > 0) {
    adapted = adapted.filter((p) =>
      p.categories.some((c) => categorySlugs.includes((c.slug || "").toLowerCase()))
    );
  }

  const sizeList = parseFilterList(params.talla).map((size) => size.toLowerCase());
  if (sizeList.length > 0) {
    adapted = adapted.filter((p) => p.sizes.some((s) => sizeList.includes(s.toLowerCase())));
  }

  const colorList = parseFilterList(params.color).map((color) => color.toLowerCase());
  if (colorList.length > 0) {
    adapted = adapted.filter((p) => p.colors.some((c) => colorList.includes(c.name.toLowerCase())));
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

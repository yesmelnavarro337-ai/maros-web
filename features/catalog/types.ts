export const PRODUCT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type ProductSize = (typeof PRODUCT_SIZES)[number];

export type SortOption = "recientes" | "precio-asc" | "precio-desc" | "nombre";

export interface CatalogProductItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  available: boolean;
  categoryName: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
}

export interface CatalogSearchParams {
  categoria?: string;
  talla?: string;
  color?: string;
  buscar?: string;
  orden?: SortOption;
}
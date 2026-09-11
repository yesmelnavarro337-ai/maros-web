export type SortOption = "recientes" | "precio-asc" | "precio-desc" | "nombre";

export interface CatalogProductItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
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
  precioMin?: string;
  precioMax?: string;
  orden?: SortOption;
}
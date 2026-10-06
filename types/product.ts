export interface ProductPreview {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  available?: boolean;
  sizes?: string[];
  /** Categoría del producto; permite derivar el género cuando el estilo no lo declara. */
  categoryName?: string;
  /** Estilo fijo predominante; define la tarifa exacta en las tarjetas. */
  styleName?: string;
}
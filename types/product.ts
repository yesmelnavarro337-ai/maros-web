export interface ProductPreview {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  reviewCount?: number;
}
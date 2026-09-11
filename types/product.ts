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
}
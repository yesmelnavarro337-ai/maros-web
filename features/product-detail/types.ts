export interface ProductColorOption {
  name: string;
  hex: string;
}

export interface ProductVariantAvailability {
  size: string;
  colorName: string;
  colorHex: string;
  available: boolean;
}

export interface ProductDetail {
  id: string;
  slug: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  rating?: number;
  reviewCount?: number;
  sizes: string[];
  colors: ProductColorOption[];
  variants: ProductVariantAvailability[];
  categoryIds: string[];
  categories: { id: string; name: string; slug: string }[];
  categoryName: string;
  categoryId: string;
  collectionIds: string[];
  available: boolean;
  allowCustomization: boolean;
  deliveryTime: string;
  seoTitle?: string;
  seoDescription?: string;
  seoSocialImageUrl?: string;
  seoAltText?: string;
}

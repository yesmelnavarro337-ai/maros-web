export interface ProductColorOption {
  name: string;
  hex: string;
}

export interface ProductDetailImage {
  id?: string;
  url: string;
  order?: number;
  colorHex?: string | null;
  colorName?: string | null;
}

export interface ProductVariantAvailability {
  size: string;
  colorName: string;
  colorHex: string;
  available: boolean;
  stock: number;
  price?: number | null;
}

export interface ProductDetailCategory {
  id: string;
  name: string;
  slug: string;
  defaultPrice?: number | null;
  surchargeReason?: string | null;
  price?: number | null;
  productSurchargeReason?: string | null;
}

export interface ProductDetail {
  id: string;
  slug: string;
  name: string;
  basePrice: number;
  price: number;
  description: string;
  images: string[];
  imageDetails?: ProductDetailImage[];
  rating?: number;
  reviewCount?: number;
  sizes: string[];
  colors: ProductColorOption[];
  variants: ProductVariantAvailability[];
  categoryIds: string[];
  categories: ProductDetailCategory[];
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

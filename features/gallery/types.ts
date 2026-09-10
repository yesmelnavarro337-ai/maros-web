export const GALLERY_CATEGORIES = ["Familia", "Parejas", "Niños", "Batas", "Empresas"] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export interface GalleryImageItem {
  id: string;
  url: string;
  category: GalleryCategory;
  caption: string;
}
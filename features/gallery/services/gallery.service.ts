import { serverApiFetch } from "@/lib/api/server-fetch";
import type { GalleryCategory, GalleryImageItem } from "../types";

interface ApiGalleryImage {
  url: string;
  category: string;
  caption: string;
}

// El backend usa "Ninos" (sin ñ, restricción de nombres de enum en C#) —
// mismo mapeo que ya resolvimos en la integración de maros-admin (Fase 11).
const CATEGORY_TO_API: Record<GalleryCategory, string> = {
  Familia: "Familia",
  Parejas: "Parejas",
  Niños: "Ninos",
  Batas: "Batas",
  Empresas: "Empresas",
};

const CATEGORY_FROM_API: Record<string, GalleryCategory> = {
  Familia: "Familia",
  Parejas: "Parejas",
  Ninos: "Niños",
  Batas: "Batas",
  Empresas: "Empresas",
};

function adaptImage(img: ApiGalleryImage, index: number): GalleryImageItem {
  return {
    id: `${img.category}-${index}`,
    url: img.url,
    category: CATEGORY_FROM_API[img.category] ?? "Familia",
    caption: img.caption,
  };
}

export async function getGalleryImages(category?: GalleryCategory): Promise<GalleryImageItem[]> {
  const query = category ? `?category=${encodeURIComponent(CATEGORY_TO_API[category])}` : "";
  const images = await serverApiFetch<ApiGalleryImage[]>(`gallery${query}`);
  return images.map(adaptImage);
}
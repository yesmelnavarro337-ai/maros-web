import { serverApiFetch } from "@/lib/api/server-fetch";
import type { GalleryCategory, GalleryImageItem } from "../types";

interface ApiGalleryImage {
  url: string;
  category: string;
  caption: string;
}

// El backend serializa el enum sin espacios (ClientesReales, DetallesBordado);
// la UI usa etiquetas legibles.
const CATEGORY_TO_API: Record<GalleryCategory, string> = {
  "Clientes reales": "ClientesReales",
  Navidad: "Navidad",
  Parejas: "Parejas",
  "Detalles de bordado": "DetallesBordado",
};

const CATEGORY_FROM_API: Record<string, GalleryCategory> = {
  ClientesReales: "Clientes reales",
  Navidad: "Navidad",
  Parejas: "Parejas",
  DetallesBordado: "Detalles de bordado",
};

function adaptImage(img: ApiGalleryImage, index: number): GalleryImageItem {
  return {
    id: `${img.category}-${index}`,
    url: img.url,
    category: CATEGORY_FROM_API[img.category] ?? "Clientes reales",
    caption: img.caption,
  };
}

export async function getGalleryImages(category?: GalleryCategory): Promise<GalleryImageItem[]> {
  const query = category ? `?category=${encodeURIComponent(CATEGORY_TO_API[category])}` : "";
  const images = await serverApiFetch<ApiGalleryImage[]>(`gallery${query}`);
  return images.map(adaptImage);
}
import { clientApiFetch } from "@/lib/api/client-fetch";
import type { CustomizationChoice, CustomizationModel } from "../types";

interface ApiCustomizationOption {
  id: string;
  name: string;
  imageUrl?: string | null;
  colorHex?: string | null;
  priceModifier?: number | null;
}

interface CustomizationCatalogResponse {
  catalogs: Record<string, ApiCustomizationOption[]>;
}

function adapt(option: ApiCustomizationOption): CustomizationChoice {
  return {
    id: option.id,
    name: option.name,
    image: option.imageUrl ?? undefined,
    hex: option.colorHex ?? undefined,
    priceModifier: option.priceModifier ?? 0,
  };
}

// "Sin estampado" / "Sin bordado": opciones de INTERFAZ, no datos del backend.
// Nunca se guardan ni se leen del catálogo real — solo representan "el
// cliente decide saltar este paso opcional".
const NO_PRINT_OPTION: CustomizationChoice = { id: "none", name: "Liso (sin estampado)", priceModifier: 0 };
const NO_EMBROIDERY_OPTION: CustomizationChoice = { id: "none", name: "Sin bordado", priceModifier: 0 };

const EMPTY_CATALOG: CustomizationCatalogResponse = { catalogs: {} };

let cachedCatalogs: CustomizationCatalogResponse | null = null;

async function getCatalogs(): Promise<CustomizationCatalogResponse> {
  if (cachedCatalogs) return cachedCatalogs;
  try {
    // La API puede responder con `{ catalogs: {...} }` o, si está detrás de un
    // proxy/genérico, envuelta en `{ data: {...} }`. Se normaliza aquí.
    const raw = await clientApiFetch<CustomizationCatalogResponse | { data: CustomizationCatalogResponse }>(
      "customization/options"
    );
    const parsed = (raw as { data?: CustomizationCatalogResponse }).data ?? (raw as CustomizationCatalogResponse);
    cachedCatalogs = parsed?.catalogs ? parsed : EMPTY_CATALOG;
  } catch {
    cachedCatalogs = EMPTY_CATALOG;
  }
  return cachedCatalogs;
}

export async function getFabrics(): Promise<CustomizationChoice[]> {
  const { catalogs } = await getCatalogs();
  return (catalogs.Tela ?? []).map(adapt);
}

export async function getColors(): Promise<CustomizationChoice[]> {
  const { catalogs } = await getCatalogs();
  return (catalogs.Color ?? []).map(adapt);
}

export async function getPrints(): Promise<CustomizationChoice[]> {
  const { catalogs } = await getCatalogs();
  return [NO_PRINT_OPTION, ...(catalogs.Estampado ?? []).map(adapt)];
}

export async function getEmbroideries(): Promise<CustomizationChoice[]> {
  const { catalogs } = await getCatalogs();
  return [NO_EMBROIDERY_OPTION, ...(catalogs.Bordado ?? []).map(adapt)];
}

interface ApiProductListItem {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  thumbnailUrl?: string | null;
  sizes: string[];
}

let cachedModels: CustomizationModel[] | null = null;

// Algunas respuestas llegan como arreglo directo; otras vienen envueltas en
// `{ data: [...] }`, `{ items: [...] }` o `{ products: [...] }`. Se extrae el
// arreglo real para que el componente consumidor reciba siempre una lista.
function unwrapList<T>(payload: unknown): T[] {
  const data = (payload as { data?: unknown; items?: unknown; products?: unknown })?.data
    ?? (payload as { items?: unknown })?.items
    ?? (payload as { products?: unknown })?.products
    ?? payload;
  return Array.isArray(data) ? (data as T[]) : [];
}

export async function getModels(): Promise<CustomizationModel[]> {
  if (cachedModels) return cachedModels;
  try {
    const list = unwrapList<ApiProductListItem>(await clientApiFetch("products"));
    cachedModels = list.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.basePrice,
      image: p.thumbnailUrl ?? "",
      sizes: Array.isArray(p.sizes) ? p.sizes : [],
    }));
  } catch {
    cachedModels = [];
  }
  return cachedModels;
}
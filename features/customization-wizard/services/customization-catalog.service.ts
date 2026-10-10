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
// Nunca se guardan ni se leen del cat-logo real - solo representan "el
// cliente decide saltar este paso opcional".
const NO_PRINT_OPTION: CustomizationChoice = { id: "none", name: "Liso (sin estampado)", priceModifier: 0 };
const NO_EMBROIDERY_OPTION: CustomizationChoice = { id: "none", name: "Sin bordado", priceModifier: 0 };

const EMPTY_CATALOG: CustomizationCatalogResponse = { catalogs: {} };

let cachedCatalogs: CustomizationCatalogResponse | null = null;

async function getCatalogs(): Promise<CustomizationCatalogResponse> {
  if (cachedCatalogs) return cachedCatalogs;
  try {
    // La API puede responder con `{ catalogs: {...} }` o, si est- detr-s de un
    // proxy/gen-rico, envuelta en `{ data: {...} }`. Se normaliza aqu-.
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

export interface CustomizableModelsPage {
  items: CustomizationModel[];
  page: number;
  pageSize: number;
  totalCount: number;
  hasMore: boolean;
}

interface ApiCustomizableProduct {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  thumbnailUrl?: string | null;
  sizes: string[];
}

interface ApiCustomizablePage {
  items: ApiCustomizableProduct[];
  page: number;
  pageSize: number;
  totalCount: number;
  hasMore: boolean;
}

function adaptModel(p: ApiCustomizableProduct): CustomizationModel {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.basePrice,
    image: p.thumbnailUrl ?? "",
    sizes: Array.isArray(p.sizes) ? p.sizes : [],
  };
}

export async function getCustomizableModels(page: number, pageSize = 6): Promise<CustomizableModelsPage> {
  const fallback: CustomizableModelsPage = { items: [], page, pageSize, totalCount: 0, hasMore: false };
  try {
    const raw = await clientApiFetch<ApiCustomizablePage | { data?: ApiCustomizablePage }>(
      `products/customizable?page=${page}&pageSize=${pageSize}`
    );
    const parsed = (raw as { data?: ApiCustomizablePage }).data ?? (raw as ApiCustomizablePage);
    const items = (Array.isArray(parsed?.items) ? parsed.items : []).map(adaptModel);
    return {
      items,
      page: parsed?.page ?? page,
      pageSize: parsed?.pageSize ?? pageSize,
      totalCount: parsed?.totalCount ?? items.length,
      hasMore: Boolean(parsed?.hasMore),
    };
  } catch {
    return fallback;
  }
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ASISTENTE DE ESTILO (GEMINI) - DESACTIVADO
Tipos y funciones del asistente comentados temporalmente.
Reactivar: quitar el prefijo `// ` de las lineas siguientes y
descomentar los puntos marcados igual en ai-assistant-panel.tsx
y en app/personaliza/page.tsx.
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
// // - Asistente de estilo (Gemini) -
// // Recomendaciones de texto validadas contra el cat-logo real. No hay generaci-n
// // de im-genes: el preview del producto sigue siendo el del cat-logo.
//
// export interface AssistantSuggestion {
//   telaId: string | null;
//   colorId: string | null;
//   estampadoId: string | null;
//   bordadoId: string | null;
// }
//
// export interface AssistantResult {
//   reply: string;
//   suggestion: AssistantSuggestion;
//   embroideryText?: string | null;
// }
//
// /** True solo si el backend tiene Gemini configurado y habilitado. */
// export async function getAssistantStatus(): Promise<boolean> {
//   try {
//     const raw = await clientApiFetch<{ enabled?: boolean } | { data?: { enabled?: boolean } }>(
//       "customization/assistant"
//     );
//     const parsed = (raw as { data?: { enabled?: boolean } }).data ?? (raw as { enabled?: boolean });
//     return Boolean(parsed?.enabled);
//   } catch {
//     return false;
//   }
// }
//
// /** Devuelve null si el asistente no est- disponible o falla. */
// export async function suggestCustomization(input: {
//   message: string;
//   productSlug?: string;
//   currentSelection?: Record<string, string>;
// }): Promise<AssistantResult | null> {
//   try {
//     const raw = await clientApiFetch<AssistantResult | { data?: AssistantResult }>(
//       "customization/assistant",
//       { method: "POST", body: input }
//     );
//     const parsed = (raw as { data?: AssistantResult }).data ?? (raw as AssistantResult);
//     if (!parsed || typeof parsed.reply !== "string") return null;
//
//     return {
//       reply: parsed.reply,
//       suggestion: {
//         telaId: parsed.suggestion?.telaId ?? null,
//         colorId: parsed.suggestion?.colorId ?? null,
//         estampadoId: parsed.suggestion?.estampadoId ?? null,
//         bordadoId: parsed.suggestion?.bordadoId ?? null,
//       },
//       embroideryText: parsed.embroideryText ?? null,
//     };
//   } catch {
//     return null;
//   }
// }

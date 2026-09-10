import { clientApiFetch } from "@/lib/api/client-fetch";
import type { CustomizationChoice } from "../types";

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

let cachedCatalogs: CustomizationCatalogResponse | null = null;

async function getCatalogs(): Promise<CustomizationCatalogResponse> {
  if (!cachedCatalogs) {
    cachedCatalogs = await clientApiFetch<CustomizationCatalogResponse>("customization/options");
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
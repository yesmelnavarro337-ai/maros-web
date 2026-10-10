import type { CatalogSearchParams } from "./types";

export function buildCatalogHref(current: CatalogSearchParams, patch: Partial<CatalogSearchParams>): string {
  const merged = { ...current, ...patch };
  const params = new URLSearchParams();
  Object.entries(merged).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return query ? `/catalogo?${query}` : "/catalogo";
}

/** Convierte un valor de searchParam separado por comas en una lista limpia. */
export function parseFilterList(value?: string): string[] {
  return value
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

/** ¿El valor está seleccionado dentro del searchParam multi-valor? */
export function isFilterValueActive(value: string | undefined, item: string): boolean {
  const key = item.trim().toLowerCase();
  return parseFilterList(value).some((current) => current.toLowerCase() === key);
}

/** Agrega o quita un valor del searchParam y devuelve el string resultante. */
export function toggleFilterValue(value: string | undefined, item: string): string | undefined {
  const list = parseFilterList(value);
  const key = item.trim().toLowerCase();
  const exists = list.some((current) => current.toLowerCase() === key);
  const next = exists
    ? list.filter((current) => current.toLowerCase() !== key)
    : [...list, item.trim()];
  return next.length > 0 ? next.join(",") : undefined;
}

/** Cuenta cada valor seleccionado individualmente (no cada sección). */
export function countActiveFilters(current: CatalogSearchParams): number {
  return (
    parseFilterList(current.categoria).length +
    parseFilterList(current.talla).length +
    parseFilterList(current.color).length +
    (current.buscar ? 1 : 0) +
    (current.precioMin || current.precioMax ? 1 : 0)
  );
}

export function formatCOP(value: number): string {
  return `$${Math.round(value).toLocaleString("es-CO")}`;
}

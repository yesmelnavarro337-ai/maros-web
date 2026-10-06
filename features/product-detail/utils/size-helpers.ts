import { isInfantilCategory, resolveInfantilStyle } from "./price-helpers";
import { sortSizes } from "@/lib/sizes";

/* ─────────────────────────── Catálogos de tallas por línea ─────────────────────────── */

/**
 * Tallas de la línea de adultos (los 9 modelos estándar).
 * XL, XXL y 2XL son "talla > L" y reciben el recargo de +$10.000 COP.
 */
export const ADULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "2XL"] as const;

/**
 * Tallas de la línea infantil.
 * El rango Juvenil (10, 12, 14, 16) recibe el recargo de +$10.000 COP sobre el
 * precio base del estilo.
 */
export const INFANT_SIZES = [
  "0-3M",
  "3-6M",
  "6-12M",
  "12-18M",
  "2T",
  "4",
  "6",
  "8",
  "10",
  "12",
  "14",
  "16",
] as const;

export type SizeLine = "adulto" | "infantil";

/** Normaliza una talla para comparar sin depender de espacios ni mayúsculas. */
export function normalizeSizeKey(size?: string | null): string {
  return (size ?? "").trim().toUpperCase().replace(/\s+/g, "");
}

/**
 * Indica si un nombre de estilo pertenece a la línea infantil.
 * Acepta el sufijo canónico "(Infantil)" de la entidad Style y los alias
 * heredados sin sufijo ("Pantalón y camisa manga corta", "Short y camisa manga
 * corta"). Los estilos de adulto, que llevan "(Mujer)" / "(Hombre)", nunca
 * se clasifican como infantiles aunque compartan la misma firma base.
 */
export function isInfantilStyleName(styleName?: string | null): boolean {
  return resolveInfantilStyle(styleName) !== null;
}

/**
 * Resuelve la línea de tallas a partir del ESTILO SELECCIONADO.
 *
 * El estilo manda: un estilo de adulto nunca debe mostrar tallas infantiles,
 * aunque el producto esté en la categoría "Niños y Bebes" y sus variantes
 * contengan tallas de ambas líneas. La categoría sólo se usa como respaldo
 * cuando todavía no hay ningún estilo elegido.
 */
export function resolveSizeLine(
  styleName?: string | null,
  isInfantilCategoryFlag = false
): SizeLine {
  const style = (styleName ?? "").trim();
  if (!style) return isInfantilCategoryFlag ? "infantil" : "adulto";
  return isInfantilStyleName(style) ? "infantil" : "adulto";
}

/**
 * Catálogo de tallas permitidas para el estilo y la categoría indicados.
 * @param styleName estilo seleccionado (puede ser null si aún no hay ninguno)
 * @param isInfantilCategoryFlag true si el producto pertenece a la línea infantil
 */
export function getAvailableSizesByStyle(
  styleName: string | null,
  isInfantilCategoryFlag: boolean
): readonly string[] {
  return resolveSizeLine(styleName, isInfantilCategoryFlag) === "infantil"
    ? INFANT_SIZES
    : ADULT_SIZES;
}

/** Conjunto normalizado de tallas permitidas, para comparaciones rápidas. */
export function getAllowedSizeSet(
  styleName: string | null,
  isInfantilCategoryFlag: boolean
): Set<string> {
  return new Set(getAvailableSizesByStyle(styleName, isInfantilCategoryFlag).map(normalizeSizeKey));
}

/**
 * Filtra EXCLUSIVAMENTE las tallas del producto según el estilo seleccionado.
 *
 * Un estilo de adulto muestra sólo tallas de adulto y uno infantil sólo tallas
 * infantiles, aunque las variantes del producto contengan tallas de ambas líneas.
 * Las tallas de la OTRA línea nunca se muestran para el estilo activo, ni
 * siquiera cuando el producto no tiene ninguna talla de la línea correcta: en
 * ese caso el selector queda vacío, que es el comportamiento exclusivo pedido.
 *
 * El resultado se devuelve en el orden canónico (SIZE_ORDER) para que los
 * botones de Talla siempre se muestren de menor a mayor y no según el orden
 * arbitrario en que la API devolvió las variantes.
 *
 * Única excepción: si el producto no tiene ninguna talla de ninguno de los dos
 * catálogos (tallas totalmente personalizadas heredadas), se conservan todas
 * para no dejar el producto sin opciones seleccionables.
 */
export function filterSizesForStyle(
  productSizes: string[],
  styleName: string | null,
  isInfantilCategoryFlag: boolean
): string[] {
  const allowed = getAllowedSizeSet(styleName, isInfantilCategoryFlag);
  const known = new Set<string>([...ADULT_SIZES, ...INFANT_SIZES].map(normalizeSizeKey));

  const exclusive = productSizes.filter((size) => allowed.has(normalizeSizeKey(size)));
  if (exclusive.length > 0) return sortSizes(exclusive);

  const anyKnown = productSizes.some((size) => known.has(normalizeSizeKey(size)));
  return anyKnown ? [] : sortSizes(productSizes);
}

/**
 * Devuelve la talla que debe quedar seleccionada tras un cambio de estilo:
 * la actual si sigue siendo válida y, en caso contrario, la primera disponible.
 */
export function resolveSelectedSize(
  currentSize: string,
  availableSizes: string[]
): string {
  const normalized = normalizeSizeKey(currentSize);
  const stillValid = availableSizes.some((s) => normalizeSizeKey(s) === normalized);
  if (stillValid) return currentSize;
  return availableSizes[0] ?? "";
}

export { isInfantilCategory };
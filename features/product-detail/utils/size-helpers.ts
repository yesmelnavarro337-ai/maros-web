import {
  isInfantilCategory,
  resolveInfantilStyle,
  ADULT_STYLES,
  INFANTIL_STYLES,
} from "./price-helpers";
import { sortSizes } from "@/lib/sizes";

/* ─────────────────────────── Catálogos de tallas por línea ─────────────────────────── */

/**
 * Tallas de la línea de adultos (los 9 modelos estándar).
 * Recargos automáticos: XL (+ $10.000 COP), 2XL (+ $25.000 COP) y 3XL (+ $30.000 COP).
 * La talla XXL queda eliminada y unificada/reemplazada por 2XL.
 */
export const ADULT_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"] as const;

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

/** Normaliza una talla para comparar sin depender de espacios ni mayúsculas, unificando XXL a 2XL. */
export function normalizeSizeKey(size?: string | null): string {
  const norm = (size ?? "").trim().toUpperCase().replace(/\s+/g, "");
  return norm === "XXL" ? "2XL" : norm;
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

  // Si el producto no tiene variantes explícitas con tallas de la línea activa,
  // devolvemos el catálogo completo de la línea para permitir cotizar o personalizar
  // (Adultos: XS a 3XL; Infantil: 0-3M a 16).
  const isInfantil = resolveSizeLine(styleName, isInfantilCategoryFlag) === "infantil";
  return isInfantil ? [...INFANT_SIZES] : [...ADULT_SIZES];
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

export function isAdultSize(size?: string | null): boolean {
  if (!size) return false;
  return ADULT_SIZES.includes(normalizeSizeKey(size) as any);
}

export function isInfantilSize(size?: string | null): boolean {
  if (!size) return false;
  return INFANT_SIZES.includes(normalizeSizeKey(size) as any);
}

/**
 * Determina la línea inicial (adulto vs infantil) priorizando SIEMPRE la línea de adultos
 * cuando existan estilos, tallas o variantes de adulto disponibles.
 * Solo selecciona "infantil" si el producto es estrictamente infantil (ej: categoría infantil
 * y sin ningún estilo, talla o variante de adulto).
 */
export function resolveInitialLine(
  product?: {
    categoryName?: string | null;
    categories?: { name?: string; slug?: string }[] | null;
    styles?: string[] | null;
    sizes?: string[] | null;
    variants?: { styleName?: string | null; size?: string | null }[] | null;
  } | null,
  categorySlug?: string
): SizeLine {
  if (!product) return "adulto";

  const isCatInfantil =
    isInfantilCategory(product.categoryName) ||
    isInfantilCategory(categorySlug) ||
    (product.categories?.some((c) => isInfantilCategory(c.name) || isInfantilCategory(c.slug)) ?? false);

  const hasAdultStyles = (product.styles || []).some((st) => !isInfantilStyleName(st));
  const hasAdultSizes = (product.sizes || []).some((s) => isAdultSize(s));
  const hasAdultVariants = (product.variants || []).some(
    (v) => (!v.styleName || !isInfantilStyleName(v.styleName)) && (!v.size || isAdultSize(v.size))
  );

  // Si tiene cualquier indicio o disponibilidad de adultos, priorizamos adulto
  if (hasAdultStyles || hasAdultSizes || hasAdultVariants) {
    return "adulto";
  }

  // Si es estrictamente de categoría infantil sin opciones de adulto
  if (isCatInfantil) {
    return "infantil";
  }

  return "adulto";
}

/**
 * Obtiene el estilo inicial según la línea activa, priorizando estilos de adulto cuando line === 'adulto'.
 */
export function resolveInitialStyle(styles?: string[] | null, line: SizeLine = "adulto"): string {
  const rawStyles = styles && styles.length > 0 ? styles : [];
  const filtered = rawStyles.filter((st) =>
    line === "infantil" ? isInfantilStyleName(st) : !isInfantilStyleName(st)
  );

  if (filtered.length > 0) return filtered[0];

  return line === "infantil" ? INFANTIL_STYLES[0].name : ADULT_STYLES[0].name;
}

/**
 * Obtiene la talla inicial para un estilo, priorizando tallas de adulto si no es infantil.
 */
export function resolveInitialSize(
  productSizes: string[] | undefined | null,
  styleName: string | null,
  isInfantil: boolean
): string {
  const available = filterSizesForStyle(productSizes || [], styleName, isInfantil);
  if (!isInfantil) {
    const adultCandidate = available.find((s) => isAdultSize(s));
    if (adultCandidate) return adultCandidate;
  }
  return available[0] ?? "";
}

export { isInfantilCategory };
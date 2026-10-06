import type { ProductDetailCategory } from "../types";

/** Rango de fechas del 5% de descuento activo a todo el catálogo (04 de octubre al 09 de noviembre). */
export const PROMO_DISCOUNT_PERCENT = 0.05;

export function isPromoActive(currentDate = new Date()): boolean {
  const year = currentDate.getFullYear();
  // Mes 9 es Octubre (0-indexed: 0=Enero ... 9=Octubre)
  const startDate = new Date(year, 9, 4, 0, 0, 0);
  // Mes 10 es Noviembre (10=Noviembre)
  const endDate = new Date(year, 10, 9, 23, 59, 59);

  return currentDate >= startDate && currentDate <= endDate;
}

/** Determina si una talla es mayor a L (> L). */
const PLUS_SIZES = new Set(["XL", "2XL", "XXL", "3XL", "XXXL", "4XL", "XXXXL", "5XL"]);

export function isLargeSize(size?: string | null): boolean {
  if (!size) return false;
  const s = size.trim().toUpperCase();
  return PLUS_SIZES.has(s) || (s.length >= 2 && s.includes("XL"));
}

/**
 * Extrae el género declarado en el texto. Los estilos mixtos
 * ("Hombre / Mujer") se consideran sin género porque su tarifa es única.
 */
function detectGender(text: string): "hombre" | "mujer" | null {
  const hasHombre = text.includes("hombre");
  const hasMujer = text.includes("mujer");
  if (hasHombre && hasMujer) return null;
  if (hasHombre) return "hombre";
  if (hasMujer) return "mujer";
  return null;
}

const isPantalon = (text: string) => text.includes("pantalón") || text.includes("pantalon");

/* ─────────────────────────── Línea "Pijamas de Niños" ─────────────────────────── */

/** Recargo COP que se aplica a las tallas juvenile (10 a 16). */
export const INFANTIL_YOUTH_SURCHARGE = 10000;

/**
 * Tokens que identifican una prenda infantil. Se comparan sobre el texto normalizado
 * sin tildes, por lo que "Niños y Bebes", "ninos-y-bebes" o "Infantil" coinciden.
 */
const INFANTIL_CATEGORY_TOKENS = ["nino", "infantil", "bebe", "kids", "child"];

/** Rango Pequeños: se aplica el precio base del estilo. */
export const INFANTIL_SMALL_SIZES = [
  "0-3M",
  "3-6M",
  "6-12M",
  "12-18M",
  "2T",
  "4",
  "6",
  "8",
] as const;

/** Rango Juvenil: se aplica el precio base del estilo + recargo. */
export const INFANTIL_YOUTH_SIZES = ["10", "12", "14", "16"] as const;

/**
 * Precios base de la línea infantil por estilo (rango Pequeños).
 * Las tallas 10 a 16 se obtienen sumando INFANTIL_YOUTH_SURCHARGE:
 * Pantalón corta 75.000 -> 85.000 | Short corta 65.000 -> 75.000 | Pantalón larga 90.000 -> 100.000
 *
 * Los nombres coinciden con los estilos de la entidad Style (migración
 * AddInfantilStyles). El sufijo "(Infantil)" sustituye al de género de los estilos
 * de adulto, por lo que la coincidencia es exacta y no absorbe prendas de adulto.
 */
export const INFANTIL_STYLES = [
  { name: "Pantalón - Camisa manga corta (Infantil)", price: 75000 },
  { name: "Short - Camisa manga corta (Infantil)", price: 65000 },
  { name: "Pantalón - Camisa manga larga (Infantil)", price: 90000 },
] as const;

/** Normaliza texto para comparaciones (minúsculas, sin tildes, espacios colapsados). */
function normalizeText(value?: string | null): string {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Normaliza una talla: mayúsculas y sin espacios ("2 T" -> "2T", "0-3 m" -> "0-3M"). */
export function normalizeSizeKey(size?: string | null): string {
  return (size ?? "").trim().toUpperCase().replace(/\s+/g, "");
}

/** Indica si el producto pertenece a la línea infantil. */
export function isInfantilCategory(categoryName?: string | null): boolean {
  return INFANTIL_CATEGORY_TOKENS.some((token) => normalizeText(categoryName).includes(token));
}

export type InfantilSizeTier = "Pequenos" | "Juvenil";

/**
 * Clasifica una talla dentro de la línea infantil.
 * Devuelve null para tallas de adulto o tallas no reconocidas.
 */
export function getInfantilSizeTier(size?: string | null): InfantilSizeTier | null {
  const key = normalizeSizeKey(size);
  if (!key) return null;

  if ((INFANTIL_YOUTH_SIZES as readonly string[]).includes(key)) return "Juvenil";
  if ((INFANTIL_SMALL_SIZES as readonly string[]).includes(key)) return "Pequenos";

  // Tolerancia a variantes de captura: "12A", "14ANOS", "6T", "4A".
  const numeric = /^(\d{1,2})(?:M|T|A|ANOS)?$/.exec(key);
  if (numeric) {
    const value = Number(numeric[1]);
    if (value >= 10) return "Juvenil";
    if (value >= 2) return "Pequenos";
  }
  return null;
}

/** True cuando la talla pertenece al rango Juvenil (10 a 16). */
export function isInfantilYouthSize(size?: string | null): boolean {
  return getInfantilSizeTier(size) === "Juvenil";
}

/**
 * Firma de un estilo: minúsculas, sin tildes, sin sufijos entre paréntesis y sin
 * separadores ni conectores. Permite comparar "Short - Camisa manga corta
 * (Infantil)" con el alias heredado "Short y camisa manga corta".
 */
function styleSignature(value?: string | null): string {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    // Los conectores de los alias heredados ("Pantalón y Camisa...") no forman
    // parte del nombre del estilo canónico.
    .replace(/\s+(?:y|de|del|con|para|la|el|los|las)\s+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Los 9 estilos de adulto se distinguen por el sufijo de género "(Mujer)" / "(Hombre)". */
function hasAdultGenderMarker(value?: string | null): boolean {
  const text = normalizeText(value);
  return text.includes("mujer") || text.includes("hombre");
}

/**
 * Resuelve el estilo infantil canónico a partir del nombre, aceptando también los
 * alias heredados sin sufijo "(Infantil)" (p. ej. "Short y camisa manga corta").
 * Un marcador de género adulto siempre gana, porque los 9 modelos oficiales
 * llevan "(Mujer)" / "(Hombre)" y comparten firma base con los infantiles.
 */
export function resolveInfantilStyle(styleName?: string | null) {
  const key = normalizeText(styleName);
  if (!key) return null;
  // Un marcador de género adulto siempre gana: los 9 modelos oficiales llevan
  // "(Mujer)" / "(Hombre)" y comparten firma base con los estilos infantiles.
  if (hasAdultGenderMarker(styleName)) return null;
  if (key.includes("infantil")) {
    const exact = INFANTIL_STYLES.find((s) => normalizeText(s.name) === key);
    if (exact) return exact;
  }
  const signature = styleSignature(styleName);
  if (!signature) return null;
  return INFANTIL_STYLES.find((s) => styleSignature(s.name) === signature) ?? null;
}

/**
 * Precio base infantil de un estilo (rango Pequeños) o null si el estilo
 * no pertenece a la línea infantil. Acepta los nombres canónicos con sufijo
 * "(Infantil)" y los alias heredados sin sufijo.
 */
export function getInfantilBasePrice(styleName?: string | null): number | null {
  return resolveInfantilStyle(styleName)?.price ?? null;
}

/**
 * True cuando el producto se priced con la tabla infantil: basta con que la
 * categoría sea infantil o con que el estilo pertenezca al catálogo infantil
 * (canónico o alias). Evita aplicar el recargo juvenil a prendas de adulto, ya
 * que los 9 modelos oficiales llevan "(Mujer)" / "(Hombre)".
 */
export function isInfantilPriced(
  categoryName?: string | null,
  styleName?: string | null
): boolean {
  return isInfantilCategory(categoryName) || getInfantilBasePrice(styleName) !== null;
}

/**
 * Tabla de precios fijos base según Estilo Fijo (tarifa oficial del Admin):
 * 1. Short - Camisa manga corta (Mujer): $85.000 COP
 * 2. Short - Camisa manga corta (Hombre): $95.000 COP
 * 3. Batas: $85.000 COP (tarifa única)
 * 4. Pantalón - Camisa manga corta (Mujer): $115.000 COP
 * 5. Pantalón - Camisa manga corta (Hombre): $120.000 COP
 * 6. Pantalón - Camisa manga larga (Mujer): $135.000 COP
 * 7. Pantalón - Camisa manga larga (Hombre): $140.000 COP
 * 8. Short - Camiseta (Hombre / Mujer): $70.000 COP
 * 9. Pantalón - Camiseta (Hombre / Mujer): $85.000 COP
 *
 * El género declarado en el nombre del ESTILO es el que manda: una categoría
 * "Hombre" nunca debe alterar la tarifa de un estilo marcado como "(Mujer)".
 */
export function getFixedBasePrice(
  categoryName?: string | null,
  styleName?: string | null,
  fallbackBasePrice?: number
): number {
  const cat = (categoryName || "").toLowerCase();
  const st = (styleName || "").toLowerCase();

  // Prioridad 0: línea infantil. Los estilos infantiles no llevan sufijo de
  // género, por lo que deben resolverse antes que las reglas de adulto
  // (si no, "Pantalón - Camisa manga corta" caería en la tarifa de $115.000).
  if (isInfantilPriced(cat, st)) {
    const infantilPrice = getInfantilBasePrice(st);
    if (infantilPrice !== null) return infantilPrice;
  }

  // Prioridad: género del estilo > género de la categoría.
  const gender = detectGender(st) ?? detectGender(cat);

  // Reglas por Estilo (fuente de verdad de la tarifa)
  if (st.includes("camiseta")) {
    if (st.includes("short")) return 70000;
    if (isPantalon(st)) return 85000;
  }

  // Batas: tarifa única, independiente del género y de la categoría.
  if (st.includes("bata")) return 85000;

  if (isPantalon(st)) {
    if (st.includes("larga")) return gender === "hombre" ? 140000 : 135000;
    return gender === "hombre" ? 120000 : 115000;
  }

  if (st.includes("short") || st.includes("camisa")) {
    return gender === "hombre" ? 95000 : 85000;
  }

  // Sin estilo reconocible: reglas por Categoría
  if (cat.includes("bata")) return 85000;
  if (isPantalon(cat)) return gender === "hombre" ? 120000 : 115000;
  if (cat.includes("short") || cat.includes("camisa")) {
    return gender === "hombre" ? 95000 : 85000;
  }
  if (gender === "hombre") return 120000;
  if (gender === "mujer") return 115000;

  return fallbackBasePrice && fallbackBasePrice > 0 ? fallbackBasePrice : 115000;
}

export interface CalculatedPriceDetails {
  basePrice: number;
  sizeSurcharge: number;
  infantilSurcharge: number;
  embroiderySurcharge: number;
  subtotalPrice: number; // Subtotal sin descuento (base + recargos)
  discountAmount: number; // 5% de descuento sobre precio base
  finalPrice: number; // PrecioFinal = (PrecioEstiloBase - 5% Desc) + (Talla > L ? $10.000 : 0) + (Juvenil ? $10.000 : 0) + (Bordado ? $7.000 : 0)
  hasDiscount: boolean;
  isPlusSize: boolean;
  isInfantilYouthSize: boolean;
  hasEmbroidery: boolean;
}

export function calculateProductPriceDetails({
  basePrice: productBasePrice,
  variantPrice,
  categoryName,
  styleName,
  size,
  hasEmbroidery = false,
}: {
  basePrice?: number;
  variantPrice?: number | null;
  categoryName?: string | null;
  styleName?: string | null;
  size?: string | null;
  hasEmbroidery?: boolean;
}): CalculatedPriceDetails {
  // Si la variante trae precio, éste ya es el precio final de esa variante
  // (el Admin ya le aplicó el recargo de rango), así que no se vuelve a sumar.
  const usesVariantPrice = variantPrice != null && variantPrice > 0;

  // Talla mayor a L
  const isPlusSize = isLargeSize(size);
  const sizeSurcharge = isPlusSize ? 10000 : 0;

  // Rango Juvenil infantil (tallas 10 a 16): +$10.000 sobre el precio base.
  const infantilYouth = isInfantilPriced(categoryName, styleName) && isInfantilYouthSize(size);

  // Cuando el precio viene de la variante, ese precio ya incluye el recargo de
  // rango. Se revierte para recuperar la base y así aplicar el 5% sobre la base
  // (misma convención que las tallas > L). Sin esto, el mismo producto/talla
  // mostraría precios distintos según se haya guardado o no el precio de la variante.
  const variantSurcharge = isPlusSize
    ? 10000
    : infantilYouth
      ? INFANTIL_YOUTH_SURCHARGE
      : 0;

  // 1. Determinar precio base fijo del estilo/producto
  const basePrice = usesVariantPrice
    ? variantPrice - variantSurcharge
    : getFixedBasePrice(categoryName, styleName, productBasePrice);

  const infantilSurcharge = infantilYouth ? INFANTIL_YOUTH_SURCHARGE : 0;

  // 3. Recargo por bordado (+7.000 COP)
  const embroiderySurcharge = hasEmbroidery ? 7000 : 0;

  // 4. Aplicar descuento del 5% si la fecha está entre 04 Oct y 09 Nov (aplicado sobre precio base)
  const hasDiscount = isPromoActive();
  const discountAmount = hasDiscount ? Math.round(basePrice * PROMO_DISCOUNT_PERCENT) : 0;
  const baseAfterDiscount = basePrice - discountAmount;

  // PrecioFinal = (PrecioEstiloBase - 5% Desc) + (Talla > L ? $10.000 : 0) + (Juvenil ? $10.000 : 0) + (TieneBordado ? $7.000 : 0)
  const finalPrice = baseAfterDiscount + sizeSurcharge + infantilSurcharge + embroiderySurcharge;
  const subtotalPrice =
    basePrice + sizeSurcharge + infantilSurcharge + embroiderySurcharge;

  return {
    basePrice,
    sizeSurcharge,
    infantilSurcharge,
    embroiderySurcharge,
    subtotalPrice,
    discountAmount,
    finalPrice,
    hasDiscount,
    isPlusSize,
    isInfantilYouthSize: infantilYouth,
    hasEmbroidery,
  };
}

export function computeSizeSurcharge(
  variantPrice: number | null | undefined,
  basePrice: number
): number {
  if (variantPrice == null) return 0;
  const diff = variantPrice - basePrice;
  return diff > 0 ? diff : 0;
}

export function computeCategorySurcharge(
  category: ProductDetailCategory | undefined,
  basePrice: number
): number {
  if (!category) return 0;
  const categoryPrice = category.price ?? category.defaultPrice;
  if (categoryPrice == null) return 0;
  const diff = categoryPrice - basePrice;
  return diff > 0 ? diff : 0;
}

export function findActiveCategory(
  categories: ProductDetailCategory[],
  filterCategorySlug?: string
): ProductDetailCategory | undefined {
  if (!filterCategorySlug) return undefined;
  const slugLower = filterCategorySlug.toLowerCase();
  return categories.find(
    (c) =>
      c.slug?.toLowerCase() === slugLower ||
      c.id?.toLowerCase() === slugLower
  );
}

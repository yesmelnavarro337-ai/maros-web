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

/** Recargos automáticos por talla de adulto */
export const SURCHARGE_XL = 10000;
export const SURCHARGE_2XL = 25000;
export const SURCHARGE_3XL = 30000;

export function getSizeSurcharge(size?: string | null): number {
  if (!size) return 0;
  const s = size.trim().toUpperCase().replace(/\s+/g, "");
  if (s === "3XL" || s === "XXXL" || s === "4XL" || s === "XXXXL" || s === "5XL") return SURCHARGE_3XL;
  if (s === "2XL" || s === "XXL") return SURCHARGE_2XL;
  if (s === "XL") return SURCHARGE_XL;
  if (isLargeSize(size)) return SURCHARGE_XL;
  return 0;
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

/**
 * Nota: Las tallas juveniles (10 a 16) NO tienen recargo.
 * Todas las tallas infantiles comparten el mismo precio base del estilo.
 */

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

/** Rango Juvenil: se aplica el mismo precio base del estilo (sin recargo). */
export const INFANTIL_YOUTH_SIZES = ["10", "12", "14", "16"] as const;

/**
 * Precios base de la línea infantil por estilo.
 * Todas las tallas (Pequeños y Juvenil) comparten el mismo precio base.
 * Pantalón corta 75.000 | Short corta 65.000 | Pantalón larga 90.000
 *
 * Los nombres coinciden con los estilos de la entidad Style (migración
 * AddInfantilStyles). El sufijo "(Infantil)" sustituye al de género de los estilos
 * de adulto, por lo que la coincidencia es exacta y no absorbe prendas de adulto.
 */
export const INFANTIL_STYLES = [
  { name: "Short - Camiseta (Infantil)", price: 55000 },
  { name: "Pantalón - Camiseta (Infantil)", price: 65000 },
  { name: "Short - Camisa manga corta (Infantil)", price: 65000 },
  { name: "Pantalón - Camisa manga corta (Infantil)", price: 75000 },
  { name: "Pantalón - Camisa manga larga (Infantil)", price: 90000 },
] as const;

export const ADULT_STYLES = [
  { name: "Short - Tiras (Mujer)", price: 65000 },
  { name: "Short - Camisa manga corta (Mujer)", price: 85000 },
  { name: "Short - Camisa manga corta (Hombre)", price: 95000 },
  { name: "Batas", price: 85000 },
  { name: "Pantalón - Camisa manga corta (Mujer)", price: 115000 },
  { name: "Pantalón - Camisa manga corta (Hombre)", price: 120000 },
  { name: "Pantalón - Camisa manga larga (Mujer)", price: 135000 },
  { name: "Pantalón - Camisa manga larga (Hombre)", price: 140000 },
  { name: "Short - Camiseta (Hombre / Mujer)", price: 70000 },
  { name: "Pantalón - Camiseta (Hombre / Mujer)", price: 85000 },
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
  // Un marcador de género adulto siempre gana: los modelos oficiales llevan
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
 * Precio base infantil de un estilo según la talla elegida.
 * - Short - Camiseta: tallas <= 8 -> $55.000 COP | tallas 10-16 -> $65.000 COP
 * - Pantalón - Camiseta: tallas <= 8 -> $65.000 COP | tallas 10-16 -> $75.000 COP
 * - Pantalón - Camisa manga corta: $75.000 COP
 * - Short - Camisa manga corta: $65.000 COP
 * - Pantalón - Camisa manga larga: $90.000 COP
 */
export function getInfantilBasePrice(styleName?: string | null, size?: string | null): number | null {
  const resolved = resolveInfantilStyle(styleName);
  if (!resolved) return null;

  const isYouth = isInfantilYouthSize(size);
  const signature = styleSignature(styleName);

  // Short - Camiseta (Infantil): <= 8 -> $55.000 | 10-16 -> $65.000
  if (signature.includes("short") && signature.includes("camiseta")) {
    return isYouth ? 65000 : 55000;
  }

  // Pantalón - Camiseta (Infantil): <= 8 -> $65.000 | 10-16 -> $75.000
  if ((signature.includes("pantalon") || signature.includes("pantalón")) && signature.includes("camiseta")) {
    return isYouth ? 75000 : 65000;
  }

  return resolved.price;
}

/**
 * True cuando el producto se priced con la tabla infantil: basta con que la
 * categoría sea infantil o con que el estilo pertenezca al catálogo infantil
 * (canónico o alias).
 */
export function isInfantilPriced(
  categoryName?: string | null,
  styleName?: string | null
): boolean {
  return isInfantilCategory(categoryName) || getInfantilBasePrice(styleName) !== null;
}

/**
 * Tabla de precios fijos base según Estilo Fijo:
 * Adultos:
 * - Short - Tiras (Mujer): $65.000 COP
 * - Short - Camisa manga corta (Mujer): $85.000 COP
 * - Short - Camisa manga corta (Hombre): $95.000 COP
 * - Batas: $85.000 COP
 * - Pantalón - Camisa manga corta (Mujer): $115.000 COP
 * - Pantalón - Camisa manga corta (Hombre): $120.000 COP
 * - Pantalón - Camisa manga larga (Mujer): $135.000 COP
 * - Pantalón - Camisa manga larga (Hombre): $140.000 COP
 * - Short - Camiseta (Hombre / Mujer): $70.000 COP
 * - Pantalón - Camiseta (Hombre / Mujer): $85.000 COP
 *
 * Infantil:
 * - Short - Camiseta: $55.000 COP (hasta la 8) / $65.000 COP (10, 12, 14, 16)
 * - Pantalón - Camiseta: $65.000 COP (hasta la 8) / $75.000 COP (10, 12, 14, 16)
 * - Short - Camisa manga corta: $65.000 COP
 * - Pantalón - Camisa manga corta: $75.000 COP
 * - Pantalón - Camisa manga larga: $90.000 COP
 */
export function getFixedBasePrice(
  categoryName?: string | null,
  styleName?: string | null,
  fallbackBasePrice?: number,
  size?: string | null
): number {
  const cat = (categoryName || "").toLowerCase();
  const st = (styleName || "").toLowerCase();
  const isYouth = isInfantilYouthSize(size);

  // Prioridad 0: línea infantil. Si la categoría es infantil o el estilo pertenece a infantil,
  // se resuelve exclusivamente con las tarifas infantiles y nunca cae en tarifas de adulto.
  if (isInfantilPriced(cat, st)) {
    const infantilPrice = getInfantilBasePrice(st, size);
    if (infantilPrice !== null) return infantilPrice;

    // Si no coincide con un estilo canónico exacto, deducir por palabras clave infantiles:
    if (st.includes("camiseta") || cat.includes("camiseta")) {
      if (st.includes("short") || cat.includes("short")) return isYouth ? 65000 : 55000;
      if (isPantalon(st) || isPantalon(cat)) return isYouth ? 75000 : 65000;
    }
    if (st.includes("larga")) return 90000;
    if (st.includes("short") || cat.includes("short")) return 65000;
    if (isPantalon(st) || isPantalon(cat)) return 75000;

    // Respetar precio base del producto infantil si viene provisto y es razonable
    if (fallbackBasePrice && fallbackBasePrice > 0) return fallbackBasePrice;

    // Tarifa base por defecto para infantil
    return isYouth ? 65000 : 55000;
  }

  // Adultos:
  // Short - Tiras (Mujer) -> $65.000 COP
  if (st.includes("tiras") || cat.includes("tiras")) {
    return 65000;
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
  embroiderySurcharge: number;
  subtotalPrice: number; // Subtotal sin descuento (base + recargos)
  discountAmount: number; // 5% de descuento sobre precio base
  finalPrice: number; // PrecioFinal = (PrecioEstiloBase - 5% Desc) + recargo talla + bordado
  hasDiscount: boolean;
  isPlusSize: boolean;
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
  const isInfant = isInfantilPriced(categoryName, styleName);

  // 1. Determinar precio base acorde al estilo/modelo y talla seleccionada (fuente de verdad oficial)
  const styleOfficialBase = getFixedBasePrice(categoryName, styleName, productBasePrice, size);
  let basePrice = styleOfficialBase > 0
    ? styleOfficialBase
    : (productBasePrice && productBasePrice > 0 ? productBasePrice : (isInfant ? (isInfantilYouthSize(size) ? 65000 : 55000) : 115000));

  // Si no se obtuvo de la tarifa oficial y viene variantPrice, limpiamos el variantPrice
  // de posibles recargos de talla ya sumados en la base de datos para no duplicar el recargo.
  if (styleOfficialBase <= 0 && variantPrice != null && variantPrice > 0) {
    const embeddedSurcharge = isInfant ? 0 : getSizeSurcharge(size);
    basePrice = Math.max(0, variantPrice - embeddedSurcharge);
  }

  // 2. Recargos por talla:
  // - Adultos: XL (+$10.000), 2XL (+$25.000), 3XL (+$30.000)
  // - Infantil: SIN recargo en ninguna talla (ni pequeñas ni juveniles)
  const isPlusSize = isInfant ? false : isLargeSize(size);
  const sizeSurcharge = isInfant ? 0 : getSizeSurcharge(size);

  // 3. Recargo por bordado (+7.000 COP)
  const embroiderySurcharge = hasEmbroidery ? 7000 : 0;

  // 4. Aplicar descuento del 5% si la promoción está activa (aplicado de forma limpia sobre el precio base)
  const hasDiscount = isPromoActive();
  const discountAmount = hasDiscount ? Math.round(basePrice * PROMO_DISCOUNT_PERCENT) : 0;
  const baseAfterDiscount = basePrice - discountAmount;

  // Precio final y subtotal calculados acorde al modelo seleccionado + recargo de talla
  const finalPrice = baseAfterDiscount + sizeSurcharge + embroiderySurcharge;
  const subtotalPrice = basePrice + sizeSurcharge + embroiderySurcharge;

  return {
    basePrice,
    sizeSurcharge,
    embroiderySurcharge,
    subtotalPrice,
    discountAmount,
    finalPrice,
    hasDiscount,
    isPlusSize,
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

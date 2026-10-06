/**
 * Orden canónico de tallas de Maro's Pijamas.
 *
 * Se usa en toda la tienda para que las tallas se muestren siempre en el mismo
 * orden: primero la línea infantil (de la más pequeña a la más grande) y luego
 * la de adultos. Sin esto, el orden depende del que traiga la API y las tarjetas,
 * el filtro lateral y los selectores pueden mostrar tallas desordenadas.
 */
export const SIZE_ORDER = [
  // Línea infantil
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
  // Línea adultos
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "2XL",
] as const;

export type KnownSize = (typeof SIZE_ORDER)[number];

/** Índice de cada talla canónica, para ordenar sin búsquedas repetidas. */
const SIZE_RANK: ReadonlyMap<string, number> = new Map(
  SIZE_ORDER.map((size, index) => [size, index])
);

/**
 * Normaliza una talla para compararla con SIZE_ORDER sin depender de
 * mayúsculas, espacios ni guiones Circunflexos.
 */
function sizeKey(size: string): string {
  return size.trim().toUpperCase().replace(/\s+/g, "");
}

/** Rango de las tallas que no están en el catálogo, para que queden al final. */
const UNKNOWN_RANK = SIZE_ORDER.length;

/**
 * Ordena tallas según SIZE_ORDER.
 *
 * - Las tallas del catálogo quedan en su posición canónica.
 * - Las tallas desconocidas (datos heredados) se conservan y se van al final,
 *   ordenadas alfabéticamente, para no perder información.
 * - No muta el array original.
 */
export function sortSizes(sizes: readonly string[]): string[] {
  return [...sizes].sort((a, b) => {
    const ra = SIZE_RANK.get(sizeKey(a)) ?? UNKNOWN_RANK;
    const rb = SIZE_RANK.get(sizeKey(b)) ?? UNKNOWN_RANK;
    if (ra !== rb) return ra - rb;
    if (ra === UNKNOWN_RANK) return sizeKey(a).localeCompare(sizeKey(b));
    return 0;
  });
}

/** ¿La talla pertenece al catálogo canónico? */
export function isKnownSize(size: string): boolean {
  return SIZE_RANK.has(sizeKey(size));
}

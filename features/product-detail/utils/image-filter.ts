import type { ProductDetailImage } from "../types";

/**
 * Normaliza un texto para comparar colores sin importar mayúsculas/minúsculas,
 * espacios sobrantes ni el espaciado alrededor del separador "/" de los colores
 * combinados. Ejemplo: "Rojo / Blanco", "rojo/blanco" y "  ROJO/  BLANCO "
 * producen la misma clave "rojo/blanco".
 */
export function normalizeColorKey(value?: string | null): string {
  return (value ?? "").toLowerCase().trim().replace(/\s+/g, "");
}

/** Nombre de color asociado a una imagen, tolera las variantes del DTO. */
function imageColorName(image: ProductDetailImage): string {
  return image.colorName || image.color?.name || "";
}

function imageColorHex(image: ProductDetailImage): string {
  return image.primaryHex || image.colorHex || image.color?.hex || "";
}

export interface SelectedColorFilter {
  colorName?: string | null;
  colorHex?: string | null;
  colorId?: string | null;
}

/**
 * Filtra las imágenes de la galería según el color seleccionado.
 *
 * La coincidencia exacta por nombre tiene prioridad absoluta: así un color
 * simple como "Rojo" no captura las fotos de un combinado "Rojo / Blanco".
 * Los pasos siguientes sólo se evalúan si no hay coincidencia exacta.
 *
 * Si ninguna imagen corresponde al color seleccionado se devuelve una única
 * imagen principal por defecto, de modo que el carrusel nunca queda en blanco
 * ni muestra fotos que pertenecen a otro color.
 */
export function filterImagesByColor(
  images: ProductDetailImage[],
  selected: SelectedColorFilter
): ProductDetailImage[] {
  const ordered = [...images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  if (ordered.length === 0) return [];

  const targetName = normalizeColorKey(selected.colorName);
  const targetHex = normalizeColorKey(selected.colorHex);
  const targetId = selected.colorId ? String(selected.colorId) : "";

  // Sin color seleccionado se muestran todas las imágenes ordenadas.
  if (!targetName && !targetHex && !targetId) return ordered;

  // 1. Coincidencia exacta por nombre (fuente de verdad).
  if (targetName) {
    const exact = ordered.filter(
      (image) => normalizeColorKey(imageColorName(image)) === targetName
    );
    if (exact.length > 0) return exact;
  }

  // 2. Coincidencia por identificador de color.
  if (targetId) {
    const byId = ordered.filter(
      (image) => image.colorId && String(image.colorId) === targetId
    );
    if (byId.length > 0) return byId;
  }

  // 3. Coincidencia por componentes: un combinado puede haberse guardado con
  //    uno de sus colores ("Rojo / Blanco" guardado como "Rojo").
  if (targetName) {
    const byComponent = ordered.filter((image) => {
      const key = normalizeColorKey(imageColorName(image));
      if (!key) return false;
      return key.includes(targetName) || targetName.includes(key);
    });
    if (byComponent.length > 0) return byComponent;
  }

  // 4. Fallback por hexadecimal, sólo para imágenes sin color asignado.
  if (targetHex) {
    const byHex = ordered.filter((image) => {
      if (normalizeColorKey(imageColorName(image))) return false;
      const hex = normalizeColorKey(imageColorHex(image));
      return !!hex && hex === targetHex;
    });
    if (byHex.length > 0) return byHex;
  }

  // 5. Ninguna imagen para este color: imagen principal por defecto.
  return [ordered[0]];
}
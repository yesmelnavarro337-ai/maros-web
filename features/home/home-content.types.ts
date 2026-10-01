/**
 * Contenido editable del Home. El endpoint público devuelve solo las secciones
 * con `enabled: true`; si una sección no aparece (se desactivó, la fila no
 * existe o el API no responde) el componente usa sus defaults hardcodeados.
 */

export type HomeSectionKey =
  | "personalize"
  | "featured-collection"
  | "brand-promise";

export interface HomeSectionImage {
  url: string;
  alt?: string | null;
}

export interface HomeSectionTag {
  /**
   * Opcional a propósito: el contenido viene de JSON persistido y puede tener
   * `label` en null aunque la API lo declare requerido. El consumidor debe
   * filtrar las entradas sin etiqueta antes de renderizarlas.
   */
  label?: string | null;
  icon?: string | null;
}

export interface HomeSectionContent {
  id: string;
  sectionKey: HomeSectionKey;
  enabled: boolean;
  sectionTitle?: string | null;
  sectionSubtitle?: string | null;
  eyebrow?: string | null;
  bodyText?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  mainImageUrl?: string | null;
  mainImageAlt?: string | null;
  secondaryImages: HomeSectionImage[];
  tags: HomeSectionTag[];
}

export type HomeSectionContentMap = Partial<
  Record<HomeSectionKey, HomeSectionContent>
>;

/**
 * Un valor vacío en el admin significa "usa el texto de la página", así que se
 * trata como ausente para no renderizar elementos vacíos.
 */
export function orFallback(
  value: string | null | undefined,
  fallback: string
): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export function firstNonEmpty(
  ...values: (string | null | undefined)[]
): string | undefined {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return undefined;
}
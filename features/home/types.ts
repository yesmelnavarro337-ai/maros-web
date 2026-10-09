export interface HeroSlide {
  id: string;
  badgeLabel?: string;
  badgeSeason?: string;
  title: string;
  subtitle: string;
  image?: string;
  /**
   * Tipo del recurso del slide. Cuando es "video", el hero renderiza un
   * elemento <video> en bucle en vez de una imagen estática.
   */
  mediaType?: "image" | "video";
  overlayNote?: string;
  /**
   * Cuando es false el slide se renderiza como imagen limpia a pantalla
   * completa, sin badge, título, subtítulo, nota manuscrita ni botones.
   * Por defecto es true (los slides de temporada y personalización llevan texto).
   */
  showOverlayText?: boolean;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export interface HeroContent {
  title: string;
  subtitle: string;
  image?: string;
  badgeLabel?: string;
  badgeSeason?: string;
  overlayNote?: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  slides?: HeroSlide[];
}

export interface CategoryQuickLink {
  id: string;
  label: string;
  image: string;
  href: string;
}

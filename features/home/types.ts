export interface HeroSlide {
  id: string;
  badgeLabel?: string;
  badgeSeason?: string;
  title: string;
  subtitle: string;
  image?: string;
  overlayNote?: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
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
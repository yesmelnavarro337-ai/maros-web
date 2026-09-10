export interface HeroContent {
  title: string;
  subtitle: string;
  image?: string;
  badgeLabel?: string;
  badgeSeason?: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

export interface CategoryQuickLink {
  id: string;
  label: string;
  image: string;
  href: string;
}
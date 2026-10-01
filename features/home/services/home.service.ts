import { serverApiFetch } from "@/lib/api/server-fetch";
import type { HeroContent, HeroSlide } from "../types";
import { ProductPreview } from "@/types/product";

interface SeasonColorsResponse {
  primary: string;
  accent: string;
  background: string;
}

interface SeasonPublicResponse {
  name: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl?: string | null;
  bannerImageUrl?: string | null;
  colors: SeasonColorsResponse;
  ctaText: string;
  ctaLink: string;
  featuredProducts: unknown[];
}

interface SiteSettingsPublicResponse {
  siteName: string;
  description: string;
}

const DEFAULT_HERO_SLIDE: HeroSlide = {
  id: "default-hero",
  badgeLabel: "COLECCIÓN ESPECIAL",
  title: "Pijamas que se sienten, se comparten y se recuerdan",
  subtitle: "Personalizadas a tu gusto, hechas a mano con amor y las mejores telas para cada momento en familia.",
  overlayNote: "Juntos en pijama ♡",
  primaryCta: { label: "Ver colección", href: "/colecciones" },
  secondaryCta: { label: "Personalizar pijama", href: "/personaliza" },
};

export async function getHeroContent(): Promise<HeroContent> {
  const [season, settings] = await Promise.all([
    serverApiFetch<SeasonPublicResponse | null>("season/active").catch(() => null),
    serverApiFetch<SiteSettingsPublicResponse>("settings").catch(() => null),
  ]);

  const slides: HeroSlide[] = [];

  if (season) {
    slides.push({
      id: "season-active",
      badgeLabel: "COLECCIÓN ESPECIAL",
      badgeSeason: season.name,
      title: season.heroTitle || season.name,
      subtitle: season.heroSubtitle || "Pijamas que se sienten, se comparten y se recuerdan.",
      image: season.heroImageUrl ?? undefined,
      overlayNote: "Juntos en pijama ♡",
      primaryCta: {
        label: season.ctaText || "Ver colección",
        href: season.ctaLink || "/colecciones",
      },
      secondaryCta: {
        label: "Personalizar pijama",
        href: "/personaliza",
      },
    });
  } else {
    slides.push({
      ...DEFAULT_HERO_SLIDE,
      subtitle: settings?.description || DEFAULT_HERO_SLIDE.subtitle,
    });
  }

  // Slide adicional de personalización para enriquecer la experiencia editorial
  slides.push({
    id: "personaliza-slide",
    badgeLabel: "PERSONALIZACIÓN TOTAL",
    badgeSeason: "Diseño a tu medida",
    title: "Crea tu pijama desde cero",
    subtitle: "Elige corte, tela, estampado y detalles únicos. Nosotros confeccionamos tu idea con amor en Colombia.",
    overlayNote: "Tu idea, nuestra experiencia ♡",
    primaryCta: {
      label: "Diseñar pijama",
      href: "/personaliza",
    },
    secondaryCta: {
      label: "Ver catálogo",
      href: "/catalogo",
    },
  });

  const main = slides[0];

  return {
    title: main.title,
    subtitle: main.subtitle,
    image: main.image,
    badgeLabel: main.badgeLabel,
    badgeSeason: main.badgeSeason,
    overlayNote: main.overlayNote,
    primaryCta: main.primaryCta,
    secondaryCta: main.secondaryCta,
    slides,
  };
}

interface ApiProductSummary {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  thumbnailUrl?: string | null;
  images?: string[] | null;
}

interface HomePageResponse {
  featuredProducts: ApiProductSummary[];
}

export async function getFeaturedProducts(): Promise<ProductPreview[]> {
  const home = await serverApiFetch<HomePageResponse>("home");
  return home.featuredProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.basePrice,
    image: p.thumbnailUrl ?? "",
    images: p.images ?? [],
  }));
}
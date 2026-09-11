import { serverApiFetch } from "@/lib/api/server-fetch";
import type { HeroContent } from "../types";
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

const DEFAULT_HERO: HeroContent = {
  title: "Diseña la pijama que siempre imaginaste",
  subtitle: "Personalizadas a tu gusto, hechas con amor y los mejores materiales para cada momento.",
  primaryCta: { label: "Ver colección", href: "/colecciones" },
  secondaryCta: { label: "Ver catálogo", href: "/catalogo" },
};

export async function getHeroContent(): Promise<HeroContent> {
  const [season, settings] = await Promise.all([
    serverApiFetch<SeasonPublicResponse | null>("season/active").catch(() => null),
    serverApiFetch<SiteSettingsPublicResponse>("settings").catch(() => null),
  ]);

  if (season) {
    return {
      title: season.heroTitle,
      subtitle: season.heroSubtitle,
      image: season.heroImageUrl ?? undefined,
      badgeLabel: "Colección",
      badgeSeason: season.name,
      primaryCta: { label: season.ctaText || "Ver colección", href: season.ctaLink || "/colecciones" },
      secondaryCta: { label: "Ver catálogo", href: "/catalogo" },
    };
  }

  // Sin temporada activa: usamos el hero por defecto, opcionalmente con
  // la descripción real del sitio si logramos obtenerla.
  return {
    ...DEFAULT_HERO,
    subtitle: settings?.description || DEFAULT_HERO.subtitle,
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
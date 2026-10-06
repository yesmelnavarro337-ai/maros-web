import { serverApiFetch } from "@/lib/api/server-fetch";
import type { HeroContent, HeroSlide } from "../types";
import { ProductPreview } from "@/types/product";

interface SeasonColorsResponse {
  primary: string;
  accent: string;
  background: string;
}

interface SeasonImageResponse {
  id?: string | null;
  imageUrl?: string | null;
  order?: number | null;
  isPrimary?: boolean | null;
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
  images?: SeasonImageResponse[] | null;
}

interface HomeSectionResponse {
  sectionKey: string;
  enabled?: boolean;
  sectionTitle?: string | null;
  sectionSubtitle?: string | null;
  eyebrow?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  mainImageUrl?: string | null;
  /** Alias del slot genérico `mainImageUrl` para la sección `personalize`. */
  heroImageUrl?: string | null;
  /** Foto de la tarjeta de 4 pasos; independiente del banner del hero. */
  cardImageUrl?: string | null;
}

interface SiteSettingsPublicResponse {
  siteName: string;
  description: string;
}

const DEFAULT_HERO_SLIDE: HeroSlide & Required<Pick<HeroSlide, "primaryCta" | "secondaryCta">> = {
  id: "default-hero",
  badgeLabel: "COLECCIÓN ESPECIAL",
  title: "Pijamas que se sienten, se comparten y se recuerdan",
  subtitle: "Personalizadas a tu gusto, hechas a mano con amor y las mejores telas para cada momento en familia.",
  overlayNote: "Juntos en pijama ♡",
  primaryCta: { label: "Ver colección", href: "/colecciones" },
  secondaryCta: { label: "Personalizar pijama", href: "/personaliza" },
};

const PERSONALIZE_SECTION_KEY = "personalize";

const DEFAULT_PERSONALIZE_SLIDE: Omit<HeroSlide, "id" | "image"> = {
  badgeLabel: "PERSONALIZACIÓN TOTAL",
  badgeSeason: "Diseño a tu medida",
  title: "Crea tu pijama desde cero",
  subtitle: "Elige corte, tela, estampado y detalles únicos. Nosotros confeccionamos tu idea con amor en Colombia.",
  overlayNote: "Tu idea, nuestra experiencia ♡",
  primaryCta: { label: "Diseñar pijama", href: "/personaliza" },
  secondaryCta: { label: "Ver catálogo", href: "/catalogo" },
};

export async function getHeroContent(): Promise<HeroContent> {
  const [season, settings, homeSections] = await Promise.all([
    serverApiFetch<SeasonPublicResponse | null>("season/active").catch(() => null),
    serverApiFetch<SiteSettingsPublicResponse>("settings").catch(() => null),
    serverApiFetch<HomeSectionResponse[]>("home-content").catch(() => null),
  ]);

  const slides: HeroSlide[] = [];

  const seasonImages = (season?.images ?? [])
    .filter((image): image is SeasonImageResponse & { imageUrl: string } => Boolean(image?.imageUrl))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const primaryImage = seasonImages.find((image) => image.isPrimary) ?? seasonImages[0];
  const extraImages = seasonImages.filter((image) => image !== primaryImage);

  const seasonCta = {
    label: season?.ctaText || "Ver colección",
    href: season?.ctaLink || "/colecciones",
  };

  // 1) Portada de la temporada activa, con su overlay de texto completo.
  if (season) {
    slides.push({
      id: "season-primary",
      showOverlayText: true,
      badgeLabel: "COLECCIÓN ESPECIAL",
      badgeSeason: season.name,
      title: season.heroTitle || season.name,
      subtitle: season.heroSubtitle || "Pijamas que se sienten, se comparten y se recuerdan.",
      image: primaryImage?.imageUrl ?? season.bannerImageUrl ?? season.heroImageUrl ?? undefined,
      overlayNote: "Juntos en pijama ♡",
      primaryCta: seasonCta,
      secondaryCta: { label: "Personalizar pijama", href: "/personaliza" },
    });
  } else {
    slides.push({
      ...DEFAULT_HERO_SLIDE,
      showOverlayText: true,
      subtitle: settings?.description || DEFAULT_HERO_SLIDE.subtitle,
    });
  }

  // 2) Banner del customizer, editable desde el admin de contenido de home.
  const personalize = homeSections?.find(
    (section) => section?.sectionKey?.toLowerCase() === PERSONALIZE_SECTION_KEY && section.enabled !== false
  );

  slides.push({
    ...DEFAULT_PERSONALIZE_SLIDE,
    id: "personaliza-slide",
    showOverlayText: true,
    badgeLabel: personalize?.eyebrow || DEFAULT_PERSONALIZE_SLIDE.badgeLabel,
    title: personalize?.sectionTitle || DEFAULT_PERSONALIZE_SLIDE.title,
    subtitle: personalize?.sectionSubtitle || DEFAULT_PERSONALIZE_SLIDE.subtitle,
    image: personalize?.heroImageUrl || personalize?.mainImageUrl || undefined,
    primaryCta: {
      label: personalize?.ctaText || DEFAULT_PERSONALIZE_SLIDE.primaryCta?.label || "Diseñar pijama",
      href: "/personaliza",
    },
  });

  // 3) Imágenes adicionales de la temporada, en el orden definido en el admin.
  //    Estas se muestran como imagen limpia a pantalla completa, sin el texto
  //    por defecto de la temporada ni ningún otro overlay.
  extraImages.forEach((image, index) => {
    slides.push({
      id: `season-image-${image.id ?? index}`,
      showOverlayText: false,
      // El título no se renderiza; se conserva como alt accesible de la imagen.
      title: season?.name || "Nueva colección",
      subtitle: "",
      image: image.imageUrl,
    });
  });

  const main = slides[0];

  return {
    title: main.title,
    subtitle: main.subtitle,
    image: main.image,
    badgeLabel: main.badgeLabel,
    badgeSeason: main.badgeSeason,
    overlayNote: main.overlayNote,
    // El primer slide siempre es la portada (temporada o default) y lleva CTAs.
    primaryCta: main.primaryCta ?? DEFAULT_HERO_SLIDE.primaryCta,
    secondaryCta: main.secondaryCta ?? DEFAULT_HERO_SLIDE.secondaryCta,
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
  categoryName?: string | null;
  styleName?: string | null;
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
    categoryName: p.categoryName ?? undefined,
    styleName: p.styleName ?? undefined,
  }));
}
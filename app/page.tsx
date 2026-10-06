import { Star, Heart, PhoneCall, Truck } from "lucide-react";
import { BenefitsStrip } from "@/features/home/components/benefits-strip";
import { CategoryQuickLinks } from "@/features/home/components/category-quick-links";
import { PersonalizeSteps } from "@/features/home/components/personalize-steps";
import { FeaturedCollections } from "@/features/home/components/featured-collections";
import { FeaturedProducts } from "@/features/home/components/featured-products";
import { BrandValuesSection } from "@/features/home/components/brand-values-section";
import { TestimonialsSection } from "@/features/home/components/testimonials-section";
import { CtaBanner } from "@/features/home/components/cta-banner";
import { GalleryPreviewSection } from "@/features/gallery/components/gallery-preview-section";
import { HeroSection } from "@/features/home/components/hero-section";

import { getCategories } from "@/features/catalog/services/catalog.service";
import { getHeroContent, getFeaturedProducts } from "@/features/home/services/home.service";
import { getCollections } from "@/features/collections/services/collections.service";
import { getHomeSectionContent } from "@/features/home/services/home-content.service";
import { JsonLd, itemListJsonLd } from "@/lib/seo/json-ld";
import { PromoBannerStrip } from "@/features/banners/components/promo-banner-strip";
import type { CategoryQuickLink } from "@/features/home/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const primaryBenefits = [
  { icon: Star, title: "+6 Años", subtitle: "de experiencia" },
  { icon: Heart, title: "Hecho en", subtitle: "Colombia" },
  { icon: PhoneCall, title: "Atención", subtitle: "100% personalizada" },
  { icon: Truck, title: "Envíos", subtitle: "a todo el país" },
];

// Categorías que no deben aparecer en el Home. "Batas" se reemplaza por "Parejas".
const EXCLUDED_CATEGORY_SLUGS = new Set(["batas"]);

// Orden editorial preferido de las tarjetas del Home. Las categorías no listadas
// se conservan después en el orden recibido del backend.
const FEATURED_CATEGORY_ORDER = ["mujer", "hombre", "parejas", "familia", "ninos-y-bebes"];

async function getCategoryQuickLinks(): Promise<CategoryQuickLink[]> {
  const categories = await getCategories();

  const rank = (slug: string) => {
    const index = FEATURED_CATEGORY_ORDER.indexOf(slug.toLowerCase());
    return index === -1 ? FEATURED_CATEGORY_ORDER.length : index;
  };

  return categories
    .filter((c) => !EXCLUDED_CATEGORY_SLUGS.has(c.slug.toLowerCase()))
    .sort((a, b) => rank(a.slug) - rank(b.slug))
    .map((c) => ({
      id: c.id,
      label: c.name,
      image: c.imageUrl || "",
      href: `/catalogo?categoria=${c.slug}`,
    }));
}

export default async function HomePage() {
  const [hero, collections, featuredProducts, categoryLinks, homeContent] = await Promise.all([
    getHeroContent(),
    getCollections(),
    getFeaturedProducts(),
    getCategoryQuickLinks(),
    getHomeSectionContent(),
  ]);


  return (
    <div className="flex flex-col">
      <HeroSection hero={hero} />

      {/* Fase 3: Benefits Strip (4 Pilares de Confianza) */}
      <section className="w-full bg-[#FAF8F4] border-b border-brand-border/40 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <BenefitsStrip items={primaryBenefits} />
        </div>
      </section>

      {/* Fase 4: Categorías Visuales */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <CategoryQuickLinks categories={categoryLinks} />
      </div>

      {/* Fase 5: Personaliza tu Pijama */}
      <PersonalizeSteps content={homeContent.personalize} />

      {/* Fase 6: Colección Destacada */}
      <FeaturedCollections
        collections={collections.slice(0, 5)}
        content={homeContent["featured-collection"]}
      />

      <PromoBannerStrip />

      {/* Fase 7: Productos Destacados */}
      <FeaturedProducts products={featuredProducts} />

      {/* Fase 8: Valores de Marca ("Hecho con intención") */}
      <BrandValuesSection content={homeContent["brand-promise"]} />

      <GalleryPreviewSection />
      <TestimonialsSection />
      <CtaBanner />
    </div>
  );
}
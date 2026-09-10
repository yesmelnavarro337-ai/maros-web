import { Award, Home as HomeIcon, Heart, Truck, Tag, Scissors, Gem, ShieldCheck, PackageCheck } from "lucide-react";
import { BenefitsStrip } from "@/features/home/components/benefits-strip";
import { CategoryQuickLinks } from "@/features/home/components/category-quick-links";
import { PersonalizeSteps } from "@/features/home/components/personalize-steps";
import { FeaturedCollections } from "@/features/home/components/featured-collections";
import { FeaturedProducts } from "@/features/home/components/featured-products";
import { TestimonialsSection } from "@/features/home/components/testimonials-section";
import { CtaBanner } from "@/features/home/components/cta-banner";
import { PromoBannerStrip } from "@/features/banners/components/promo-banner-strip";
import { GalleryPreviewSection } from "@/features/gallery/components/gallery-preview-section";
import { HeroSection } from "@/features/home/components/hero-section";
import { getCategories } from "@/features/catalog/services/catalog.service";
import { getHeroContent, getFeaturedProducts } from "@/features/home/services/home.service";
import { getCollections } from "@/features/collections/services/collections.service";
import type { CategoryQuickLink } from "@/features/home/types";

const primaryBenefits = [
  { icon: Award, title: "+4 Años", subtitle: "de experiencia" },
  { icon: HomeIcon, title: "Hecho en Colombia", subtitle: "con amor" },
  { icon: Heart, title: "Atención 100%", subtitle: "personalizada" },
  { icon: Truck, title: "Envíos a todo", subtitle: "el país" },
];

const secondaryBenefits = [
  { icon: Tag, title: "Telas premium" },
  { icon: Scissors, title: "Hechas a mano" },
  { icon: Gem, title: "Diseños únicos" },
  { icon: ShieldCheck, title: "Calidad garantizada" },
  { icon: PackageCheck, title: "Pago al recibir" },
];

async function getCategoryQuickLinks(): Promise<CategoryQuickLink[]> {
  const categories = await getCategories();
  return categories.map((c) => ({
    id: c.id,
    label: c.name,
    image: "",
    href: `/catalogo?categoria=${c.slug}`,
  }));
}

export default async function HomePage() {
const [hero, collections, featuredProducts, categoryLinks] = await Promise.all([
  getHeroContent(),
  getCollections(),
  getFeaturedProducts(),
  getCategoryQuickLinks(),
  ]);

  return (
    <div className="flex flex-col">
      <HeroSection hero={hero} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <BenefitsStrip items={primaryBenefits} />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <CategoryQuickLinks categories={categoryLinks} />
      </div>

      <PersonalizeSteps />
      <FeaturedCollections collections={collections.slice(0, 5)} />
      <PromoBannerStrip />
      <FeaturedProducts products={featuredProducts} />

      <div className="max-w-7xl mx-auto px-4 py-6 border-y border-border">
        <BenefitsStrip items={secondaryBenefits} compact />
      </div>

      <GalleryPreviewSection />
      <TestimonialsSection />
      <CtaBanner />
    </div>
  );
}
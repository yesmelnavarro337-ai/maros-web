import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPageHeader } from "@/features/page-headers/services/page-headers.service";
import { HeaderSliderBackground } from "@/components/shared/header-slider-background";
import { Reveal } from "@/components/shared/reveal";

const DEFAULT_TITLE_LINES = { before: "Más de 6 años creando pijamas ", highlight: "únicas" };
const DEFAULT_SUBTITLE =
  "Maro's Pijamas nació con un sueño simple: crear prendas únicas, cómodas y hechas con amor para los momentos más especiales de tu vida.";

export async function AboutHero() {
  const header = await getPageHeader("about").catch(() => undefined);

  const title = header?.title?.trim() || null;
  const subtitle = header?.subtitle?.trim() || DEFAULT_SUBTITLE;
  const primaryCta =
    header?.primaryButtonText?.trim() && header?.primaryButtonLink?.trim()
      ? { label: header.primaryButtonText.trim(), href: header.primaryButtonLink.trim() }
      : { label: "Ver catálogo", href: "/catalogo" };
  const secondaryCta =
    header?.secondaryButtonText?.trim() && header?.secondaryButtonLink?.trim()
      ? { label: header.secondaryButtonText.trim(), href: header.secondaryButtonLink.trim() }
      : { label: "Contáctanos", href: "/contacto" };

  const aboutImages = [
    ...(header?.backgroundImage?.trim() ? [header.backgroundImage.trim()] : []),
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
  ].slice(0, 3);

  const overlayOpacity = Math.min(Math.max(header?.overlayOpacity ?? 45, 20), 85);

  return (
    <section className="relative w-full overflow-hidden bg-brand-dark-olive">
      <HeaderSliderBackground
        images={aboutImages}
        overlayOpacity={overlayOpacity}
        className="min-h-[340px] sm:min-h-[400px] md:min-h-[460px] flex items-center"
      >
        <div
          className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20 md:py-24 text-white w-full"
          style={header?.textColor ? { color: header.textColor } : undefined}
        >
          <Reveal amount={0.1} className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-4 text-[#EFE8D8]/90">
              Nuestra historia
            </p>

          {title ? (
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              {title}
            </h1>
          ) : (
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight">
              {DEFAULT_TITLE_LINES.before}
              <span className="inline-flex items-center gap-1">
                {DEFAULT_TITLE_LINES.highlight}
                <Heart className="h-7 w-7 sm:h-9 sm:w-9 text-[#B6AE3A] fill-[#B6AE3A]/30" />
              </span>
            </h1>
          )}

          <p className="mt-5 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto text-white/90">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
            <Button size="lg" className="rounded-full px-7" asChild>
              <Link href={primaryCta.href}>
                {primaryCta.label}
                <ArrowRight className="ml-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-7 bg-white/10 hover:bg-white/20 border-white/60 text-white transition-all duration-300 backdrop-blur-sm"
              asChild
            >
              <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </HeaderSliderBackground>
  </section>
);
}

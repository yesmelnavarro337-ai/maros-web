import Link from "next/link";
import { HeaderSliderBackground } from "./header-slider-background";
import { Reveal } from "./reveal";
import type { PageHeader } from "@/features/page-headers/types";

interface PageHeroSectionProps {
  header?: PageHeader;
  fallback: { title: string; subtitle: string };
  additionalImages?: string[];
}

export function PageHeroSection({ header, fallback, additionalImages = [] }: PageHeroSectionProps) {
  const title = header?.title || fallback.title;
  const subtitle = header?.subtitle || fallback.subtitle;
  const textColor = header?.textColor || "#F9F6F0";
  const overlayOpacity = Math.min(Math.max(header?.overlayOpacity ?? 40, 0), 90);
  const backgroundImage = header?.backgroundImage;

  // Colección de imágenes para el slider Ken Burns (5s)
  const defaultPageImages: Record<string, string[]> = {
    collections: [
      "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
    ],
    blog: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=1200&auto=format&fit=crop",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=1200&auto=format&fit=crop",
    ],
  };

  const key = header?.pageKey || "";
  const fallbackList = defaultPageImages[key] || [
    "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=1200&auto=format&fit=crop",
  ];

  const sliderImages = backgroundImage
    ? [backgroundImage, ...additionalImages, ...fallbackList.filter((img) => img !== backgroundImage)].slice(0, 3)
    : [...additionalImages, ...fallbackList].slice(0, 3);

  const hasButtons = Boolean(header?.primaryButtonText || header?.secondaryButtonText);

  return (
    <section className="relative w-full overflow-hidden bg-brand-dark-olive">
      <HeaderSliderBackground
        images={sliderImages}
        overlayOpacity={overlayOpacity}
        className="min-h-[280px] sm:min-h-[340px] md:min-h-[400px] lg:min-h-[440px] flex items-center"
      >
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-18 md:py-22">
          <Reveal amount={0.1}>
            <h1
              className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight"
              style={{ color: textColor }}
            >
              {title}
            </h1>

            {subtitle && (
              <p className="font-sans mt-3 sm:mt-4 max-w-2xl text-base sm:text-lg md:text-xl text-white/90" style={{ color: textColor }}>
                {subtitle}
              </p>
            )}

            {hasButtons && (
              <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-4">
                {header?.primaryButtonText && (
                  <Link
                    href={header.primaryButtonLink ?? "/contacto"}
                    className="rounded-full bg-[#A38A3E] px-7 py-3 text-sm font-semibold text-[#F9F6F0] transition-colors hover:bg-[#A38A3E]/90 shadow-md"
                  >
                    {header.primaryButtonText}
                  </Link>
                )}
                {header?.secondaryButtonText && (
                  <Link
                    href={header.secondaryButtonLink ?? "/contacto"}
                    className="rounded-full border border-[#F9F6F0]/60 px-7 py-3 text-sm font-semibold text-[#F9F6F0] transition-colors hover:bg-[#F9F6F0]/10 backdrop-blur-xs"
                  >
                    {header.secondaryButtonText}
                  </Link>
                )}
              </div>
            )}
          </Reveal>
        </div>
      </HeaderSliderBackground>
    </section>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CollectionSummary } from "@/types/collection";
import { cloudinaryUrl } from "@/lib/images/cloudinary";
import {
  orFallback,
  type HomeSectionContent,
  type HomeSectionImage,
} from "../home-content.types";

const FALLBACK_COLLECTION_IMAGES = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=900&auto=format&fit=crop",
];

const DEFAULT_EYEBROW = "CAMPAÑA DESTACADA";
const DEFAULT_SUBTITLE = "Diseños que inspiran momentos especiales.";
const DEFAULT_CTA = "Ver colección";
const DEFAULT_DESCRIPTION =
  "Colores, estampados y detalles que hacen de cada pijama un regalo inolvidable.";

interface FeaturedCollectionsProps {
  collections: CollectionSummary[];
  content?: HomeSectionContent;
}

/** Las imágenes configuradas por el admin son URLs ya absolutas (Cloudinary). */
function resolveImage(
  image: HomeSectionImage | null | undefined,
  fallback: string
): string {
  return image?.url?.trim() ? cloudinaryUrl(image.url) : fallback;
}

import { Reveal } from "@/components/shared/reveal";

export function FeaturedCollections({
  collections,
  content,
}: FeaturedCollectionsProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!collections || collections.length === 0) return null;

  const current = collections[activeIdx] || collections[0];

  // Overrides globales de la sección; cada campo cae al default si el admin lo dejó vacío.
  const eyebrow = orFallback(content?.eyebrow, DEFAULT_EYEBROW);
  const subtitle = orFallback(content?.sectionSubtitle, DEFAULT_SUBTITLE);
  const ctaText = orFallback(content?.ctaText, DEFAULT_CTA);
  const sectionTitle = content?.sectionTitle?.trim();
  const ctaLink = orFallback(content?.ctaLink, `/colecciones/${current.id}`);

  const primaryImage = resolveImage(
    content?.mainImageUrl ? { url: content.mainImageUrl, alt: content.mainImageAlt } : null,
    current.image ? cloudinaryUrl(current.image) : FALLBACK_COLLECTION_IMAGES[0]
  );
  const secondaryImages = content?.secondaryImages ?? [];
  const secondaryImage1 = resolveImage(secondaryImages[0], FALLBACK_COLLECTION_IMAGES[1]);
  const secondaryImage2 = resolveImage(secondaryImages[1], FALLBACK_COLLECTION_IMAGES[2]);

  const description = current.description || DEFAULT_DESCRIPTION;

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? collections.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev === collections.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      <Reveal>
        {/* Encabezado Editorial */}
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-[#34351F] font-medium tracking-tight">
              {sectionTitle ?? (
                <>
                  Colección <span className="italic font-normal">destacada</span>
                </>
              )}
            </h2>
            <p className="font-sans text-xs sm:text-sm text-stone-500 mt-1 sm:mt-1.5">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/colecciones"
              className="group hidden sm:inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[#6B6832] hover:text-[#34351F] transition-colors mr-2 active:scale-95"
            >
              <span>Ver todas</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>

            {collections.length > 1 && (
              <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
                <span className="font-semibold text-[#34351F] tracking-widest hidden sm:inline">
                  {String(activeIdx + 1).padStart(2, "0")} / {String(collections.length).padStart(2, "0")}
                </span>
                <button
                  onClick={handlePrev}
                  aria-label="Colección anterior"
                  className="h-8 w-8 rounded-full border border-stone-300 bg-white/90 flex items-center justify-center hover:bg-[#F6F2E9] hover:border-[#6B6832] text-[#34351F] transition-all hover:scale-105 active:scale-90 shadow-2xs"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Siguiente colección"
                  className="h-8 w-8 rounded-full border border-stone-300 bg-white/90 flex items-center justify-center hover:bg-[#F6F2E9] hover:border-[#6B6832] text-[#34351F] transition-all hover:scale-105 active:scale-90 shadow-2xs"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* BANNER EDITORIAL ASIMÉTRICO (Desktop >= 1024px) */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Imagen Principal de Campaña (Izquierda - 5 cols) */}
          <div className="lg:col-span-5 relative aspect-[4/5] rounded-3xl overflow-hidden bg-stone-100 shadow-xs border border-brand-border/40 group">
            <Image
              src={primaryImage}
              alt={current.name}
              fill
              sizes="40vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 group-active:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />
          </div>

          {/* Tarjeta Central de la Colección (Centro - 4 cols) */}
          <div className="lg:col-span-4 bg-[#F7F3EB] rounded-3xl p-8 xl:p-10 flex flex-col justify-center items-center text-center border border-[#E6DFC9]/70 relative shadow-2xs transform-gpu transition-all duration-300 hover:shadow-xl hover:-translate-y-1 select-none">
            <span className="text-[11px] font-semibold tracking-[0.25em] text-[#A38A3E] uppercase mb-3">
              {eyebrow}
            </span>

            <h3 className="font-heading text-2xl xl:text-3xl text-[#34351F] font-normal leading-tight mb-4 tracking-tight">
              {current.name}
            </h3>

            <p className="font-sans text-xs xl:text-sm text-stone-600 leading-relaxed mb-8 max-w-xs">
              {description}
            </p>

            <Button
              asChild
              size="lg"
              className="rounded-full px-8 py-3.5 bg-[#6B6832] hover:bg-[#34351F] text-white font-medium text-xs sm:text-sm transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 group"
            >
              <Link href={ctaLink}>
                <span>{ctaText}</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1.5" />
              </Link>
            </Button>
          </div>

          {/* Galería de Detalles / Swatches (Derecha - 3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            <div className="relative flex-1 min-h-[160px] rounded-2xl overflow-hidden bg-stone-100 shadow-xs border border-brand-border/40 group">
              <Image
                src={secondaryImage1}
                alt={secondaryImages[0]?.alt || "Detalle de pijama de colección"}
                fill
                sizes="25vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
              />
            </div>
            <div className="relative flex-1 min-h-[160px] rounded-2xl overflow-hidden bg-stone-100 shadow-xs border border-brand-border/40 group">
              <Image
                src={secondaryImage2}
                alt={secondaryImages[1]?.alt || "Detalle de telas de colección"}
                fill
                sizes="25vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
              />
            </div>
          </div>

        </div>

      {/* COMPOSICIÓN ESPECÍFICA EN MÓVIL (< 1024px) */}
      <div className="lg:hidden flex flex-col rounded-3xl overflow-hidden bg-[#F7F3EB] border border-[#E6DFC9]/70 shadow-sm group/mobile transform-gpu transition-all duration-300 hover:shadow-lg active:scale-[0.99]">
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-stone-100">
          <Image
            src={primaryImage}
            alt={current.name}
            fill
            sizes="100vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover/mobile:scale-108 group-active/mobile:scale-105"
          />
        </div>

        <div className="p-6 sm:p-8 flex flex-col items-center text-center">
          <span className="text-[11px] font-semibold tracking-[0.2em] text-[#A38A3E] uppercase mb-2">
            {eyebrow}
          </span>

          <h3 className="font-heading text-2xl text-[#34351F] font-normal leading-tight mb-2">
            {current.name}
          </h3>

          <p className="font-sans text-xs sm:text-sm text-stone-600 leading-relaxed mb-6 max-w-sm">
            {description}
          </p>

          <Button
            asChild
            size="lg"
            className="w-full sm:w-fit rounded-full px-8 py-3.5 bg-[#6B6832] hover:bg-[#34351F] text-white font-medium text-xs sm:text-sm transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 justify-center"
          >
            <Link href={ctaLink}>
              <span>{ctaText}</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/mobile:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
      </Reveal>
    </section>
  );
}
import Image from "next/image";
import Link from "next/link";
import { cloudinaryUrl } from "@/lib/images/cloudinary";
import type { PageHeader } from "@/features/page-headers/types";

interface PageHeroSectionProps {
  header?: PageHeader;
  fallback: { title: string; subtitle: string };
}

export function PageHeroSection({ header, fallback }: PageHeroSectionProps) {
  const title = header?.title || fallback.title;
  const subtitle = header?.subtitle || fallback.subtitle;
  const textColor = header?.textColor || "#F9F6F0";
  const overlayOpacity = Math.min(Math.max(header?.overlayOpacity ?? 40, 0), 90) / 100;
  const backgroundImage = header?.backgroundImage;

  const hasButtons = Boolean(header?.primaryButtonText || header?.secondaryButtonText);

  return (
    <section className="relative min-h-[420px] w-full overflow-hidden bg-brand-dark-olive flex items-center">
      {backgroundImage ? (
        <Image
          src={cloudinaryUrl(backgroundImage)}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark-olive via-brand-olive to-brand-olive-gold" />
      )}

      <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 md:py-28">
        <h1
          className="font-heading text-4xl md:text-6xl tracking-tight leading-tight"
          style={{ color: textColor }}
        >
          {title}
        </h1>

        {subtitle && (
          <p className="font-sans mt-4 max-w-2xl text-lg md:text-xl" style={{ color: textColor }}>
            {subtitle}
          </p>
        )}

        {hasButtons && (
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {header?.primaryButtonText && (
              <Link
                href={header.primaryButtonLink ?? "/contacto"}
                className="rounded-full bg-[#A38A3E] px-8 py-3 text-sm font-semibold text-[#F9F6F0] transition-colors hover:bg-[#A38A3E]/90"
              >
                {header.primaryButtonText}
              </Link>
            )}
            {header?.secondaryButtonText && (
              <Link
                href={header.secondaryButtonLink ?? "/contacto"}
                className="rounded-full border border-[#F9F6F0]/60 px-8 py-3 text-sm font-semibold text-[#F9F6F0] transition-colors hover:bg-[#F9F6F0]/10"
              >
                {header.secondaryButtonText}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HeroContent } from "../types";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

export interface HeroBenefit {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

export function HeroSection({ hero, benefits }: { hero: HeroContent; benefits: HeroBenefit[] }) {
  return (
    <section>
      {/* Banner de fotografía con overlay de legibilidad, sin la barra de pilares */}
      <div className="relative overflow-hidden">
        {hero.image ? (
          <Image
            src={cloudinaryUrl(hero.image)}
            alt={hero.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-right"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-brand-ivory via-brand-ivory to-brand-warm-beige" />
        )}

        <div className="pointer-events-none absolute inset-y-0 left-0 w-full md:w-[55%] lg:w-[52%] bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/80 via-70% to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 min-h-[600px] md:min-h-[680px] flex items-center pt-20 pb-16">
          <div className="max-w-xl">
            <h1 className="font-heading text-4xl md:text-6xl text-foreground leading-[1.05] tracking-tight">
              {hero.title}
            </h1>
            <p className="text-foreground/80 mt-5 text-base md:text-lg leading-relaxed">
              {hero.subtitle}
            </p>
            <div className="flex items-center gap-4 mt-8">
              <Button
                size="lg"
                className="rounded-full px-7 bg-brand-dark-olive text-brand-ivory hover:bg-brand-olive"
                asChild
              >
                <Link href="/colecciones">
                  Ver colección
                  <ArrowRight className="ml-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-7 bg-brand-ivory/60 hover:bg-brand-ivory hover:border-brand-olive/40"
                asChild
              >
                <Link href="/personaliza">Personalizar pijama</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Pilares de confianza: barra de cierre inferior completa, fuera de la fotografía */}
      <div className="w-full bg-[#FAF8F5] border-t border-[#3B4228]/10 py-5 px-8 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5 lg:gap-x-12">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="flex items-center gap-3">
                <Icon className="h-[34px] w-[34px] text-brand-olive-gold shrink-0" strokeWidth={1.5} />
                <div className="leading-tight">
                  <p className="font-semibold text-sm text-brand-dark-olive">{b.title}</p>
                  <p className="text-xs font-medium text-muted-foreground">{b.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
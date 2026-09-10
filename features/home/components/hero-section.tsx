import Link from "next/link";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HeroContent } from "../types";

export function HeroSection({ hero }: { hero: HeroContent }) {
  return (
    <section className="max-w-7xl mx-auto px-4 pt-10 pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl text-foreground leading-tight">
            {hero.title} 🤍
          </h1>
          <p className="text-muted-foreground mt-4 max-w-md">{hero.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button size="lg" asChild>
              <Link href={hero.primaryCta.href}>{hero.primaryCta.label}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] rounded-2xl bg-secondary flex items-center justify-center overflow-hidden">
            {hero.image ? (
              <Image src={hero.image} alt={hero.title} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            ) : (
              <ImageOff className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          {hero.badgeLabel && hero.badgeSeason && (
            <div className="absolute -bottom-6 -left-6 sm:-left-10 h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-card border border-border shadow-md flex flex-col items-center justify-center text-center p-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{hero.badgeLabel}</p>
              <p className="font-heading text-sm text-foreground leading-tight mt-0.5">{hero.badgeSeason}</p>
              <Link href="/colecciones" className="text-[10px] text-primary underline underline-offset-2 mt-1">
                Ver colección
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

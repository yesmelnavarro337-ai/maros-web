import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { CategoryQuickLink } from "../types";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

const FALLBACK_CATEGORY_IMAGES: Record<string, string> = {
  mujer: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
  hombre: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
  familia: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop",
  pareja: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop",
  parejas: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop",
  niñ: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=800&auto=format&fit=crop",
  niños: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=800&auto=format&fit=crop",
  bata: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=800&auto=format&fit=crop",
  batas: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=800&auto=format&fit=crop",
};

function resolveCategoryImage(label: string, customImage?: string): string {
  if (customImage && customImage.trim().length > 0) {
    return cloudinaryUrl(customImage);
  }
  const normalized = label.toLowerCase();
  for (const [key, fallbackUrl] of Object.entries(FALLBACK_CATEGORY_IMAGES)) {
    if (normalized.includes(key)) {
      return fallbackUrl;
    }
  }
  return "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop";
}

export function CategoryQuickLinks({ categories }: { categories: CategoryQuickLink[] }) {
  if (!categories || categories.length === 0) return null;

  // En móvil/tablet mostramos 6 categorías; en escritorio solo 5 para que nunca
  // quede una tarjeta huérfana en una segunda fila (ver grid más abajo).
  const visibleCategories = categories.slice(0, 6);
  const DESKTOP_VISIBLE_COUNT = 5;

  return (
    <section className="w-full py-6 sm:py-10">
      {/* Encabezado Editorial de Categorías */}
      <div className="flex items-end justify-between mb-6 sm:mb-8">
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-[#34351F] font-medium tracking-tight">
            Descubre nuestras <span className="italic font-normal">categorías</span>
          </h2>
          <p className="font-sans text-xs sm:text-sm text-stone-500 mt-1 sm:mt-1.5">
            Encuentra el estilo perfecto para cada momento.
          </p>
        </div>

        <Link
          href="/catalogo"
          className="group inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[#6B6832] hover:text-[#34351F] transition-colors"
        >
          <span>Ver todas</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Grid de Tarjetas Visuales Fotográficas.
          Móvil: 2 columnas · Tablet: 3 columnas · Escritorio: 5 columnas.
          La 6.ª tarjeta se oculta en escritorio (lg) para que la fila quede completa. */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5 lg:gap-6">
        {visibleCategories.map((c, index) => {
          const imageUrl = resolveCategoryImage(c.label, c.image);
          const mobileOnly = index >= DESKTOP_VISIBLE_COUNT;

          return (
            <Link
              key={c.id}
              href={c.href}
              className={`group relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-100 shadow-xs border border-brand-border/40 transition-all duration-500 hover:shadow-md hover:border-[#6B6832]/50 block${mobileOnly ? " lg:hidden" : ""}`}
            >
              {/* Imagen Fotográfica con zoom suave al interactuar */}
              <Image
                src={imageUrl}
                alt={`Pijamas categoría ${c.label}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Sutil sombreado inferior para contraste */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

              {/* Botón / Píldora de Categoría en la parte inferior */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl py-2 px-3 sm:px-3.5 flex items-center justify-between shadow-sm transition-all duration-300 group-hover:bg-[#34351F] group-hover:text-white">
                <span className="font-medium text-xs sm:text-sm text-[#34351F] group-hover:text-white transition-colors truncate">
                  {c.label}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-[#A38A3E] group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
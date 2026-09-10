import Link from "next/link";
import { cn } from "@/lib/utils";
import { GalleryGrid } from "@/features/gallery/components/gallery-grid";
import { getGalleryImages } from "@/features/gallery/services/gallery.service";
import { GALLERY_CATEGORIES } from "@/features/gallery/types";
import type { GalleryCategory } from "@/features/gallery/types";

export const metadata = {
  title: "Galería",
  description: "Momentos especiales con Maro's Pijamas.",
};

interface GaleriaPageProps {
  searchParams: Promise<{ categoria?: string }>;
}

export default async function GaleriaPage({ searchParams }: GaleriaPageProps) {
  const { categoria } = await searchParams;
  const activeCategory = GALLERY_CATEGORIES.includes(categoria as GalleryCategory)
    ? (categoria as GalleryCategory)
    : undefined;

  const images = await getGalleryImages(activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-xs text-muted-foreground mb-3">
        Inicio / <span className="text-foreground">Galería</span>
      </nav>
      <h1 className="font-heading text-3xl text-foreground">Galería</h1>
      <p className="text-muted-foreground mt-1 mb-6">Momentos especiales con Maro&apos;s Pijamas.</p>

      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/galeria"
          className={cn(
            "rounded-full px-3.5 py-1.5 text-sm transition-colors",
            !activeCategory
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
          )}
        >
          Todas
        </Link>
        {GALLERY_CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/galeria?categoria=${encodeURIComponent(cat)}`}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm transition-colors",
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
            )}
          >
            {cat}
          </Link>
        ))}
      </div>

      {images.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-16">
          Sin imágenes en esta categoría todavía.
        </p>
      ) : (
        <GalleryGrid images={images} />
      )}
    </div>
  );
}
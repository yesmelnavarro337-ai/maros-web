import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GalleryGrid } from "./gallery-grid";
import { getGalleryImages } from "../services/gallery.service";

export async function GalleryPreviewSection() {
  const allImages = (await getGalleryImages()) || [];
  const images = allImages.slice(0, 8);

  if (images.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      <div className="flex items-end justify-between mb-6 sm:mb-8">
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-[#34351F] font-medium tracking-tight">
            Momentos especiales con <span className="italic font-normal">Maro&apos;s</span>
          </h2>
          <p className="font-sans text-xs sm:text-sm text-stone-500 mt-1 sm:mt-1.5">
            Historias y recuerdos compartidos por nuestras clientas.
          </p>
        </div>
      </div>
      <GalleryGrid images={images} />
      <div className="flex justify-center mt-8">
        <Button
          asChild
          variant="outline"
          className="rounded-full px-8 py-3 border-[#34351F]/25 hover:border-[#6B6832] bg-white text-[#34351F] hover:bg-[#FAF8F4] text-xs sm:text-sm font-medium transition-all"
        >
          <Link href="/galeria">Ver más fotos</Link>
        </Button>
      </div>
    </section>
  );
}
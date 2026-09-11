import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GalleryGrid } from "./gallery-grid";
import { getGalleryImages } from "../services/gallery.service";

export async function GalleryPreviewSection() {
  const allImages = (await getGalleryImages()) || [];
  const images = allImages.slice(0, 8);

  if (images.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-5">
        Momentos especiales con <span className="text-primary">Maro&apos;s</span>
      </h2>
      <GalleryGrid images={images} />
      <div className="flex justify-center mt-6">
        <Button asChild variant="outline">
          <Link href="/galeria">Ver más fotos</Link>
        </Button>
      </div>
    </section>
  );
}
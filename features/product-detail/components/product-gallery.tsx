"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { cloudinaryUrl } from "@/lib/images/cloudinary";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export function ProductGallery({ images, productName }: { images: string[]; productName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const activeImage = images[activeIndex];
  const lightboxImage = lightboxIndex !== null ? images[lightboxIndex] : undefined;

  function stepLightbox(dir: 1 | -1) {
    if (lightboxIndex === null || images.length < 2) return;
    setLightboxIndex((lightboxIndex + dir + images.length) % images.length);
  }

  return (
    <div className="flex gap-3">
      <div className="hidden sm:flex flex-col gap-2 shrink-0">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "relative h-16 w-16 rounded-lg bg-secondary flex items-center justify-center overflow-hidden border-2 transition-colors",
              i === activeIndex ? "border-primary" : "border-transparent"
            )}
          >
            {img ? (
              <Image src={cloudinaryUrl(img)} alt={`${productName} ${i + 1}`} fill sizes="64px" className="object-cover" />
            ) : (
              <ImageOff className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        ))}
      </div>

      <div className="relative flex-1 aspect-[4/5] rounded-2xl bg-secondary overflow-hidden">
        {activeImage ? (
          <Image
            src={cloudinaryUrl(activeImage)}
            alt={productName}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
        <button
          className="absolute bottom-4 right-4 rounded-full bg-card/90 p-2 transition-colors hover:bg-card"
          aria-label="Ampliar imagen"
          onClick={() => setLightboxIndex(activeIndex)}
        >
          <ZoomIn className="h-4 w-4 text-foreground" />
        </button>
      </div>

      <Dialog open={lightboxIndex !== null} onOpenChange={(open) => { if (!open) setLightboxIndex(null); }}>
        <DialogContent
          showCloseButton={false}
          className="fixed inset-0 z-50 max-w-none translate-x-0 translate-y-0 rounded-none border-0 bg-black/95 p-0 text-white"
        >
          <DialogTitle className="sr-only">{productName}</DialogTitle>
          <DialogDescription className="sr-only">
            Vista ampliada de {productName}
          </DialogDescription>

          {lightboxImage ? (
            <Image
              src={cloudinaryUrl(lightboxImage)}
              alt={`${productName} ampliada`}
              fill
              sizes="100vw"
              className="object-contain p-6"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="h-12 w-12 text-white/60" />
            </div>
          )}

          <button
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Cerrar imagen ampliada"
            onClick={() => setLightboxIndex(null)}
          >
            <X className="h-5 w-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                className="absolute left-1/4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                aria-label="Imagen anterior"
                onClick={() => stepLightbox(-1)}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                className="absolute right-1/4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                aria-label="Imagen siguiente"
                onClick={() => stepLightbox(1)}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/80">
                {(lightboxIndex ?? 0) + 1} / {images.length}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
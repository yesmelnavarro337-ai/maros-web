"use client";

import { useEffect, useMemo, useState } from "react";
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
import type { ProductDetailImage } from "../types";

export type GalleryImageInput = string | ProductDetailImage;

export interface ProductGalleryProps {
  images: GalleryImageInput[];
  productName: string;
  selectedColorName?: string;
  selectedColorHex?: string;
  onImageColorSelect?: (colorName: string) => void;
}

export function ProductGallery({
  images,
  productName,
  selectedColorName,
  selectedColorHex,
  onImageColorSelect,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const normalizedImages = useMemo<ProductDetailImage[]>(() => {
    return images.map((img, idx) => {
      if (typeof img === "string") {
        return { url: img, order: idx };
      }
      return img;
    });
  }, [images]);

  // Reset active image index to 0 whenever filtered images or selected color changes
  useEffect(() => {
    setActiveIndex(0);
  }, [images, selectedColorName, selectedColorHex]);

  const safeActiveIndex = activeIndex < normalizedImages.length ? activeIndex : 0;
  const activeImage = normalizedImages[safeActiveIndex];
  const lightboxImage = lightboxIndex !== null ? normalizedImages[lightboxIndex] : undefined;

  function stepLightbox(dir: 1 | -1) {
    if (lightboxIndex === null || normalizedImages.length < 2) return;
    setLightboxIndex((lightboxIndex + dir + normalizedImages.length) % normalizedImages.length);
  }

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
    const clickedItem = normalizedImages[index];
    if (clickedItem?.colorName && onImageColorSelect) {
      onImageColorSelect(clickedItem.colorName);
    }
  };

  return (
    <div className="flex gap-3">
      {/* Tira vertical de miniaturas */}
      <div className="hidden sm:flex flex-col gap-2 shrink-0">
        {normalizedImages.map((img, i) => (
          <button
            key={`${img.url}-${i}`}
            onClick={() => handleThumbnailClick(i)}
            className={cn(
              "relative h-16 w-16 rounded-lg bg-secondary flex items-center justify-center overflow-hidden border-2 transition-colors",
              i === safeActiveIndex ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-muted-foreground/30"
            )}
            title={img.colorName ? `Color: ${img.colorName}` : `${productName} ${i + 1}`}
          >
            {img.url ? (
              <Image
                src={cloudinaryUrl(img.url)}
                alt={`${productName} ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <ImageOff className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        ))}
      </div>

      {/* Imagen Principal */}
      <div className="relative flex-1 aspect-[4/5] rounded-2xl bg-secondary overflow-hidden">
        {activeImage?.url ? (
          <Image
            src={cloudinaryUrl(activeImage.url)}
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
          className="absolute bottom-4 right-4 rounded-full bg-card/90 p-2 transition-colors hover:bg-card shadow-xs"
          aria-label="Ampliar imagen"
          onClick={() => setLightboxIndex(safeActiveIndex)}
        >
          <ZoomIn className="h-4 w-4 text-foreground" />
        </button>
      </div>

      {/* Modal Lightbox */}
      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(open) => {
          if (!open) setLightboxIndex(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="fixed inset-0 z-50 max-w-none translate-x-0 translate-y-0 rounded-none border-0 bg-black/95 p-0 text-white"
        >
          <DialogTitle className="sr-only">{productName}</DialogTitle>
          <DialogDescription className="sr-only">
            Vista ampliada de {productName}
          </DialogDescription>

          {lightboxImage?.url ? (
            <Image
              src={cloudinaryUrl(lightboxImage.url)}
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

          {normalizedImages.length > 1 && (
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
                {(lightboxIndex ?? 0) + 1} / {normalizedImages.length}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
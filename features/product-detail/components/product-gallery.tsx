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
  selectedColorId?: string;
  selectedColor?: { id?: string; name?: string; hex?: string; primaryHex?: string } | null;
  onImageColorSelect?: (colorName: string) => void;
}

export function ProductGallery({
  images,
  productName,
  selectedColorName,
  selectedColorHex,
  selectedColorId,
  selectedColor,
  onImageColorSelect,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const rawImages = useMemo<ProductDetailImage[]>(() => {
    return images.map((img, idx) => {
      if (typeof img === "string") {
        return { url: img, order: idx };
      }
      return img;
    });
  }, [images]);

  // Tolerant filtering logic for displayImages
  const displayImages = useMemo<ProductDetailImage[]>(() => {
    const activeColorName = (selectedColorName || selectedColor?.name || "").trim().toLowerCase();
    const activeColorId = selectedColorId || selectedColor?.id;
    const activeColorHex = (selectedColorHex || selectedColor?.hex || selectedColor?.primaryHex || "").trim().toLowerCase();

    if (!activeColorName && !activeColorId && !activeColorHex) {
      return rawImages;
    }

    const filtered = rawImages.filter((img) => {
      // 1. Coincidencia por ID (si existe)
      const imgColorId = (img as any).colorId || (img as any).color_id || (img as any).color?.id;
      if (imgColorId && activeColorId && String(imgColorId) === String(activeColorId)) {
        return true;
      }

      // 2. Coincidencia por Nombre de color o variante
      const imgColorName = (img.colorName || (img as any).color?.name || (img as any).color_name || "").trim().toLowerCase();
      if (imgColorName && activeColorName) {
        if (imgColorName === activeColorName || activeColorName.includes(imgColorName) || imgColorName.includes(activeColorName)) {
          return true;
        }
      }

      // 3. Fallback por Hexadecimal (si la imagen no tiene nombre definido)
      const imgHex = (img.primaryHex || img.colorHex || (img as any).color?.hex || "").trim().toLowerCase();
      if (!imgColorName && imgHex && activeColorHex) {
        if (imgHex === activeColorHex) return true;
      }

      return false;
    });

    // Si se encontraron imágenes específicas para ese color, retornarlas; de lo contrario retorno fallback
    return filtered.length > 0 ? filtered : rawImages;
  }, [rawImages, selectedColorName, selectedColorId, selectedColorHex, selectedColor]);

  // Reset active image index to 0 whenever filtered images or selected color changes
  useEffect(() => {
    setActiveIndex(0);
  }, [displayImages.length, selectedColorName, selectedColorHex, selectedColorId]);

  const safeActiveIndex = activeIndex < displayImages.length ? activeIndex : 0;
  const activeImage = displayImages[safeActiveIndex];
  const lightboxImage = lightboxIndex !== null ? displayImages[lightboxIndex] : undefined;

  function stepLightbox(dir: 1 | -1) {
    if (lightboxIndex === null || displayImages.length < 2) return;
    setLightboxIndex((lightboxIndex + dir + displayImages.length) % displayImages.length);
  }

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
    const clickedItem = displayImages[index];
    const colorName = clickedItem?.colorName || (clickedItem as any)?.color?.name || (clickedItem as any)?.color_name;
    if (colorName && onImageColorSelect) {
      onImageColorSelect(colorName);
    }
  };

  return (
    <div className="flex gap-3">
      {/* Tira vertical de miniaturas */}
      <div className="hidden sm:flex flex-col gap-2 shrink-0">
        {displayImages.map((img, i) => (
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

          {displayImages.length > 1 && (
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
                {(lightboxIndex ?? 0) + 1} / {displayImages.length}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
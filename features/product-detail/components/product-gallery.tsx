"use client";

import { useEffect, useMemo, useState, useRef } from "react";
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
import { filterImagesByColor } from "../utils/image-filter";

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

  // Referencias para gestos touch optimizados por GPU sin lag en móviles
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const rawImages = useMemo<ProductDetailImage[]>(() => {
    return images.map((img, idx) => {
      if (typeof img === "string") {
        return { url: img, order: idx };
      }
      return img;
    });
  }, [images]);

  // Filtrado normalizado por color (compartido con el QuickView)
  const displayImages = useMemo<ProductDetailImage[]>(() => {
    return filterImagesByColor(rawImages, {
      colorName: selectedColorName || selectedColor?.name,
      colorHex: selectedColorHex || selectedColor?.hex || selectedColor?.primaryHex,
      colorId: selectedColorId || selectedColor?.id,
    });
  }, [rawImages, selectedColorName, selectedColorId, selectedColorHex, selectedColor]);

  // Al cambiar de color se vuelve a la primera imagen del set filtrado
  useEffect(() => {
    setActiveIndex(0);
    setLightboxIndex(null);
  }, [displayImages, selectedColorName]);

  const safeActiveIndex = activeIndex < displayImages.length ? activeIndex : 0;
  const activeImage = displayImages[safeActiveIndex];
  const lightboxImage = lightboxIndex !== null ? displayImages[lightboxIndex] : undefined;

  const stepMain = (dir: 1 | -1) => {
    if (displayImages.length < 2) return;
    setActiveIndex((prev) => (prev + dir + displayImages.length) % displayImages.length);
  };

  const stepLightbox = (dir: 1 | -1) => {
    if (lightboxIndex === null || displayImages.length < 2) return;
    setLightboxIndex((lightboxIndex + dir + displayImages.length) % displayImages.length);
  };

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
    const clickedItem = displayImages[index];
    const colorName = clickedItem?.colorName || (clickedItem as any)?.color?.name || (clickedItem as any)?.color_name;
    if (colorName && onImageColorSelect) {
      onImageColorSelect(colorName);
    }
  };

  // Manejo de gestos táctiles directos para evitar lag en dispositivos móviles
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    // Umbral de swipe
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        stepMain(1); // Deslizar izquierda -> siguiente
      } else {
        stepMain(-1); // Deslizar derecha -> anterior
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="flex gap-3 self-start w-full">
      {/* Tira vertical de miniaturas en desktop. */}
      {displayImages.length > 1 && (
        <div className="hidden sm:flex flex-col gap-2 shrink-0 max-h-[min(650px,calc(100vh-9rem))] overflow-y-auto scrollbar-thin pr-0.5">
          {displayImages.map((img, i) => (
            <button
              key={`${img.url}-${i}`}
              type="button"
              onClick={() => handleThumbnailClick(i)}
              className={cn(
                "relative h-16 w-16 rounded-lg bg-secondary flex items-center justify-center overflow-hidden border-2 transition-all shrink-0",
                i === safeActiveIndex
                  ? "border-primary ring-2 ring-primary/20 scale-[1.02]"
                  : "border-transparent hover:border-muted-foreground/30"
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
      )}

      {/* Imagen Principal: alto acotado, optimización GPU y touch-action para móviles */}
      <div
        className="relative flex-1 w-full min-w-0 aspect-[3/4] max-h-[420px] sm:max-h-[500px] lg:max-h-[min(650px,calc(100vh-9rem))] rounded-2xl bg-secondary overflow-hidden select-none group/gallery"
        style={{ touchAction: "pan-y" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {activeImage?.url ? (
          <Image
            src={cloudinaryUrl(activeImage.url)}
            alt={productName}
            fill
            // Carga prioritaria en las primeras 2 imágenes para optimizar rendimiento móvil
            priority={safeActiveIndex < 2}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transform-gpu will-change-transform transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="h-10 w-10 text-muted-foreground" />
          </div>
        )}

        {/* Flechas de navegación unificadas estilo modal QuickView */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={(e) => {
                e.stopPropagation();
                stepMain(-1);
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <button
              type="button"
              aria-label="Foto siguiente"
              onClick={(e) => {
                e.stopPropagation();
                stepMain(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {/* Contador de posición / indicador */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 bg-black/55 backdrop-blur-sm rounded-full px-3 py-0.5 text-[11px] font-medium text-white/95">
              {safeActiveIndex + 1} / {displayImages.length}
            </div>
          </>
        )}

        {/* Botón Zoom / Lightbox */}
        <button
          type="button"
          className="absolute bottom-3 right-3 z-20 rounded-full bg-card/90 p-2.5 transition-colors hover:bg-card shadow-xs"
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
              className="object-contain p-6 transform-gpu"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="h-12 w-12 text-white/60" />
            </div>
          )}

          <button
            type="button"
            className="absolute top-4 right-4 z-30 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
            aria-label="Cerrar imagen ampliada"
            onClick={() => setLightboxIndex(null)}
          >
            <X className="h-5 w-5" />
          </button>

          {displayImages.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 h-11 w-11 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md backdrop-blur-sm flex items-center justify-center transition-all duration-300"
                aria-label="Imagen anterior"
                onClick={() => stepLightbox(-1)}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 h-11 w-11 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md backdrop-blur-sm flex items-center justify-center transition-all duration-300"
                aria-label="Imagen siguiente"
                onClick={() => stepLightbox(1)}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 text-xs font-medium text-white/90 bg-black/50 px-3 py-1 rounded-full">
                {(lightboxIndex ?? 0) + 1} / {displayImages.length}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
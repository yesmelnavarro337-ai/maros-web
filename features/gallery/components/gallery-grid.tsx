"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GalleryImageItem } from "../types";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

const ASPECTS = ["aspect-[3/4]", "aspect-square", "aspect-[4/3]", "aspect-[3/5]", "aspect-[5/4]"] as const;

export function GalleryGrid({ images }: { images: GalleryImageItem[] }) {
  const [selected, setSelected] = useState<number | null>(null);

  const close = useCallback(() => setSelected(null), []);
  const prev = useCallback(() => setSelected((s) => (s === null ? s : (s + images.length - 1) % images.length)), [images.length]);
  const next = useCallback(() => setSelected((s) => (s === null ? s : (s + 1) % images.length)), [images.length]);

  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, close, prev, next]);

  useEffect(() => {
    if (selected === null) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  const current = selected !== null ? images[selected] : undefined;

  return (
    <>
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setSelected(i)}
            aria-label={`Ampliar foto: ${img.caption}`}
            className={cn(
              "relative w-full break-inside-avoid mb-3 rounded-xl bg-secondary overflow-hidden block group cursor-zoom-in",
              ASPECTS[i % ASPECTS.length]
            )}
          >
            {img.url ? (
              <Image
                src={cloudinaryUrl(img.url)}
                alt={img.caption}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <ImageOff className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        ))}
      </div>

      {current && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Anterior"
            className="absolute left-2 sm:left-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Siguiente"
            className="absolute right-2 sm:right-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <figure className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-black/40">
              <Image src={cloudinaryUrl(current.url)} alt={current.caption} fill sizes="(max-width: 768px) 100vw, 896px" className="object-contain" />
            </div>
            {current.caption && (
              <figcaption className="mt-3 text-center text-sm text-white/90">{current.caption}</figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  );
}
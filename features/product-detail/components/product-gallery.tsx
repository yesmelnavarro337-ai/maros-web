"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, productName }: { images: string[]; productName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

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
              <Image src={img} alt={`${productName} ${i + 1}`} fill sizes="64px" className="object-cover" />
            ) : (
              <ImageOff className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        ))}
      </div>

      <div className="relative flex-1 aspect-[4/5] rounded-2xl bg-secondary overflow-hidden">
        {activeImage ? (
          <Image
            src={activeImage}
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
        <button className="absolute bottom-4 right-4 rounded-full bg-card/90 p-2" aria-label="Ampliar imagen">
          <ZoomIn className="h-4 w-4 text-foreground" />
        </button>
      </div>
    </div>
  );
}
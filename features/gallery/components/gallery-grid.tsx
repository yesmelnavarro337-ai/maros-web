import Image from "next/image";
import { ImageOff } from "lucide-react";
import type { GalleryImageItem } from "../types";

export function GalleryGrid({ images }: { images: GalleryImageItem[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {images.map((img) => (
        <div key={img.id} className="relative aspect-square rounded-lg bg-secondary overflow-hidden flex items-center justify-center">
          {img.url ? (
            <Image src={img.url} alt={img.caption} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />
          ) : (
            <ImageOff className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      ))}
    </div>
  );
}
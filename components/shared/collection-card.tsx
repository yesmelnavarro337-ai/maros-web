import Link from "next/link";
import Image from "next/image";
import { ImageOff, Heart } from "lucide-react";
import type { CollectionSummary } from "@/types/collection";

export function CollectionCard({ collection }: { collection: CollectionSummary }) {
  return (
    <Link
      href={`/colecciones/${collection.id}`}
      className="relative aspect-[4/3] rounded-xl overflow-hidden group block"
      style={{ backgroundColor: `${collection.accentHex}1A` }}
    >
      {collection.image ? (
        <Image
          src={collection.image}
          alt={collection.name}
          fill
          sizes="(max-width: 640px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <ImageOff className="h-6 w-6" style={{ color: collection.accentHex }} />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <button className="absolute top-3 right-3 rounded-full bg-card/90 p-1.5" aria-label="Agregar a favoritos">
        <Heart className="h-3.5 w-3.5 text-foreground" />
      </button>
      <div className="absolute bottom-3 left-3 text-white">
        <p className="font-heading text-lg">{collection.name}</p>
        <p className="text-xs opacity-90">{collection.productCount} productos</p>
      </div>
    </Link>
  );
}
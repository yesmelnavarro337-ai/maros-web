import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ImageOff } from "lucide-react";
import { WishlistButton } from "./wishlist-button";
import type { CollectionSummary } from "@/types/collection";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

export function CollectionCard({ collection }: { collection: CollectionSummary }) {
  return (
    <Link
      href={`/colecciones/${collection.id}`}
      className="relative aspect-[3/4] rounded-2xl overflow-hidden group block transform-gpu transition-all duration-300 hover:-translate-y-2 hover:shadow-xl active:scale-[0.98] active:shadow-md select-none"
      style={{ backgroundColor: `${collection.accentHex}1A` }}
    >
      {collection.image ? (
        <Image
          src={cloudinaryUrl(collection.image)}
          alt={collection.name}
          fill
          sizes="(max-width: 640px) 50vw, 33vw"
          className="object-cover group-hover:scale-108 group-active:scale-105 transition-transform duration-700 ease-out"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <ImageOff className="h-6 w-6" style={{ color: collection.accentHex }} />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/85" />
      <WishlistButton
        className="absolute top-3 right-3 transition-transform duration-200 active:scale-125"
        item={{
          id: collection.id,
          type: "collection",
          name: collection.name,
          image: collection.image ?? "",
          slug: `/colecciones/${collection.id}`,
          accentHex: collection.accentHex,
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <p className="font-heading text-lg leading-tight drop-shadow-xs">{collection.name}</p>
        <p className="mt-1 text-[#A38A3E] text-sm font-semibold inline-flex items-center gap-1.5 transition-colors duration-200 group-hover:text-white">
          Ver colección
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5 group-active:translate-x-1.5" />
        </p>
      </div>
    </Link>
  );
}
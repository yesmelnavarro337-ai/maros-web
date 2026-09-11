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
      className="relative aspect-[3/4] rounded-2xl overflow-hidden group block"
      style={{ backgroundColor: `${collection.accentHex}1A` }}
    >
      {collection.image ? (
        <Image
          src={cloudinaryUrl(collection.image)}
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
      <WishlistButton
        className="absolute top-3 right-3"
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
        <p className="font-heading text-lg leading-tight">{collection.name}</p>
        <p className="mt-1 text-[#A38A3E] text-sm font-semibold inline-flex items-center gap-1.5">
          Ver colección
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </p>
      </div>
    </Link>
  );
}
import Link from "next/link";
import Image from "next/image";
import { ImageOff, Heart } from "lucide-react";
import { StarRatingDisplay } from "./star-rating-display";
import type { ProductPreview } from "@/types/product";

export function ProductCard({ product }: { product: ProductPreview }) {
  return (
    <Link href={`/productos/${product.slug}`} className="group">
      <div className="relative aspect-square rounded-xl bg-secondary overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        <button className="absolute top-2 right-2 rounded-full bg-card/90 p-1.5" aria-label="Agregar a favoritos">
          <Heart className="h-3.5 w-3.5 text-foreground" />
        </button>
      </div>
      <p className="text-sm text-foreground mt-2 truncate">{product.name}</p>
      <span className="font-heading text-base text-foreground">
        ${product.price.toLocaleString("es-CO")} COP
      </span>
      {!!product.reviewCount && product.reviewCount > 0 && (
        <div className="flex items-center gap-1 mt-1">
          <StarRatingDisplay rating={product.rating ?? 0} size="xs" />
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>
      )}
    </Link>
  );
}
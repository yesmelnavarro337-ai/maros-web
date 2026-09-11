import Link from "next/link";
import Image from "next/image";
import { ImageOff, Check } from "lucide-react";
import { StarRatingDisplay } from "./star-rating-display";
import { WishlistButton } from "./wishlist-button";
import type { ProductPreview } from "@/types/product";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

export function ProductCard({ product }: { product: ProductPreview }) {
  const soldOut = product.available === false;
  const productImages = product.images ?? [];
  const secondImage = productImages.length > 1 ? productImages[1] : undefined;

  return (
    <Link href={`/productos/${product.slug}`} className="group">
      <div className="relative aspect-square rounded-xl bg-secondary overflow-hidden">
        {product.image ? (
          <>
            <Image
              src={cloudinaryUrl(product.image)}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {secondImage && (
              <Image
                src={cloudinaryUrl(secondImage)}
                alt={`${product.name} vista alternativa`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="h-6 w-6 text-muted-foreground" />
          </div>
        )}

        {soldOut && (
          <span className="absolute top-2 left-2 rounded-full bg-foreground/90 text-background text-[10px] font-medium uppercase tracking-wide px-2.5 py-1">
            Agotado
          </span>
        )}

        <WishlistButton
          className="absolute top-2 right-2"
          item={{
            id: product.id,
            type: "product",
            name: product.name,
            image: product.image,
            slug: `/productos/${product.slug}`,
            price: product.price,
          }}
        />
      </div>

      <p className="font-heading text-base text-foreground mt-2.5 truncate">{product.name}</p>
      <span className="text-sm text-muted-foreground">
        ${product.price.toLocaleString("es-CO")} COP
      </span>

      {soldOut ? (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
          Sin disponible en tallas
        </span>
      ) : product.sizes && product.sizes.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
          {product.sizes.slice(0, 4).map((s) => (
            <span
              key={s}
              className="h-6 min-w-6 px-1.5 inline-flex items-center justify-center rounded-md border border-border text-[10px] font-medium text-foreground"
            >
              {s}
            </span>
          ))}
          {product.sizes.length > 4 && (
            <span className="text-[10px] text-muted-foreground">+{product.sizes.length - 4}</span>
          )}
          {product.sizes.length > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-primary">
              <Check className="h-3 w-3" />
              {product.sizes.length} tallas
            </span>
          )}
        </div>
      ) : null}

      {!!product.reviewCount && product.reviewCount > 0 && (
        <div className="flex items-center gap-1 mt-1.5">
          <StarRatingDisplay rating={product.rating ?? 0} size="xs" />
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>
      )}
    </Link>
  );
}
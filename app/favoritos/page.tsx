"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ImageOff, Trash2, Heart, Eye, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/features/wishlist/wishlist-context";
import { useMounted } from "@/lib/hooks/use-mounted";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

export default function FavoritosPage() {
  const mounted = useMounted();
  const { items, remove, clear } = useWishlist();
  const [confirmClear, setConfirmClear] = useState(false);

  if (!mounted) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-4">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-5 animate-pulse">
          <Heart className="h-7 w-7 text-primary" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-4">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-5">
          <Heart className="h-7 w-7 text-primary" />
        </div>
        <h1 className="font-heading text-2xl text-foreground">
          Tu lista de favoritos está vacía
        </h1>
        <p className="text-muted-foreground mt-2 mb-6">
          Toca el corazón en cualquier producto o colección para guardarlo aquí.
        </p>
        <Button asChild size="lg">
          <Link href="/catalogo">Explorar catálogo</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-xs text-muted-foreground mb-3">
        Inicio / <span className="text-foreground">Favoritos</span>
      </nav>

      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl text-foreground">Mis Favoritos</h1>
          <p className="text-muted-foreground mt-1">
            {items.length} {items.length === 1 ? "ítem guardado" : "ítems guardados"}
          </p>
        </div>

        {confirmClear ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">¿Vaciar todo?</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                clear();
                setConfirmClear(false);
              }}
            >
              Sí, vaciar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmClear(false)}
            >
              Cancelar
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="text-muted-foreground"
            onClick={() => setConfirmClear(true)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Vaciar favoritos
          </Button>
        )}
      </div>

      <ul className="divide-y divide-border">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 py-4 group">
            <Link
              href={item.slug}
              className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-xl overflow-hidden bg-secondary"
            >
              {item.image ? (
                <Image
                  src={cloudinaryUrl(item.image)}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageOff className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-medium uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {item.type === "product" ? "Producto" : "Colección"}
                </span>
              </div>
              <Link
                href={item.slug}
                className="text-sm sm:text-base font-medium text-foreground truncate block hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
              {item.price != null && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  ${item.price.toLocaleString("es-CO")} COP
                </p>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                <Link href={item.slug} aria-label={`Ver ${item.name}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-destructive"
                onClick={() => remove(item.id)}
                aria-label={`Eliminar ${item.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center gap-3">
        <Button variant="outline" asChild>
          <Link href="/catalogo">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Seguir explorando
          </Link>
        </Button>
      </div>
    </div>
  );
}

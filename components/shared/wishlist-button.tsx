"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/hooks/use-mounted";
import { useWishlist, type WishlistItem } from "@/features/wishlist/wishlist-context";

interface WishlistButtonProps {
  item: WishlistItem;
  className?: string;
  size?: "sm" | "md";
}

export function WishlistButton({ item, className, size = "sm" }: WishlistButtonProps) {
  const { has, toggle } = useWishlist();
  // Evita descalce de hidratación: hasta que el cliente se monta, el proveedor
  // no ha leído el localStorage, así que renderizamos el estado base (inactivo)
  // idéntico al del servidor.
  const mounted = useMounted();

  const active = mounted && has(item.id);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle(item);
    toast.success(active ? "Eliminado de favoritos" : "Agregado a favoritos", {
      description: item.name,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "rounded-full bg-card/90 p-1.5 opacity-90 hover:opacity-100 transition-all duration-200 hover:scale-110",
        active && "bg-primary/10",
        className,
      )}
      aria-label={active ? "Eliminar de favoritos" : "Agregar a favoritos"}
    >
      <Heart
        className={cn(
          "text-foreground transition-colors duration-200",
          size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5",
          active && "fill-primary text-primary",
        )}
      />
    </button>
  );
}

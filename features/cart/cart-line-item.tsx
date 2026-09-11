"use client";

import Image from "next/image";
import { Trash2, Shirt } from "lucide-react";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { useCart } from "./cart-context";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

export function CartLineItem({ cartKey }: { cartKey: string }) {
  const { items, updateQuantity, removeItem } = useCart();
  const item = items.find((i) => i.key === cartKey);

  if (!item) return null;

  const chips = [item.size && `Talla ${item.size}`, item.colorName, item.customizationLabel].filter(Boolean) as string[];

  return (
    <li className="flex gap-4 py-5 border-b border-border last:border-b-0">
      <div className="relative h-20 w-16 rounded-lg bg-secondary overflow-hidden shrink-0">
        {item.image ? (
          <Image src={cloudinaryUrl(item.image)} alt={item.name} fill sizes="64px" className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Shirt className="h-5 w-5 text-primary/40" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
        <div className="flex flex-wrap gap-1.5">
          {chips.map((chip, i) => (
            <span key={i} className="text-[10px] bg-secondary text-foreground rounded-full px-2 py-0.5">
              {chip}
            </span>
          ))}
          {item.embroideryText && (
            <span className="text-[10px] bg-primary/10 text-primary rounded-full px-2 py-0.5">
              Bordado: &quot;{item.embroideryText}&quot;
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          ${item.price.toLocaleString("es-CO")} c/u
        </p>

        <div className="flex items-center justify-between mt-1">
          <QuantityStepper value={item.quantity} onChange={(q) => updateQuantity(item.key, q)} />
          <div className="flex items-center gap-3">
            <span className="font-heading text-sm text-foreground">
              ${(item.price * item.quantity).toLocaleString("es-CO")}
            </span>
            <button
              onClick={() => removeItem(item.key)}
              className="text-muted-foreground hover:text-destructive transition-colors"
              aria-label={`Eliminar ${item.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
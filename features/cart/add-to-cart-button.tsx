"use client";

import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "./cart-context";

interface AddToCartButtonProps {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  colorName: string;
  colorHex: string;
  quantity: number;
  disabled?: boolean;
}

export function AddToCartButton({
  productId,
  slug,
  name,
  price,
  image,
  size,
  colorName,
  colorHex,
  quantity,
  disabled,
}: AddToCartButtonProps) {
  const { addItem } = useCart();

  return (
    <Button
      size="lg"
      className="w-full h-12"
      disabled={disabled || !size}
      onClick={() => {
        addItem({ productId, slug, name, price, image, size, colorName, colorHex, quantity });
        toast.success(`${name} (${size}) agregado al carrito`);
      }}
    >
      <ShoppingBag className="h-4 w-4 mr-2" />
      Agregar al carrito
    </Button>
  );
}
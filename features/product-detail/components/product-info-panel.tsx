"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRatingDisplay } from "@/components/shared/star-rating-display";
import { SizeSelector } from "@/components/shared/size-selector";
import { ColorSwatchSelector } from "@/components/shared/color-swatch-selector";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import type { ProductDetail } from "../types";

export function ProductInfoPanel({ product }: { product: ProductDetail }) {
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]?.hex ?? "");
  const [quantity, setQuantity] = useState(1);

  // Tallas que no tienen NINGUNA combinación con stock, sin importar el color.
  const disabledSizes = useMemo(
    () => product.sizes.filter((s) => !product.variants.some((v) => v.size === s && v.available)),
    [product.sizes, product.variants]
  );

  // Colores sin stock específicamente para la talla actualmente seleccionada.
  const disabledColorsForSize = useMemo(() => {
    return product.colors
      .filter((c) => {
        const variant = product.variants.find((v) => v.size === size && v.colorName === c.name);
        return variant ? !variant.available : false;
      })
      .map((c) => c.hex);
  }, [product.colors, product.variants, size]);

  const selectedCombinationAvailable = useMemo(() => {
    const variant = product.variants.find((v) => v.size === size && v.colorHex === color);
    return variant?.available ?? false;
  }, [product.variants, size, color]);

  const customizeHref = `/personaliza?producto=${product.slug}&talla=${size}&color=${encodeURIComponent(color)}&cantidad=${quantity}`;
  const quoteHref = `/cotizar?producto=${product.slug}&talla=${size}&color=${encodeURIComponent(color)}&cantidad=${quantity}`;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Badge variant="secondary" className="mb-2">{product.categoryName}</Badge>
        <h1 className="font-heading text-3xl text-foreground">{product.name}</h1>
        {!!product.reviewCount && product.reviewCount > 0 && (
          <div className="flex items-center gap-2 mt-1.5">
            <StarRatingDisplay rating={product.rating ?? 0} />
            <span className="text-sm text-muted-foreground">({product.reviewCount} opiniones)</span>
          </div>
        )}
      </div>

      <span className="font-heading text-2xl text-foreground">
        ${product.price.toLocaleString("es-CO")} COP
      </span>

      <p className="text-sm text-muted-foreground">{product.description}</p>

      <div>
        <p className="text-sm font-medium text-foreground mb-2">Talla</p>
        <SizeSelector sizes={product.sizes} selected={size} onChange={setSize} disabledSizes={disabledSizes} />
      </div>

      {product.colors.length > 0 && (
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Color</p>
          <ColorSwatchSelector
            colors={product.colors}
            selected={color}
            onChange={setColor}
            disabledHexes={disabledColorsForSize}
          />
        </div>
      )}

      <div>
        <p className="text-sm font-medium text-foreground mb-2">Cantidad</p>
        <QuantityStepper value={quantity} onChange={setQuantity} />
      </div>

      {!selectedCombinationAvailable && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
          Esta combinación de talla y color está agotada. Puedes solicitar cotización de todas formas — te contactaremos con alternativas disponibles.
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        {product.allowCustomization && (
          <Button size="lg" asChild className="flex-1">
            <Link href={customizeHref}>
              <Sparkles className="h-4 w-4 mr-2" />
              Personalizar
            </Link>
          </Button>
        )}
        <Button size="lg" variant="outline" asChild className="flex-1">
          <Link href={quoteHref}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Solicitar cotización
          </Link>
        </Button>
      </div>
    </div>
  );
}
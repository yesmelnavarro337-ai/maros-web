import Image from "next/image";
import { Shirt } from "lucide-react";
import type { CustomizationChoice } from "../types";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

interface SelectionSummaryPanelProps {
  productName: string;
  productImage: string;
  basePrice: number;
  size: string;
  quantity: number;
  fabric?: CustomizationChoice;
  color?: CustomizationChoice;
  print?: CustomizationChoice;
  embroidery?: CustomizationChoice;
  embroideryText?: string;
  total: number;
}

export function SelectionSummaryPanel({
  productName,
  productImage,
  basePrice,
  size,
  quantity,
  fabric,
  color,
  print,
  embroidery,
  embroideryText,
  total,
}: SelectionSummaryPanelProps) {
  const hasPrint = !!print && print.id !== "none";
  const hasEmbroidery = !!embroidery && embroidery.id !== "none";
  const selectedColor = color?.hex;

  const rows = [
    { label: productName, value: `$${basePrice.toLocaleString("es-CO")}` },
    fabric && { label: `Tela · ${fabric.name}`, value: fabric.priceModifier > 0 ? `+$${fabric.priceModifier.toLocaleString("es-CO")}` : "+$0" },
    color && { label: `Color · ${color.name}`, value: "+$0" },
    hasPrint && { label: `Estampado · ${print!.name}`, value: `+$${print!.priceModifier.toLocaleString("es-CO")}` },
    hasEmbroidery && { label: `Bordado · ${embroidery!.name}`, value: `+$${embroidery!.priceModifier.toLocaleString("es-CO")}` },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="rounded-xl border border-border bg-card p-5 w-full sm:w-80 shrink-0 h-fit sm:sticky sm:top-24 flex flex-col gap-4">
      <p className="text-sm font-medium text-foreground">Tu diseño</p>

      <div className="relative aspect-square rounded-xl bg-secondary overflow-hidden">
        {productImage ? (
          <Image
            src={cloudinaryUrl(productImage)}
            alt={productName}
            fill
            sizes="320px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Shirt className="h-10 w-10 text-primary/40" />
          </div>
        )}

        <div className="absolute top-2 left-2 flex flex-col items-start gap-1.5">
          {hasPrint && (
            <span className="rounded-full bg-black/60 text-white backdrop-blur-sm text-[10px] font-medium uppercase tracking-wide px-2.5 py-1">
              Estampado · {print!.name}
            </span>
          )}
          {hasEmbroidery && (
            <span className="rounded-full bg-black/60 text-white backdrop-blur-sm text-[10px] font-medium px-2.5 py-1">
              Bordado{embroideryText ? `: "${embroideryText}"` : ` · ${embroidery!.name}`}
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-2.5 flex items-center gap-1.5 bg-gradient-to-t from-black/45 to-transparent">
          {fabric && (
            <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium text-foreground">
              {fabric.image ? (
                <span className="relative h-3.5 w-3.5 rounded-full overflow-hidden">
                  <Image src={cloudinaryUrl(fabric.image)} alt={fabric.name} fill sizes="14px" className="object-cover" />
                </span>
              ) : (
                <span className="h-3.5 w-3.5 rounded-full border border-border" style={{ backgroundColor: color?.hex ?? "transparent" }} />
              )}
              {fabric.name}
            </span>
          )}
          {selectedColor && (
            <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium text-foreground">
              <span className="h-3.5 w-3.5 rounded-full border border-black/10" style={{ backgroundColor: selectedColor }} />
              {color!.name}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 text-xs">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground truncate">{row.label}</span>
            <span className="text-foreground shrink-0 ml-2">{row.value}</span>
          </div>
        ))}
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Talla / Cantidad</span>
          <span className="text-foreground">{size || "—"} · x{quantity}</span>
        </div>
        {embroideryText && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Texto del bordado</span>
            <span className="text-foreground truncate ml-2">&quot;{embroideryText}&quot;</span>
          </div>
        )}
      </div>

      <div className="border-t border-border pt-3 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Total parcial</span>
        <span className="font-heading text-lg text-foreground">${total.toLocaleString("es-CO")} COP</span>
      </div>
    </div>
  );
}
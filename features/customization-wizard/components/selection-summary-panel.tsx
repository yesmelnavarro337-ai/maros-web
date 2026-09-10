import { ImageOff } from "lucide-react";
import type { CustomizationChoice } from "../types";

interface SelectionSummaryPanelProps {
  productName: string;
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
  const rows = [
    { label: productName, value: `$${basePrice.toLocaleString("es-CO")}` },
    fabric && { label: fabric.name, value: fabric.priceModifier > 0 ? `+$${fabric.priceModifier.toLocaleString("es-CO")}` : "+$0" },
    color && { label: color.name, value: "+$0" },
    print && print.id !== "none" && { label: print.name, value: `+$${print.priceModifier.toLocaleString("es-CO")}` },
    embroidery && embroidery.id !== "none" && { label: embroidery.name, value: `+$${embroidery.priceModifier.toLocaleString("es-CO")}` },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="rounded-xl border border-border bg-card p-5 w-full sm:w-72 shrink-0 h-fit sm:sticky sm:top-24">
      <p className="text-sm font-medium text-foreground mb-1">Tu selección</p>
      <div className="aspect-square rounded-lg bg-secondary flex items-center justify-center mb-3">
        <ImageOff className="h-6 w-6 text-muted-foreground" />
      </div>

      <div className="flex flex-col gap-1.5 text-xs">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-muted-foreground truncate">{row.label}</span>
            <span className="text-foreground shrink-0 ml-2">{row.value}</span>
          </div>
        ))}
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Talla / Cantidad</span>
          <span className="text-foreground">{size} · x{quantity}</span>
        </div>
        {embroideryText && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Bordado</span>
            <span className="text-foreground">&quot;{embroideryText}&quot;</span>
          </div>
        )}
      </div>

      <div className="border-t border-border mt-3 pt-3 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Total parcial</span>
        <span className="font-heading text-lg text-foreground">${total.toLocaleString("es-CO")} COP</span>
      </div>
    </div>
  );
}
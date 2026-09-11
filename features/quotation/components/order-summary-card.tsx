import Image from "next/image";
import { ImageOff } from "lucide-react";
import type { QuotationItemDraft } from "../types";

export function OrderSummaryCard({ item }: { item: QuotationItemDraft }) {
  const chips = [
    `Talla ${item.size}`,
    item.baseColor,
    item.customizationLabels?.tela,
    item.customizationLabels?.color,
    item.customizationLabels?.estampado,
    item.customizationLabels?.bordado,
  ].filter(Boolean);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-sm font-medium text-foreground mb-3">Tu pedido</p>
      <div className="flex gap-3">
        <div className="h-16 w-16 rounded-lg bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.productName}
              width={64}
              height={64}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <ImageOff className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-foreground truncate">{item.productName}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {chips.map((chip, i) => (
              <span key={i} className="text-[10px] bg-secondary text-foreground rounded-full px-2 py-0.5">
                {chip}
              </span>
            ))}
          </div>
          {item.embroideryText && (
            <p className="text-xs text-muted-foreground mt-1">
              Bordado: &quot;{item.embroideryText}&quot;
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-border mt-4 pt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Cantidad: {item.quantity}</span>
        <span className="font-heading text-lg text-foreground">
          ${item.totalPrice.toLocaleString("es-CO")} COP
        </span>
      </div>
      <p className="text-[10px] text-muted-foreground mt-1">
        Te contactaremos para confirmar detalles y valor final.
      </p>
    </div>
  );
}
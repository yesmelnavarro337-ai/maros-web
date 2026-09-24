import { Info, Sparkles } from "lucide-react";
import type { ProductDetailCategory } from "../types";

interface PriceNoticeBannerProps {
  selectedSize: string;
  categories?: ProductDetailCategory[];
  categoryName?: string;
  surchargeReason?: string | null;
}

const LARGE_SIZES = new Set(["XL", "2XL", "XXL", "3XL", "XXXL", "4XL", "XXXXL", "5XL"]);

function isLargeSize(size: string): boolean {
  if (!size) return false;
  const s = size.trim().toUpperCase();
  return LARGE_SIZES.has(s) || (s.length >= 2 && s.includes("XL"));
}

export function PriceNoticeBanner({
  selectedSize,
  categories = [],
  categoryName,
  surchargeReason,
}: PriceNoticeBannerProps) {
  const isPlusSize = isLargeSize(selectedSize);

  // Categorías con razón de recargo explicada
  const categoriesWithSurcharge = categories.filter(
    (c) => c.surchargeReason && c.surchargeReason.trim().length > 0
  );

  // Si no hay recargo por talla ni por categoría, no mostramos nada
  if (!isPlusSize && categoriesWithSurcharge.length === 0 && !surchargeReason) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2.5 my-1">
      {/* Aviso de talla especial (> L) */}
      {isPlusSize && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/70 text-amber-950 text-xs sm:text-sm shadow-xs transition-all">
          <Sparkles className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-amber-900 block mb-0.5">
              Ajuste de precio por consumo adicional (Talla {selectedSize.toUpperCase()})
            </span>
            Las tallas superiores a L (como {selectedSize.toUpperCase()}) incluyen un ajuste proporcional por el mayor consumo de tela e insumos en la confección.
          </div>
        </div>
      )}

      {/* Avisos de recargo especial por categoría */}
      {categoriesWithSurcharge.map((c, i) => (
        <div
          key={i}
          className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50/80 border border-rose-200/80 text-rose-950 text-xs sm:text-sm shadow-xs transition-all"
        >
          <Info className="h-4 w-4 text-rose-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-rose-900 block mb-0.5">
              Nota sobre {c.name}
            </span>
            {c.surchargeReason}
          </div>
        </div>
      ))}

      {/* Fallback si surchargeReason viene directamente como prop */}
      {categoriesWithSurcharge.length === 0 && surchargeReason && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50/80 border border-rose-200/80 text-rose-950 text-xs sm:text-sm shadow-xs transition-all">
          <Info className="h-4 w-4 text-rose-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-rose-900 block mb-0.5">
              Nota sobre {categoryName || "Categoría especial"}
            </span>
            {surchargeReason}
          </div>
        </div>
      )}
    </div>
  );
}

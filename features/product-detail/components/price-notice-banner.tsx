import { Info, Sparkles } from "lucide-react";
import type { ProductDetailCategory } from "../types";
import {
  isLargeSize,
  computeCategorySurcharge,
  findActiveCategory,
} from "../utils/price-helpers";

interface PriceNoticeBannerProps {
  selectedSize: string;
  categories?: ProductDetailCategory[];
  categoryName?: string;
  surchargeReason?: string | null;
  basePrice?: number;
  /** When set, only show the notice for the category matching this slug. */
  filterCategorySlug?: string;
}

export function PriceNoticeBanner({
  selectedSize,
  categories = [],
  categoryName,
  surchargeReason,
  basePrice,
  filterCategorySlug,
}: PriceNoticeBannerProps) {
  const isPlusSize = isLargeSize(selectedSize);

  // ── Regla de banners de categoría ──
  // Sin filterCategorySlug (filtro "Todas" o acceso directo) → NO mostrar banners de categoría
  // Con filterCategorySlug → mostrar SOLO la nota de la categoría activa
  const activeCategory = filterCategorySlug
    ? findActiveCategory(categories, filterCategorySlug)
    : undefined;

  const categorySurcharge = computeCategorySurcharge(activeCategory, basePrice ?? 0);
  const categoryPrice = activeCategory
    ? (activeCategory.price ?? activeCategory.defaultPrice)
    : null;
  const categoryReason = activeCategory
    ? (activeCategory.productSurchargeReason || activeCategory.surchargeReason || "insumos y acabados especiales de la categoría")
    : null;

  const showCategoryBanner =
    filterCategorySlug &&
    activeCategory &&
    (categorySurcharge > 0 || Boolean(categoryReason));

  // Si no hay nada que mostrar, retornamos null
  if (!isPlusSize && !showCategoryBanner) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2.5 my-1">
      {/* Aviso de talla especial (> L) — siempre visible si aplica */}
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

      {/* Aviso de recargo por categoría — SOLO cuando hay una categoría activa en URL */}
      {showCategoryBanner && activeCategory && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50/80 border border-rose-200/80 text-rose-950 text-xs sm:text-sm shadow-xs transition-all">
          <Info className="h-4 w-4 text-rose-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-rose-900 block mb-0.5">
              Nota sobre categoría {activeCategory.name}
            </span>
            {categorySurcharge > 0 ? (
              <span>
                Esta pijama en la categoría <strong>{activeCategory.name}</strong> tiene un valor de{" "}
                <strong>${categoryPrice!.toLocaleString("es-CO")} COP</strong> (
                <strong>${categorySurcharge.toLocaleString("es-CO")} COP</strong> adicional al precio base) debido a{" "}
                {categoryReason}.
              </span>
            ) : (
              <span>{categoryReason}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

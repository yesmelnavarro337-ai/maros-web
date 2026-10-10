import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { sortSizes } from "@/lib/sizes";
import { PriceRangeFilter } from "./price-range-filter";
import {
  buildCatalogHref,
  isFilterValueActive,
  parseFilterList,
  toggleFilterValue,
} from "../filter-utils";
import type { CatalogSearchParams } from "../types";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface ColorOption {
  hex: string;
  label: string;
}

interface CatalogFilterSidebarProps {
  categories: CategoryOption[];
  sizes: string[];
  colors: ColorOption[];
  priceMin: number;
  priceMax: number;
  current: CatalogSearchParams;
}

export function CatalogFilterSidebar({ categories, sizes, colors, priceMin, priceMax, current }: CatalogFilterSidebarProps) {
  return (
    <aside className="w-full lg:w-56 shrink-0 flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-foreground mb-2.5">Categorías</p>
        <div className="flex flex-col gap-0.5">
          <Link
            href={buildCatalogHref(current, { categoria: undefined })}
            aria-current={parseFilterList(current.categoria).length === 0 ? "page" : undefined}
            className={cn(
              "-mx-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-colors",
              parseFilterList(current.categoria).length === 0
                ? "bg-primary/10 font-bold text-primary"
                : "text-foreground hover:bg-muted hover:text-primary"
            )}
          >
            {parseFilterList(current.categoria).length === 0 && (
              <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            )}
            Todas
          </Link>
          {categories.map((c) => {
            const value = c.slug || c.id;
            const isActive = isFilterValueActive(current.categoria, value);
            return (
              <Link
                key={c.id}
                href={buildCatalogHref(current, { categoria: toggleFilterValue(current.categoria, value) })}
                aria-pressed={isActive}
                className={cn(
                  "-mx-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 font-bold text-primary"
                    : "text-foreground hover:bg-muted hover:text-primary"
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
                    isActive ? "border-primary bg-primary text-primary-foreground" : "border-border"
                  )}
                  aria-hidden="true"
                >
                  {isActive && <Check className="h-3 w-3" />}
                </span>
                {c.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground mb-2.5">Talla</p>
        <div className="flex flex-wrap gap-2">
          {sortSizes(sizes).map((s) => {
            const isActive = isFilterValueActive(current.talla, s);
            return (
              <Link
                key={s}
                href={buildCatalogHref(current, { talla: toggleFilterValue(current.talla, s) })}
                aria-pressed={isActive}
                aria-label={`Talla ${s}${isActive ? " (seleccionada)" : ""}`}
                className={cn(
                  "h-8 w-8 flex items-center justify-center rounded-md border text-xs font-semibold transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "border-border text-foreground hover:bg-secondary"
                )}
              >
                {s}
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground mb-2.5">Color</p>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => {
            const isActive = isFilterValueActive(current.color, c.label);
            return (
              <Link
                key={c.hex}
                href={buildCatalogHref(current, { color: toggleFilterValue(current.color, c.label) })}
                aria-pressed={isActive}
                aria-label={`Color ${c.label}${isActive ? " (seleccionado)" : ""}`}
                className={cn(
                  "h-8 w-8 rounded-full border-2 transition-all relative flex items-center justify-center",
                  isActive
                    ? "border-primary scale-110 ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "border-border hover:scale-105"
                )}
                style={{ backgroundColor: c.hex }}
                title={c.label}
              >
                {isActive && (
                  <Check
                    className="h-4 w-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground mb-2.5">Rango de precio</p>
        <PriceRangeFilter
          min={priceMin}
          max={priceMax}
          currentMin={current.precioMin}
          currentMax={current.precioMax}
          preserve={current}
        />
      </div>
    </aside>
  );
}
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PriceRangeFilter } from "./price-range-filter";
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

function buildHref(current: CatalogSearchParams, patch: Partial<CatalogSearchParams>): string {
  const merged = { ...current, ...patch };
  const params = new URLSearchParams();
  Object.entries(merged).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return query ? `/catalogo?${query}` : "/catalogo";
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
        <div className="flex flex-col gap-1.5">
          <Link
            href={buildHref(current, { categoria: undefined })}
            className={cn(
              "text-sm",
              !current.categoria ? "text-primary font-medium" : "text-foreground hover:text-primary"
            )}
          >
            Todas
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={buildHref(current, { categoria: c.slug || c.id })}
              className={cn(
                "text-sm",
                current.categoria === (c.slug || c.id) ? "text-primary font-medium" : "text-foreground hover:text-primary"
              )}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground mb-2.5">Talla</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <Link
              key={s}
              href={buildHref(current, { talla: current.talla === s ? undefined : s })}
              className={cn(
                "h-8 w-8 flex items-center justify-center rounded-md border text-xs transition-colors",
                current.talla === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-foreground hover:bg-secondary"
              )}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground mb-2.5">Color</p>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <Link
              key={c.hex}
              href={buildHref(current, { color: current.color === c.hex ? undefined : c.hex })}
              className={cn(
                "h-7 w-7 rounded-full border-2 block transition-all",
                current.color === c.hex ? "border-primary scale-110" : "border-border"
              )}
              style={{ backgroundColor: c.hex }}
              title={c.label}
            />
          ))}
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
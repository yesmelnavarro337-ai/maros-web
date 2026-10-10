import Link from "next/link";
import { X } from "lucide-react";
import { buildCatalogHref, formatCOP, parseFilterList, toggleFilterValue } from "../filter-utils";
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

interface ActiveFilterChipsProps {
  current: CatalogSearchParams;
  categories: CategoryOption[];
  colors: ColorOption[];
}

interface FilterChip {
  key: string;
  label: string;
  patch: Partial<CatalogSearchParams>;
}

export function ActiveFilterChips({ current, categories, colors }: ActiveFilterChipsProps) {
  const chips: FilterChip[] = [];

  parseFilterList(current.categoria).forEach((slug) => {
    const cat = categories.find(
      (c) => c.slug.toLowerCase() === slug.toLowerCase() || c.id === slug
    );
    chips.push({
      key: `categoria-${slug}`,
      label: `Categoría: ${cat?.name ?? slug}`,
      patch: { categoria: toggleFilterValue(current.categoria, slug) },
    });
  });

  parseFilterList(current.talla).forEach((size) => {
    chips.push({
      key: `talla-${size}`,
      label: `Talla: ${size}`,
      patch: { talla: toggleFilterValue(current.talla, size) },
    });
  });

  parseFilterList(current.color).forEach((value) => {
    const col = colors.find((c) => c.label.toLowerCase() === value.toLowerCase());
    chips.push({
      key: `color-${value}`,
      label: `Color: ${col?.label ?? value}`,
      patch: { color: toggleFilterValue(current.color, value) },
    });
  });

  if (current.precioMin || current.precioMax) {
    const parts: string[] = [];
    if (current.precioMin) parts.push(`desde ${formatCOP(Number(current.precioMin))}`);
    if (current.precioMax) parts.push(`hasta ${formatCOP(Number(current.precioMax))}`);
    chips.push({
      key: "precio",
      label: `Precio: ${parts.join(" ")}`,
      patch: { precioMin: undefined, precioMax: undefined },
    });
  }

  if (current.buscar) {
    chips.push({
      key: "buscar",
      label: `Búsqueda: "${current.buscar}"`,
      patch: { buscar: undefined },
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Filtros activos">
      <span className="text-xs text-muted-foreground">Filtros:</span>
      {chips.map((chip) => (
        <Link
          key={chip.key}
          href={buildCatalogHref(current, chip.patch)}
          className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card py-1 pl-3 pr-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary"
        >
          {chip.label}
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <X className="h-3 w-3" aria-hidden="true" />
          </span>
        </Link>
      ))}
      <Link
        href="/catalogo"
        className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
      >
        Limpiar todo
      </Link>
    </div>
  );
}
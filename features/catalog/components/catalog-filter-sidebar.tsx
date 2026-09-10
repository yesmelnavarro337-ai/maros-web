import Link from "next/link";
import { cn } from "@/lib/utils";
import { PRODUCT_SIZES } from "../types";
import type { CatalogSearchParams } from "../types";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

const AVAILABLE_COLORS: { hex: string; label: string }[] = [
  { hex: "#6B6832", label: "Verde oliva" },
  { hex: "#B6AE3A", label: "Dorado" },
  { hex: "#EFE8D8", label: "Beige" },
  { hex: "#C98BA0", label: "Rosa" },
  { hex: "#4A6B7A", label: "Azul" },
  { hex: "#34351F", label: "Oliva oscuro" },
  { hex: "#B3453A", label: "Terracota" },
];

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
  current: CatalogSearchParams;
}

export function CatalogFilterSidebar({ categories, current }: CatalogFilterSidebarProps) {
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
          {PRODUCT_SIZES.map((s) => (
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
          {AVAILABLE_COLORS.map((c) => (
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
    </aside>
  );
}
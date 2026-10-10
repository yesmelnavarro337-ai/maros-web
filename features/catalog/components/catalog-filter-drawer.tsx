"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sortSizes } from "@/lib/sizes";
import { PriceRangeFilter } from "./price-range-filter";
import { parseFilterList } from "../filter-utils";
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

interface CatalogFilterDrawerProps {
  categories: CategoryOption[];
  sizes: string[];
  colors: ColorOption[];
  priceMin: number;
  priceMax: number;
  current: CatalogSearchParams;
  activeCount: number;
}

function toggleValue(list: string[], value: string): string[] {
  const key = value.toLowerCase();
  return list.some((item) => item.toLowerCase() === key)
    ? list.filter((item) => item.toLowerCase() !== key)
    : [...list, value];
}

export function CatalogFilterDrawer({
  categories,
  sizes,
  colors,
  priceMin,
  priceMax,
  current,
  activeCount,
}: CatalogFilterDrawerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Estado borrador: no se aplica a la URL hasta pulsar "Aplicar filtros".
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    parseFilterList(current.categoria)
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    parseFilterList(current.talla)
  );
  const [selectedColors, setSelectedColors] = useState<string[]>(
    parseFilterList(current.color)
  );

  const parsedMin = Number(current.precioMin ? Number(current.precioMin) : NaN);
  const parsedMax = Number(current.precioMax ? Number(current.precioMax) : NaN);
  const [draftPriceMin, setDraftPriceMin] = useState(
    !Number.isNaN(parsedMin) ? Math.max(priceMin, parsedMin) : priceMin
  );
  const [draftPriceMax, setDraftPriceMax] = useState(
    !Number.isNaN(parsedMax) ? Math.min(priceMax, parsedMax) : priceMax
  );

  function clear() {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setDraftPriceMin(priceMin);
    setDraftPriceMax(priceMax);
  }

  function apply() {
    const params = new URLSearchParams();
    const set = (key: string, values: string[]) => {
      if (values.length > 0) params.set(key, values.join(","));
    };

    if (current.buscar) params.set("buscar", current.buscar);
    if (current.orden) params.set("orden", current.orden);
    set("categoria", selectedCategories);
    set("talla", selectedSizes);
    set("color", selectedColors);
    if (draftPriceMin > priceMin) params.set("precioMin", String(draftPriceMin));
    if (draftPriceMax < priceMax) params.set("precioMax", String(draftPriceMax));

    const query = params.toString();
    router.push(query ? `/catalogo?${query}` : "/catalogo", { scroll: false });
    setOpen(false);
  }

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-center gap-2 border-primary/30 bg-card text-foreground hover:bg-secondary/60"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filtros
            {activeCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                {activeCount}
              </span>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="flex max-h-[85vh] flex-col gap-0 p-0"
        >
          <SheetHeader className="shrink-0 flex-row items-center justify-between border-b border-border px-4 py-3">
            <SheetTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filtros
            </SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Cerrar filtros">
                <X aria-hidden="true" />
              </Button>
            </SheetClose>
          </SheetHeader>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5">
            {/* Categorías */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2.5">Categorías</p>
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => setSelectedCategories([])}
                  className={cn(
                    "-mx-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                    selectedCategories.length === 0
                      ? "bg-primary/10 font-bold text-primary"
                      : "text-foreground hover:bg-muted hover:text-primary"
                  )}
                >
                  {selectedCategories.length === 0 && (
                    <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  )}
                  Todas
                </button>
                {categories.map((c) => {
                  const value = c.slug || c.id;
                  const isActive = selectedCategories.some(
                    (item) => item.toLowerCase() === value.toLowerCase()
                  );
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCategories((prev) => toggleValue(prev, value))}
                      className={cn(
                        "-mx-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                        isActive
                          ? "bg-primary/10 font-bold text-primary"
                          : "text-foreground hover:bg-muted hover:text-primary"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
                          isActive
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border"
                        )}
                        aria-hidden="true"
                      >
                        {isActive && <Check className="h-3 w-3" />}
                      </span>
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tallas */}
            <div className="mt-6">
              <p className="text-sm font-medium text-foreground mb-2.5">Talla</p>
              <div className="flex flex-wrap gap-2">
                {sortSizes(sizes).map((s) => {
                  const isActive = selectedSizes.some(
                    (item) => item.toLowerCase() === s.toLowerCase()
                  );
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSizes((prev) => toggleValue(prev, s))}
                      aria-pressed={isActive}
                      className={cn(
                        "h-8 w-8 flex items-center justify-center rounded-md border text-xs font-semibold transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "border-border text-foreground hover:bg-secondary"
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colores */}
            <div className="mt-6">
              <p className="text-sm font-medium text-foreground mb-2.5">Color</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => {
                  const isActive = selectedColors.some(
                    (item) => item.toLowerCase() === c.label.toLowerCase()
                  );
                  return (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setSelectedColors((prev) => toggleValue(prev, c.label))}
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
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rango de precio (borrador) */}
            <div className="mt-6">
              <p className="text-sm font-medium text-foreground mb-2.5">Rango de precio</p>
              <PriceRangeFilter
                min={priceMin}
                max={priceMax}
                currentMin={current.precioMin}
                currentMax={current.precioMax}
                onDraftChange={(low, high) => {
                  setDraftPriceMin(low);
                  setDraftPriceMax(high);
                }}
              />
            </div>
          </div>

          <SheetFooter className="shrink-0 gap-2 border-t border-border p-3">
            <div className="grid w-full grid-cols-2 gap-2">
              <Button variant="outline" onClick={clear}>
                Limpiar filtros
              </Button>
              <Button onClick={apply}>Aplicar filtros</Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
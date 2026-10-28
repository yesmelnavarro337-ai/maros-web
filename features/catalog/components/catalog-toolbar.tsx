"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { buildCatalogHref } from "../filter-utils";
import type { CatalogSearchParams } from "../types";

interface CatalogToolbarProps {
  current: CatalogSearchParams;
  resultCount: number;
}

export function CatalogToolbar({
  current,
  resultCount,
}: CatalogToolbarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(current.buscar ?? "");

  // Sync state if current.buscar changes externally
  useEffect(() => {
    setSearchValue(current.buscar ?? "");
  }, [current.buscar]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = searchValue.trim();
    startTransition(() => {
      router.push(
        buildCatalogHref(current, { buscar: query ? query : undefined }),
        { scroll: false }
      );
    });
  }

  function handleClearSearch() {
    setSearchValue("");
    startTransition(() => {
      router.push(
        buildCatalogHref(current, { buscar: undefined }),
        { scroll: false }
      );
    });
  }

  function handleSortChange(newOrder: string) {
    startTransition(() => {
      router.push(
        buildCatalogHref(current, {
          orden: newOrder === "recientes" ? undefined : (newOrder as CatalogSearchParams["orden"]),
        }),
        { scroll: false }
      );
    });
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Búsqueda */}
      <form
        onSubmit={handleSearchSubmit}
        className="relative w-full sm:max-w-xs"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />

        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Buscar productos..."
          className="w-full h-9 pl-9 pr-8 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
        />

        {searchValue && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-full hover:bg-muted"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>

      {/* Resultados + orden */}
      <div className="flex items-center justify-between sm:justify-end gap-3">
        <span className="text-sm text-muted-foreground flex items-center gap-1.5">
          {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
          Mostrando {resultCount} producto
          {resultCount !== 1 ? "s" : ""}
        </span>

        <div className="relative">
          <select
            value={current.orden ?? "recientes"}
            onChange={(e) => handleSortChange(e.target.value)}
            disabled={isPending}
            className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer transition-all disabled:opacity-60"
            aria-label="Ordenar productos"
          >
            <option value="recientes">Más recientes</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
            <option value="nombre">Nombre A-Z</option>
          </select>
        </div>
      </div>
    </div>
  );
}
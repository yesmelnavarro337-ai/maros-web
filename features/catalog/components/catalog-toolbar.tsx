"use client";

import { Search } from "lucide-react";
import type { CatalogSearchParams } from "../types";

interface CatalogToolbarProps {
  current: CatalogSearchParams;
  resultCount: number;
}

export function CatalogToolbar({
  current,
  resultCount,
}: CatalogToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Búsqueda */}
      <form
        action="/catalogo"
        method="GET"
        className="relative w-full sm:max-w-xs"
      >
        {current.categoria && (
          <input
            type="hidden"
            name="categoria"
            value={current.categoria}
          />
        )}

        {current.talla && (
          <input
            type="hidden"
            name="talla"
            value={current.talla}
          />
        )}

        {current.color && (
          <input
            type="hidden"
            name="color"
            value={current.color}
          />
        )}

        {current.orden && (
          <input
            type="hidden"
            name="orden"
            value={current.orden}
          />
        )}

        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

        <input
          type="text"
          name="buscar"
          defaultValue={current.buscar}
          placeholder="Buscar productos..."
          className="w-full h-9 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </form>

      {/* Resultados + orden */}
      <div className="flex items-center justify-between sm:justify-end gap-3">
        <span className="text-sm text-muted-foreground">
          Mostrando {resultCount} producto
          {resultCount !== 1 ? "s" : ""}
        </span>

        <form action="/catalogo" method="GET">
          {current.categoria && (
            <input
              type="hidden"
              name="categoria"
              value={current.categoria}
            />
          )}

          {current.talla && (
            <input
              type="hidden"
              name="talla"
              value={current.talla}
            />
          )}

          {current.color && (
            <input
              type="hidden"
              name="color"
              value={current.color}
            />
          )}

          {current.buscar && (
            <input
              type="hidden"
              name="buscar"
              value={current.buscar}
            />
          )}

          <select
            name="orden"
            defaultValue={current.orden ?? "recientes"}
            onChange={(e) =>
              e.currentTarget.form?.requestSubmit()
            }
            className="h-9 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="recientes">Más recientes</option>
            <option value="precio-asc">
              Precio: menor a mayor
            </option>
            <option value="precio-desc">
              Precio: mayor a menor
            </option>
            <option value="nombre">
              Nombre A-Z
            </option>
          </select>
        </form>
      </div>
    </div>
  );
}
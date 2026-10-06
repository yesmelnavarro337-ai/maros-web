"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ImageOff, Search, X } from "lucide-react";
import { clientApiFetch } from "@/lib/api/client-fetch";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

interface ApiSearchProduct {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  thumbnailUrl?: string | null;
  images?: string[] | null;
  categoryName?: string | null;
}

const POPULAR_TERMS = [
  "pijama",
  "pijama elf",
  "navidad",
  "personalizada",
  "satín",
  "batas",
];

const PREVIEW_LIMIT = 6;
const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

const COP_FORMAT = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ApiSearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  const runSearch = async (term: string) => {
    const requestId = ++requestIdRef.current;
    try {
      const data = await clientApiFetch<ApiSearchProduct[]>(
        `products?search=${encodeURIComponent(term)}`
      );
      if (requestId !== requestIdRef.current) return; // respuesta vieja, se descarta
      setResults(Array.isArray(data) ? data : []);
    } catch {
      if (requestId !== requestIdRef.current) return;
      setResults([]);
    } finally {
      if (requestId === requestIdRef.current) {
        setSearched(true);
        setLoading(false);
      }
    }
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const term = value.trim();
    if (term.length < MIN_QUERY_LENGTH) {
      requestIdRef.current++; // invalida búsquedas en vuelo
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(() => runSearch(term), DEBOUNCE_MS);
  };

  const resetSearch = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    requestIdRef.current++;
    setQuery("");
    setResults([]);
    setSearched(false);
    setLoading(false);
  };

  const handleClose = () => {
    resetSearch();
    onClose();
  };

  // Cierre con Esc y bloqueo del scroll del body mientras el modal está abierto.
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onClose]);

  // Enfoque automático al abrir.
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(timer);
  }, [open]);

  // Cancela el debounce pendiente si el componente se desmonta.
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  if (!open) return null;

  const term = query.trim();
  const preview = results.slice(0, PREVIEW_LIMIT);
  const hasMore = results.length > PREVIEW_LIMIT;
  const catalogHref = `/catalogo?buscar=${encodeURIComponent(term)}`;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Buscador de la tienda">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-200"
        onClick={handleClose}
      />

      {/* Panel superior */}
      <div className="absolute inset-x-0 top-0 bg-background border-b border-border shadow-xl animate-in slide-in-from-top-4 fade-in-0 duration-300 max-h-[85vh] flex flex-col">
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-5 flex flex-col gap-4 min-h-0">
          {/* Barra de entrada */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Buscar pijamas, colecciones, telas..."
                aria-label="Buscar productos"
                className="w-full h-11 sm:h-12 rounded-full bg-card border border-border pl-11 pr-11 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary transition-shadow"
              />
              {query.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    handleQueryChange("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Borrar búsqueda"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Cerrar buscador"
              className="h-11 w-11 shrink-0 rounded-full border border-border bg-card text-foreground hover:bg-secondary flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sugerencias populares */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Populares:
            </span>
            {POPULAR_TERMS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  handleQueryChange(chip);
                  inputRef.current?.focus();
                }}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  term.toLowerCase() === chip.toLowerCase()
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary/60 text-foreground border-border hover:bg-secondary hover:border-primary/40"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Resultados */}
          <div className="min-h-0 overflow-y-auto custom-scrollbar -mx-1 px-1">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-2" aria-label="Buscando">
                {Array.from({ length: PREVIEW_LIMIT }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card p-2 animate-pulse">
                    <div className="h-16 w-16 rounded-lg bg-secondary" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-3/4 rounded bg-secondary" />
                      <div className="h-3 w-1/2 rounded bg-secondary" />
                    </div>
                  </div>
                ))}
              </div>
            ) : searched && term.length >= MIN_QUERY_LENGTH ? (
              preview.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No encontramos coincidencias para{" "}
                  <span className="font-semibold text-foreground">“{term}”</span>.
                  Prueba con otra palabra o revisa las sugerencias.
                </p>
              ) : (
                <div className="flex flex-col gap-3 py-2">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {preview.map((product) => (
                      <Link
                        key={product.id}
                        href={`/productos/${product.slug}`}
                        onClick={handleClose}
                        className="group flex items-center gap-3 rounded-xl border border-border bg-card p-2 hover:border-primary/50 hover:shadow-sm transition-all"
                      >
                        <div className="relative h-16 w-16 shrink-0 rounded-lg bg-secondary overflow-hidden">
                          {product.thumbnailUrl || product.images?.[0] ? (
                            <Image
                              src={cloudinaryUrl(product.thumbnailUrl || product.images![0])}
                              alt={product.name}
                              fill
                              sizes="64px"
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageOff className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                            {product.name}
                          </p>
                          <p className="text-xs font-semibold text-primary mt-1">
                            {COP_FORMAT.format(product.basePrice || 0)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {hasMore && (
                    <Link
                      href={catalogHref}
                      onClick={handleClose}
                      className="group mx-auto mt-1 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-xs sm:text-sm font-medium shadow-md hover:bg-primary/90 transition-all"
                    >
                      <span>Ver todo ({results.length} resultados)</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
              )
            ) : (
              <p className="py-6 text-center text-xs sm:text-sm text-muted-foreground">
                Escribe al menos {MIN_QUERY_LENGTH} letras para buscar en todo el catálogo.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

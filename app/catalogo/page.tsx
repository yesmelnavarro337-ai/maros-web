import Link from "next/link";
import { redirect } from "next/navigation";
import { CatalogProductGrid } from "@/features/catalog/components/catalog-product-grid";
import { CatalogFilterSidebar } from "@/features/catalog/components/catalog-filter-sidebar";
import { CatalogFilterDrawer } from "@/features/catalog/components/catalog-filter-drawer";
import { ActiveFilterChips } from "@/features/catalog/components/active-filter-chips";
import { CatalogToolbar } from "@/features/catalog/components/catalog-toolbar";
import {
  getCatalogFilterOptions,
  getCatalogProducts,
  getCategories,
  getFeaturedCatalog,
} from "@/features/catalog/services/catalog.service";
import type { CatalogSearchParams, SortOption } from "@/features/catalog/types";
import { countActiveFilters, parseFilterList } from "@/features/catalog/filter-utils";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";

export const PAGE_SIZE = 12;

interface CatalogoPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const rawParams = await searchParams;
  const page = Math.max(1, Number.parseInt(rawParams.page ?? "1", 10) || 1);

  return {
    ...buildMetadata({
      title: page > 1 ? `Catálogo — Página ${page}` : "Catálogo",
      description:
        "Explora nuestro catálogo completo de pijamas personalizadas — para mujer, hombre, niños, parejas y familia.",
      path: `/catalogo${page > 1 ? `?page=${page}` : ""}`,
    }),
    robots: page > 1 ? { index: false, follow: true } : undefined,
  };
}

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const rawParams = await searchParams;
  const requestedPage = Math.max(1, Number.parseInt(rawParams.page ?? "1", 10) || 1);

  const params: CatalogSearchParams = {
    categoria: rawParams.categoria,
    talla: rawParams.talla,
    color: rawParams.color,
    buscar: rawParams.buscar,
    precioMin: rawParams.precioMin,
    precioMax: rawParams.precioMax,
    orden: rawParams.orden as SortOption | undefined,
  };

  const [products, categories, filterOptions, featured] = await Promise.all([
    getCatalogProducts(params),
    getCategories(),
    getCatalogFilterOptions({ categoria: params.categoria, buscar: params.buscar }),
    getFeaturedCatalog(),
  ]);

  // Los productos seleccionados desde maros-admin se muestran primero (en su
  // orden configurado); el resto conserva el ordenamiento del catálogo.
  const featuredOrder = new Map(featured.map((p, index) => [p.id, index]));
  const orderedProducts = [...products].sort((a, b) => {
    const aIndex = featuredOrder.get(a.id);
    const bIndex = featuredOrder.get(b.id);
    if (aIndex !== undefined && bIndex !== undefined) return aIndex - bIndex;
    if (aIndex !== undefined) return -1;
    if (bIndex !== undefined) return 1;
    return 0;
  });

  const totalProducts = orderedProducts.length;
  const pageCount = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));
  const page = Math.min(requestedPage, pageCount);

  if (page !== requestedPage) {
    const q = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) q.set(key, value);
    }
    q.set("page", String(page));
    redirect(`/catalogo?${q.toString()}`);
  }

  const pageProducts = orderedProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilterCount = countActiveFilters(params);
  const primaryCategorySlug = parseFilterList(params.categoria)[0];
  const filterStateKey = Object.entries(params)
    .filter(([, value]) => value)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const queryForPage = (target: number) => {
    const q = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) q.set(key, value);
    }
    q.set("page", String(target));
    return `/catalogo?${q.toString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-xs text-muted-foreground mb-3">
        Inicio / <span className="text-foreground">Catálogo</span>
      </nav>

      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Inicio", href: "/" },
          { label: "Catálogo", href: "/catalogo" },
        ])}
      />

      <h1 className="font-heading text-3xl text-foreground">Catálogo</h1>
      <p className="text-muted-foreground mt-1 mb-6">
        Encuentra el estilo perfecto para ti y los que más amas.
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        <CatalogFilterDrawer
          key={filterStateKey}
          categories={categories}
          sizes={filterOptions.sizes}
          colors={filterOptions.colors}
          priceMin={filterOptions.priceMin}
          priceMax={filterOptions.priceMax}
          current={params}
          activeCount={activeFilterCount}
        />

        <div className="hidden lg:block">
          <CatalogFilterSidebar
            categories={categories}
            sizes={filterOptions.sizes}
            colors={filterOptions.colors}
            priceMin={filterOptions.priceMin}
            priceMax={filterOptions.priceMax}
            current={params}
          />
        </div>

        <div className="flex-1">
          <CatalogToolbar current={params} resultCount={totalProducts} />

          <ActiveFilterChips
            current={params}
            categories={categories}
            colors={filterOptions.colors}
          />

          {pageProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-16">
              No encontramos productos con esos filtros. Intenta ajustar tu búsqueda.
            </p>
          ) : (
            <>
              <CatalogProductGrid
                products={pageProducts}
                categorySlug={primaryCategorySlug}
              />

              {pageCount > 1 && (
                <nav className="flex items-center justify-center gap-4 mt-10" aria-label="Paginación">
                  {page > 1 ? (
                    <Link
                      href={queryForPage(page - 1)}
                      className="h-9 px-4 inline-flex items-center justify-center rounded-md border border-border bg-card text-sm text-foreground hover:border-primary transition-colors"
                    >
                      ← Anterior
                    </Link>
                  ) : (
                    <span className="h-9 px-4 inline-flex items-center justify-center rounded-md border border-border text-sm text-muted-foreground opacity-50 cursor-not-allowed">
                      ← Anterior
                    </span>
                  )}

                  <span className="text-sm text-muted-foreground">
                    Página {page} de {pageCount}
                  </span>

                  {page < pageCount ? (
                    <Link
                      href={queryForPage(page + 1)}
                      className="h-9 px-4 inline-flex items-center justify-center rounded-md border border-border bg-card text-sm text-foreground hover:border-primary transition-colors"
                    >
                      Siguiente →
                    </Link>
                  ) : (
                    <span className="h-9 px-4 inline-flex items-center justify-center rounded-md border border-border text-sm text-muted-foreground opacity-50 cursor-not-allowed">
                      Siguiente →
                    </span>
                  )}
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
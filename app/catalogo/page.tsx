import { ProductCard } from "@/components/shared/product-card";
import { CatalogFilterSidebar } from "@/features/catalog/components/catalog-filter-sidebar";
import { CatalogToolbar } from "@/features/catalog/components/catalog-toolbar";
import {
  getCatalogFilterOptions,
  getCatalogProducts,
  getCategories,
} from "@/features/catalog/services/catalog.service";
import type { CatalogSearchParams, SortOption } from "@/features/catalog/types";


export const metadata = {
  title: "Catálogo",
  description: "Explora nuestro catálogo completo de pijamas personalizadas — para mujer, hombre, niños, parejas y familia.",
};

interface CatalogoPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const rawParams = await searchParams;
  const params: CatalogSearchParams = {
    categoria: rawParams.categoria,
    talla: rawParams.talla,
    color: rawParams.color,
    buscar: rawParams.buscar,
    orden: rawParams.orden as SortOption | undefined,
  };

  const [products, categories, filterOptions] = await Promise.all([
    getCatalogProducts(params),
    getCategories(),
    getCatalogFilterOptions({ categoria: params.categoria, buscar: params.buscar }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-xs text-muted-foreground mb-3">
        Inicio / <span className="text-foreground">Catálogo</span>
      </nav>
      <h1 className="font-heading text-3xl text-foreground">Catálogo</h1>
      <p className="text-muted-foreground mt-1 mb-6">
        Encuentra el estilo perfecto para ti y los que más amas.
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        <details className="lg:hidden rounded-lg border border-border bg-card px-4 py-3">
          <summary className="text-sm font-medium text-foreground cursor-pointer">Filtros</summary>
          <div className="mt-4">
            <CatalogFilterSidebar
              categories={categories}
              sizes={filterOptions.sizes}
              colors={filterOptions.colors}
              current={params}
            />
          </div>
        </details>

        <div className="hidden lg:block">
          <CatalogFilterSidebar
            categories={categories}
            sizes={filterOptions.sizes}
            colors={filterOptions.colors}
            current={params}
          />
        </div>

        <div className="flex-1">
          <CatalogToolbar current={params} resultCount={products.length} />

          {products.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-16">
              No encontramos productos con esos filtros. Intenta ajustar tu búsqueda.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mt-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
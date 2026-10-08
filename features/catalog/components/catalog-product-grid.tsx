"use client";

import { ProductCard } from "@/components/shared/product-card";
import { Reveal } from "@/components/shared/reveal";
import { ProductQuickViewModal } from "@/features/catalog/components/product-quick-view-modal";
import { useQuickView } from "@/features/catalog/hooks/use-quick-view";
import type { ProductPreview } from "@/types/product";

interface CatalogProductGridProps {
  products: ProductPreview[];
  categorySlug?: string;
}

export function CatalogProductGrid({ products, categorySlug }: CatalogProductGridProps) {
  const { isOpen, isLoading, previewProduct, fullProduct, openQuickView, closeQuickView } =
    useQuickView();

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mt-6">
        {products.map((p, index) => (
          <Reveal key={p.id} delay={Math.min((index % 6) * 75, 400)} className="h-full">
            <ProductCard
              product={p}
              categorySlug={categorySlug}
              onQuickView={openQuickView}
            />
          </Reveal>
        ))}
      </div>

      <ProductQuickViewModal
        isOpen={isOpen}
        previewProduct={previewProduct}
        fullProduct={fullProduct}
        isLoading={isLoading}
        onClose={closeQuickView}
      />
    </>
  );
}

export function CatalogProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mt-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-2xl border border-brand-border/40 p-3 bg-card/60">
          <div className="w-full aspect-[4/5] rounded-xl shimmer-effect bg-muted/60" />
          <div className="h-4 w-3/4 rounded shimmer-effect bg-muted/60" />
          <div className="h-4 w-1/3 rounded shimmer-effect bg-muted/60" />
        </div>
      ))}
    </div>
  );
}

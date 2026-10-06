"use client";

import { ProductCard } from "@/components/shared/product-card";
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
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            categorySlug={categorySlug}
            onQuickView={openQuickView}
          />
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

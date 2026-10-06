"use client";

import { ProductCard } from "@/components/shared/product-card";
import { ProductQuickViewModal } from "@/features/catalog/components/product-quick-view-modal";
import { useQuickView } from "@/features/catalog/hooks/use-quick-view";
import type { ProductPreview } from "@/types/product";

interface CollectionProductsGridProps {
  products: ProductPreview[];
}

export function CollectionProductsGrid({ products }: CollectionProductsGridProps) {
  const { isOpen, isLoading, previewProduct, fullProduct, openQuickView, closeQuickView } =
    useQuickView();

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onQuickView={openQuickView} />
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

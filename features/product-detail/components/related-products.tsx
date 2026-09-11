import { ProductCard } from "@/components/shared/product-card";
import type { RelatedProduct } from "../services/product-detail.service";

export function RelatedProducts({ products }: { products: RelatedProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="flex items-end justify-between mb-6">
        <h2 className="font-heading text-2xl sm:text-3xl text-foreground">
          También te pueden <span className="text-primary">interesar</span>
        </h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
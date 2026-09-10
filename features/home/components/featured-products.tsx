import Link from "next/link";
import { ProductCard } from "@/components/shared/product-card";
import type { ProductPreview } from "@/types/product";

export function FeaturedProducts({ products }: { products: ProductPreview[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading text-2xl sm:text-3xl text-foreground">
          Productos <span className="text-primary">destacados</span>
        </h2>
        <Link href="/catalogo" className="text-sm text-primary hover:underline">
          Ver todos →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
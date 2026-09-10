import { notFound } from "next/navigation";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { ProductCard } from "@/components/shared/product-card";
import { getCollectionById, getProductsByCollection } from "@/features/collections/services/collections.service";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const collection = await getCollectionById(id);

  if (!collection) return {};

  return buildMetadata({
    title: collection.name,
    description: collection.description,
    path: `/colecciones/${collection.id}`,
    image: collection.image,
  });
}

export default async function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const collection = await getCollectionById(id);
  if (!collection) notFound();

  const products = await getProductsByCollection(id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-xs text-muted-foreground mb-6">
        Inicio / <span className="text-foreground">{collection.name}</span>
      </nav>

      <div
        className="relative rounded-2xl overflow-hidden min-h-[180px] flex items-center mb-10"
        style={{ backgroundColor: `${collection.accentHex}1A` }}
      >
        {!collection.image && (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageOff className="h-10 w-10" style={{ color: collection.accentHex }} />
          </div>
        )}
        {collection.image && (
          <Image src={collection.image} alt={collection.name} fill sizes="100vw" className="object-cover" />
        )}
        <div className="relative z-10 px-8 py-8">
          <h1 className="font-heading text-3xl sm:text-4xl text-foreground">{collection.name}</h1>
          <p className="text-muted-foreground mt-2 max-w-lg">{collection.description}</p>
          <p className="text-sm text-foreground mt-2">{collection.productCount} productos</p>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-16">
          Aún no hay productos en esta colección.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
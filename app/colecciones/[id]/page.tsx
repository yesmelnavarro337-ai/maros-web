import { notFound } from "next/navigation";
import Image from "next/image";
import { ProductCard } from "@/components/shared/product-card";
import { getCollectionById, getProductsByCollection } from "@/features/collections/services/collections.service";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

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

      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Inicio", href: "/" },
          { label: "Colecciones", href: "/colecciones" },
          { label: collection.name, href: `/colecciones/${collection.id}` },
        ])}
      />

      <div
        className="relative rounded-2xl overflow-hidden min-h-[220px] flex items-center mb-10"
        style={{ backgroundColor: `${collection.accentHex}33` }}
      >
        {collection.image && (
          <>
            <Image src={cloudinaryUrl(collection.image)} alt={collection.name} fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/75 via-black/35 to-transparent" />
          </>
        )}
        <div className={collection.image ? "relative z-10 px-8 py-12 text-white" : "relative z-10 px-8 py-12 text-foreground"}>
          <h1 className="font-heading text-3xl sm:text-4xl">{collection.name}</h1>
          <p className={collection.image ? "text-white/90 mt-2 max-w-lg" : "text-muted-foreground mt-2 max-w-lg"}>
            {collection.description}
          </p>
          <p className={collection.image ? "text-white/75 mt-2 text-sm" : "text-foreground mt-2 text-sm"}>
            {collection.productCount} {collection.productCount === 1 ? "prenda" : "prendas"} disponibles
          </p>
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
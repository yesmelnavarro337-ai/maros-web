import { CollectionCard } from "@/components/shared/collection-card";
import { getCollections } from "@/features/collections/services/collections.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ColeccionPage({ params }: { params: { slug: string } }) {
  const collections = await getCollections();
  const collection = collections.find((c) => c.id === params.slug || c.name.toLowerCase().includes(params.slug.toLowerCase()));

  if (!collection) {
    return (
      <section>
        <h1 className="text-3xl font-bold">Colección no encontrada</h1>
        <p className="text-muted-foreground">La colección solicitada no existe.</p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{collection.name}</h1>
      <p className="text-muted-foreground mb-6">{collection.description}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
        {collection.productCount > 0 ? (
          <p className="text-sm text-muted-foreground">Productos: {collection.productCount}</p>
        ) : (
          <p className="text-sm text-muted-foreground">No hay productos en esta colección.</p>
        )}
      </div>
    </section>
  );
}
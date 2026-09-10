import { CollectionCard } from "@/components/shared/collection-card";
import { getCollections } from "@/features/collections/services/collections.service";

export const metadata = {
  title: "Colecciones",
  description: "Ediciones especiales para cada ocasión — Navidad, Día de la Madre, Día del Padre y más.",
};

export default async function ColeccionesPage() {
  const collections = await getCollections();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-xs text-muted-foreground mb-3">
        Inicio / <span className="text-foreground">Colecciones</span>
      </nav>
      <h1 className="font-heading text-3xl text-foreground">Colecciones</h1>
      <p className="text-muted-foreground mt-1 mb-6">Ediciones especiales para cada ocasión.</p>

      {collections.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-16">
          Aún no hay colecciones disponibles.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {collections.map((c) => (
            <CollectionCard key={c.id} collection={c} />
          ))}
        </div>
      )}
    </div>
  );
}
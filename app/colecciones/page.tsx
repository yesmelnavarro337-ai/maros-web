import { CollectionCard } from "@/components/shared/collection-card";
import { PageHeroSection } from "@/components/shared/page-hero-section";
import { getCollections } from "@/features/collections/services/collections.service";
import { getPageHeader } from "@/features/page-headers/services/page-headers.service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Colecciones",
  description: "Ediciones especiales para cada ocasión — Navidad, Día de la Madre, Día del Padre y más.",
};

export default async function ColeccionesPage() {
  const [collections, header] = await Promise.all([
    getCollections(),
    getPageHeader("collections"),
  ]);

  return (
    <>
      <PageHeroSection
        header={header}
        fallback={{
          title: "Colecciones",
          subtitle: "Ediciones especiales para cada ocasión.",
        }}
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
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
    </>
  );
}
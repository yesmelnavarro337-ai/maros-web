import { getPublicSettings } from "@/features/settings/services/settings.service";

export default async function DevolucionesPage() {
  const settings = await getPublicSettings();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-xs text-muted-foreground mb-3">
        Inicio / <span className="text-foreground">Cambios y devoluciones</span>
      </nav>
      <h1 className="font-heading text-3xl text-foreground mb-6">Cambios y devoluciones</h1>

      {settings.legalReturnsPolicy ? (
        <p className="text-foreground leading-relaxed whitespace-pre-line">{settings.legalReturnsPolicy}</p>
      ) : (
        <p className="text-muted-foreground">
          Para consultas sobre cambios o devoluciones, contáctanos directamente por WhatsApp
          y con gusto te ayudamos a resolverlo.
        </p>
      )}
    </div>
  );
}
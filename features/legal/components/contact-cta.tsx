import { MessageCircle } from "lucide-react";
import { buildWhatsAppHref } from "@/features/settings/services/settings.service";
import type { PublicSettings } from "@/features/settings/types";

export function ContactCta({ settings }: { settings: PublicSettings }) {
  const whatsappHref = buildWhatsAppHref(
    settings.whatsappNumber,
    "¡Hola! Tengo una duda sobre una página de términos o políticas."
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border bg-card px-6 py-6">
      <div>
        <p className="font-heading text-lg text-foreground">¿Tienes más dudas?</p>
        <p className="text-sm text-muted-foreground mt-1">Escríbenos y con gusto te ayudamos.</p>
      </div>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
      >
        <MessageCircle className="h-4 w-4" />
        Escribir por WhatsApp
      </a>
    </div>
  );
}
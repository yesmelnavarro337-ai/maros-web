import Image from "next/image";
import type { PublicSettings } from "@/features/settings/types";
import { buildWhatsAppHref } from "@/features/settings/services/settings.service";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

export function MaintenanceView({ settings }: { settings?: PublicSettings }) {
  const siteName = settings?.siteName || "Maro's Pijamas";
  const logoUrl = settings?.logoUrl ? cloudinaryUrl(settings.logoUrl) : "/logo.png";
  const whatsappHref = settings?.whatsappNumber
    ? buildWhatsAppHref(settings.whatsappNumber, "¡Hola! Quisiera información mientras el sitio está en mantenimiento.")
    : null;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-md w-full bg-card p-8 rounded-2xl shadow-xl border border-border">
        <Image
          src={logoUrl}
          alt={siteName}
          width={80}
          height={80}
          className="rounded-full mx-auto mb-6 object-cover border-2 border-brand-gold/30 shadow-md"
        />
        <h1 className="font-heading text-3xl text-foreground mb-3 font-bold">
          Estamos mejorando para ti
        </h1>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Nuestro sitio se encuentra en mantenimiento temporal para brindarte una mejor experiencia.
          Vuelve pronto — mientras tanto, si necesitas ayuda o deseas realizar un pedido, escríbenos directamente.
        </p>
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md hover:shadow-lg transition-all text-sm w-full sm:w-auto"
          >
            Escríbenos por WhatsApp
          </a>
        )}
      </div>
    </main>
  );
}

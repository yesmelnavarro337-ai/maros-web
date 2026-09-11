import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppHref } from "@/features/settings/services/settings.service";
import { getPublicSettings } from "@/features/settings/services/settings.server";

export async function AboutCta() {
  const settings = await getPublicSettings();
  const whatsappHref = buildWhatsAppHref(
    settings.whatsappNumber,
    "Hola! Me gustaría conocer más sobre Maro's Pijamas y solicitar una cotización.",
  );

  return (
    <section className="bg-brand-gold">
      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20 flex flex-col items-center text-center overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, color-mix(in oklch, var(--color-brand-gold-foreground) 12%, transparent), transparent 40%), radial-gradient(circle at 85% 80%, color-mix(in oklch, var(--color-brand-gold-foreground) 12%, transparent), transparent 40%)",
          }}
        />
        <div className="relative z-10 max-w-2xl flex flex-col items-center">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-gold-foreground/70 mb-3">
            ¿Lista para empezar?
          </p>
          <h2 className="font-heading text-3xl sm:text-5xl text-brand-gold-foreground leading-tight">
            Hagamos realidad tu pijama ideal
          </h2>
          <p className="text-brand-gold-foreground/85 mt-4 text-base sm:text-lg">
            Escríbenos por WhatsApp y cuéntanos tu idea — te proponemos diseño, precio y
            tiempos de entrega.
          </p>
          <Button asChild variant="secondary" size="lg" className="mt-8 rounded-full px-7 bg-brand-gold-foreground text-brand-gold hover:bg-white/90">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4 mr-2" />
              Cotizar por WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

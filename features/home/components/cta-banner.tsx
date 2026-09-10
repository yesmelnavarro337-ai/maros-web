import { MessageCircle, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppHref } from "@/features/settings/services/settings.service";
import { getPublicSettings } from "@/features/settings/services/settings.service";

export async function CtaBanner() {
  const settings = await getPublicSettings();
  const whatsappHref = buildWhatsAppHref(settings.whatsappNumber, "¡Hola! Quiero diseñar mi pijama perfecta.");

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="relative rounded-2xl overflow-hidden bg-primary min-h-[220px] flex items-center">
        <div className="absolute inset-0 hidden sm:flex items-center justify-end pr-8">
          <div className="h-40 w-40 rounded-full bg-primary-foreground/10 flex items-center justify-center">
            <ImageOff className="h-8 w-8 text-primary-foreground/40" />
          </div>
        </div>
        <div className="relative z-10 px-8 py-10 max-w-lg">
          <h2 className="font-heading text-2xl sm:text-3xl text-primary-foreground">
            ¿Lista para diseñar la pijama perfecta?
          </h2>
          <p className="text-primary-foreground/85 mt-2">
            Escríbenos por WhatsApp y hagamos realidad tu idea.
          </p>
          <Button asChild variant="secondary" className="mt-5">
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
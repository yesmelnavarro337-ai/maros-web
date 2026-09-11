import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { buildWhatsAppHref } from "@/features/settings/services/settings.service";
import { getPublicSettings } from "@/features/settings/services/settings.server";
import { getFeaturedProducts } from "@/features/home/services/home.service";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

export async function CtaBanner() {
  const [settings, featured] = await Promise.all([
    getPublicSettings(),
    getFeaturedProducts().catch(() => []),
  ]);
  const whatsappHref = buildWhatsAppHref(settings.whatsappNumber, "¡Hola! Quiero diseñar mi pijama perfecta.");
  const photo = featured[0]?.image ?? "";

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="bg-brand-gold text-brand-gold-foreground p-8 sm:p-10 md:p-12 flex flex-col justify-center gap-4">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-gold-foreground/70">
            Diseñamos tu idea
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl leading-tight text-brand-gold-foreground">
            ¿Lista para diseñar la pijama perfecta?
          </h2>
          <p className="text-brand-gold-foreground/85 text-base leading-relaxed max-w-md">
            Escríbenos por WhatsApp y hagamos realidad tu idea — respondemos con propuesta, precio y tiempos.
          </p>
          <Button
            asChild
            size="lg"
            className="self-start mt-2 rounded-full bg-brand-gold-foreground text-brand-gold hover:bg-white/90 px-7"
          >
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <FaWhatsapp className="h-4 w-4 mr-2" />
              Cotizar por WhatsApp
            </a>
          </Button>
        </div>

        <div className="relative min-h-[280px] md:min-h-full">
          {photo ? (
            <Image
              src={cloudinaryUrl(photo)}
              alt="Detalle de pijama personalizada"
              fill
              sizes="50vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-warm-beige to-brand-ivory" />
          )}
        </div>
      </div>
    </section>
  );
}
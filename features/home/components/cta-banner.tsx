import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { buildWhatsAppHref } from "@/features/settings/services/settings.service";
import { getPublicSettings } from "@/features/settings/services/settings.server";
import { getFeaturedProducts } from "@/features/home/services/home.service";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

const GIFT_PACKAGING_FALLBACK =
  "https://images.unsplash.com/photo-1513094735237-8f2714d57c13?q=80&w=900&auto=format&fit=crop";

export async function CtaBanner() {
  const [settings, featured] = await Promise.all([
    getPublicSettings(),
    getFeaturedProducts().catch(() => []),
  ]);

  const whatsappHref = buildWhatsAppHref(
    settings.whatsappNumber,
    "¡Hola! Me gustaría cotizar y diseñar mi pijama personalizada.",
  );

  const photo = featured.length > 0 && featured[0]?.image ? cloudinaryUrl(featured[0].image) : GIFT_PACKAGING_FALLBACK;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      <div className="rounded-3xl lg:rounded-[2.5rem] overflow-hidden bg-[#F7F3EB] border border-[#E6DFC9]/70 shadow-sm grid grid-cols-1 lg:grid-cols-12">
        
        {/* FOTOGRAFÍA LIFESTYLE / EMPAQUE DE REGALO (Izquierda - 5 cols) */}
        <div className="lg:col-span-5 relative min-h-[240px] sm:min-h-[300px] lg:min-h-[360px] w-full overflow-hidden bg-stone-200">
          <Image
            src={photo}
            alt="Pijama personalizada Maro's de regalo"
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent lg:hidden" />
        </div>

        {/* CONTENIDO EDITORIAL DE CONVERSIÓN (Derecha - 7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center items-start">
          <span className="text-[11px] font-semibold tracking-[0.25em] text-[#A38A3E] uppercase mb-2">
            ATENCIÓN PERSONALIZADA
          </span>

          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-[#34351F] font-normal leading-tight tracking-tight mb-3">
            ¿Lista para diseñar la <span className="italic">pijama perfecta?</span>
          </h2>

          <p className="font-sans text-xs sm:text-sm lg:text-base text-stone-600 leading-relaxed mb-6 sm:mb-8 max-w-md">
            Cuéntanos tu idea y hagámosla realidad. Escríbenos directamente por WhatsApp y te asesoramos con modelos, telas y tiempos de entrega.
          </p>

          <Button
            asChild
            size="lg"
            className="rounded-full px-8 py-3.5 bg-[#6B6832] hover:bg-[#34351F] text-white font-medium text-xs sm:text-sm transition-all duration-300 shadow-sm hover:shadow-md group w-full sm:w-fit justify-center"
          >
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <FaWhatsapp className="h-4 w-4 mr-2" />
              <span>Cotizar por WhatsApp</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>

      </div>
    </section>
  );
}
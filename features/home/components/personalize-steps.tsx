import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shirt, Layers, Palette, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { orFallback, type HomeSectionContent } from "../home-content.types";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=900&auto=format&fit=crop";
const DEFAULT_TITLE = "Personaliza tu pijama";
const DEFAULT_SUBTITLE = "Elige cada detalle y crea algo único.";
const DEFAULT_CTA = "Diseñar mi pijama";
const DEFAULT_CTA_LINK = "/personaliza";

const steps = [
  {
    number: "01",
    label: "1. Modelo",
    title: "Modelo",
    subtitle: "Elige el estilo y corte",
    icon: Shirt,
  },
  {
    number: "02",
    label: "2. Tela",
    title: "Tela",
    subtitle: "Selecciona el material",
    icon: Layers,
  },
  {
    number: "03",
    label: "3. Estampado",
    title: "Estampado",
    subtitle: "Elige el diseño",
    icon: Palette,
  },
  {
    number: "04",
    label: "4. Detalles",
    title: "Detalles",
    subtitle: "Añade tu toque",
    icon: Sparkles,
  },
];

interface PersonalizeStepsProps {
  content?: HomeSectionContent;
}

export function PersonalizeSteps({ content }: PersonalizeStepsProps) {
  const title = orFallback(content?.sectionTitle, DEFAULT_TITLE);
  const subtitle = orFallback(content?.sectionSubtitle, DEFAULT_SUBTITLE);
  const ctaText = orFallback(content?.ctaText, DEFAULT_CTA);
  const ctaLink = orFallback(content?.ctaLink, DEFAULT_CTA_LINK);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      <div className="relative rounded-3xl lg:rounded-[2.5rem] bg-[#F7F4EC] border border-[#E6DFC9]/70 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12">
        
        {/* COLUMNA IZQUIERDA: Fotografía Lifestyle de la experiencia de diseño */}
        <div className="lg:col-span-5 relative min-h-[260px] sm:min-h-[340px] lg:min-h-[420px] w-full overflow-hidden bg-stone-200">
          <Image
            src={orFallback(content?.cardImageUrl, DEFAULT_IMAGE)}
            alt={orFallback(content?.mainImageAlt, "Diseña tu pijama personalizada")}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent lg:hidden" />
        </div>

        {/* COLUMNA DERECHA: Título, 4 Pasos del Asistente y Botón de Acción */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-12 flex flex-col justify-center relative">
          
          {/* Ilustración botánica sutil en esquina superior derecha */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 pointer-events-none opacity-20 text-[#A38A3E]">
            <svg width="90" height="90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 90C50 60 70 30 90 20C70 40 50 60 50 90Z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M50 90C50 60 30 30 10 20C30 40 50 60 50 90Z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M50 10V90" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="50" cy="15" r="4" fill="currentColor" />
            </svg>
          </div>

          {/* Encabezado */}
          <div className="mb-6 sm:mb-8 relative z-10">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-[#34351F] font-medium tracking-tight mb-2">
              {title}
            </h2>
            <p className="font-sans text-xs sm:text-sm text-stone-600">
              {subtitle}
            </p>
          </div>

          {/* 4 Pasos Reales del Asistente */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 mb-8 relative z-10">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="flex flex-col items-start bg-white/70 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-brand-border/40 shadow-2xs hover:bg-white hover:border-[#6B6832]/40 transition-all group"
                >
                  <div className="h-9 w-9 rounded-xl bg-brand-warm-beige/60 flex items-center justify-center text-[#A38A3E] mb-3 group-hover:bg-[#6B6832] group-hover:text-white transition-colors">
                    <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <p className="text-xs font-semibold text-[#34351F] leading-tight">
                    {step.label}
                  </p>
                  <p className="text-[11px] text-stone-500 font-normal mt-1 leading-snug">
                    {step.subtitle}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Botón CTA al Personalizador Real */}
          <div className="relative z-10">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 py-3.5 bg-[#6B6832] hover:bg-[#34351F] text-white font-medium text-xs sm:text-sm transition-all duration-300 shadow-sm hover:shadow-md group w-full sm:w-fit justify-center"
            >
              <Link href={ctaLink}>
                <span>{ctaText}</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

        </div>

      </div>
    </section>
  );
}
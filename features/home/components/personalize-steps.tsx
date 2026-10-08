import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shirt, Layers, Palette, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
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
      <Reveal>
        <div className="relative rounded-3xl lg:rounded-[2.5rem] bg-[#F7F4EC] border border-[#E6DFC9]/70 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 group/container">
          
          {/* COLUMNA IZQUIERDA: Fotografía Lifestyle de la experiencia de diseño */}
          <div className="lg:col-span-5 relative min-h-[260px] sm:min-h-[340px] lg:min-h-[420px] w-full overflow-hidden bg-stone-200">
            <Image
              src={orFallback(content?.cardImageUrl, DEFAULT_IMAGE)}
              alt={orFallback(content?.mainImageAlt, "Diseña tu pijama personalizada")}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover/container:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent lg:hidden" />
          </div>

          {/* COLUMNA DERECHA: Título, 4 Pasos del Asistente y Botón de Acción */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-12 flex flex-col justify-center relative">
            
            {/* Ilustración botánica sutil en esquina superior derecha */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 pointer-events-none opacity-20 text-[#A38A3E] animate-float-soft">
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
              <p className="font-sans text-sm md:text-base text-stone-600 leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* 4 Pasos Reales del Asistente con micro-interacciones interactivas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 mb-8 relative z-10">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <Reveal key={step.number} delay={i * 70}>
                    <div
                      className="flex flex-col items-start bg-white/70 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-brand-border/40 shadow-2xs hover:bg-white hover:border-[#6B6832]/50 hover:shadow-md hover:-translate-y-1.5 active:-translate-y-1 active:scale-[0.98] active:shadow-md transform-gpu transition-all duration-300 group cursor-default select-none h-full"
                    >
                      <div className="h-10 w-10 rounded-xl bg-brand-warm-beige/60 flex items-center justify-center text-[#A38A3E] mb-3 group-hover:bg-[#6B6832] group-hover:text-white group-active:bg-[#6B6832] group-active:text-white transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 group-active:scale-110 group-active:-rotate-6 shadow-2xs">
                        <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                      </div>
                      <p className="text-sm sm:text-base font-semibold text-[#34351F] leading-tight group-hover:text-primary transition-colors">
                        {step.label}
                      </p>
                      <p className="text-xs sm:text-sm text-stone-600 font-normal mt-1.5 leading-relaxed">
                        {step.subtitle}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {/* Botón CTA al Personalizador Real */}
            <div className="relative z-10">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 py-3.5 bg-brand-gold hover:bg-brand-gold/90 text-brand-gold-foreground font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 group inline-flex items-center gap-2"
              >
                <Link href={ctaLink}>
                  <span>{ctaText}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5 group-active:translate-x-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
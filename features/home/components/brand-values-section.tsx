import Image from "next/image";
import {
  Tag,
  Scissors,
  Gem,
  ShieldCheck,
  PackageCheck,
  type LucideIcon,
} from "lucide-react";
import { orFallback, type HomeSectionContent } from "../home-content.types";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=900&auto=format&fit=crop";
const DEFAULT_EYEBROW = "NUESTRA PROMESA";
const DEFAULT_TITLE = "Hecho con intención.";
const DEFAULT_BODY =
  "Telas de alta calidad, diseños únicos y cada detalle pensado para acompañarte en tus momentos de descanso y unión familiar.";
const DEFAULT_TAGS: { label: string; icon?: string | null }[] = [
  { label: "Telas premium", icon: "tag" },
  { label: "Hecho a mano", icon: "scissors" },
  { label: "Diseños únicos", icon: "gem" },
  { label: "Calidad garantizada", icon: "shield-check" },
  { label: "Pago al recibir", icon: "package-check" },
];

/**
 * Claves lógicas que el admin puede guardar en `icon`. Se mapean aquí al set de
 * iconos de lucide para que el backend no dependa de la librería del frontend.
 */
const ICON_BY_KEY: Record<string, LucideIcon> = {
  tag: Tag,
  scissors: Scissors,
  gem: Gem,
  "shield-check": ShieldCheck,
  "package-check": PackageCheck,
};

const FALLBACK_ICON = Tag;

interface BrandValuesSectionProps {
  content?: HomeSectionContent;
}

export function BrandValuesSection({ content }: BrandValuesSectionProps) {
  const eyebrow = orFallback(content?.eyebrow, DEFAULT_EYEBROW);
  const title = orFallback(content?.sectionTitle, DEFAULT_TITLE);
  const body = orFallback(content?.bodyText, DEFAULT_BODY);

  // Se descartan las entradas sin etiqueta antes de renderizar: una etiqueta
  // vacía no aporta nada visual y, sobre todo, colapsaría varias filas a la misma
  // key. Si el filtro deja la lista vacía se cae a los defaults.
  const configuredTags = (content?.tags ?? []).filter((tag) =>
    Boolean(tag.label?.trim())
  );
  const tags =
    configuredTags.length > 0 ? configuredTags : DEFAULT_TAGS;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      <div className="rounded-3xl lg:rounded-[2.5rem] overflow-hidden bg-[#F6F2E9] shadow-sm grid grid-cols-1 lg:grid-cols-12">

        {/* FOTOGRAFÍA EDITORIAL (Izquierda - 5 cols) */}
        <div className="lg:col-span-5 relative min-h-[260px] sm:min-h-[320px] lg:min-h-[400px] w-full overflow-hidden bg-[#EDE7DA]">
          <Image
            src={orFallback(content?.mainImageUrl, DEFAULT_IMAGE)}
            alt={orFallback(
              content?.mainImageAlt,
              "Confección y telas de alta calidad Maro's Pijamas"
            )}
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent lg:hidden" />
        </div>

        {/* CONTENIDO EDITORIAL DE MARCA (Derecha - 7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 flex flex-col justify-center">
          <span className="text-[11px] font-semibold tracking-[0.25em] text-[#8B7D4E] uppercase mb-2 sm:mb-3">
            {eyebrow}
          </span>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] text-[#34351F] font-normal leading-[1.1] tracking-tight mb-3 sm:mb-4">
            {title}
          </h2>

          <p className="font-sans text-xs sm:text-sm lg:text-base text-[#5C5744] leading-relaxed mb-6 sm:mb-8 max-w-lg">
            {body}
          </p>

          {/* Pills de Valores de Marca */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {tags.map((tag, index) => {
              const Icon =
                (tag.icon && ICON_BY_KEY[tag.icon]) || FALLBACK_ICON;
              // El índice como sufijo desambigua etiquetas repetidas; combinar
              // solo con el texto seguiría duplicando keys.
              const tagKey = `brand-value-tag-${tag.label}-${index}`;
              return (
                <div
                  key={tagKey}
                  className="group inline-flex items-center gap-2 bg-white/70 border border-[#EBE6DC] text-[#3E3933] text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full shadow-2xs hover:bg-white hover:border-[#6B6832]/40 transition-all"
                >
                  <span className="h-6 w-6 sm:h-7 sm:w-7 shrink-0 rounded-full bg-brand-warm-beige/60 flex items-center justify-center text-[#A38A3E] group-hover:bg-[#6B6832] group-hover:text-white transition-colors">
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span>{tag.label}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
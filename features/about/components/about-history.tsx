import Image from "next/image";
import { Leaf, Users, Heart } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { getPageHeader } from "@/features/page-headers/services/page-headers.service";
import { getPublicSettings } from "@/features/settings/services/settings.server";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

const DEFAULT_STORY_IMAGE =
  "https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=1200&auto=format&fit=crop";

const DEFAULT_TITLE = "Un sueño hecho a mano";
const DEFAULT_SIGNATURE = "De un sueño familiar, a una gran comunidad.";

const KPIS = [
  { icon: Leaf, value: "6+", label: "Años" },
  { icon: Users, value: "1.000+", label: "Clientes felices" },
  { icon: Heart, value: "100%", label: "Hecho a mano" },
];

/** Rama botánica decorativa (marca de agua) para el fondo del bloque. */
function BotanicalWatermark() {
  return (
    <svg
      viewBox="0 0 200 220"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute -right-4 -top-8 z-0 w-48 sm:w-64 text-primary/15 select-none"
    >
      {/* Tallo principal */}
      <path
        d="M100 210 C 96 160, 104 90, 100 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Hojas izquierda */}
      <path
        d="M99 170 C 66 162, 48 134, 54 108 C 84 114, 98 142, 99 170 Z"
        fill="currentColor"
      />
      <path
        d="M99 116 C 72 106, 60 80, 68 58 C 92 66, 100 92, 99 116 Z"
        fill="currentColor"
      />
      {/* Hojas derecha */}
      <path
        d="M101 188 C 134 182, 154 156, 150 128 C 120 132, 104 158, 101 188 Z"
        fill="currentColor"
      />
      <path
        d="M101 138 C 128 130, 142 104, 136 80 C 110 86, 100 112, 101 138 Z"
        fill="currentColor"
      />
      {/* Hoja superior */}
      <path
        d="M100 62 C 88 40, 90 18, 100 6 C 110 18, 112 40, 100 62 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export async function AboutHistory() {
  // Imagen y textos configurables desde maros-admin:
  // Configuración > Encabezados > pestaña "Historia (Nosotros)".
  const [header, settings] = await Promise.all([
    getPageHeader("historia").catch(() => undefined),
    getPublicSettings().catch(() => null),
  ]);

  const storyImage = header?.backgroundImage?.trim()
    ? cloudinaryUrl(header.backgroundImage)
    : DEFAULT_STORY_IMAGE;
  const title = header?.title?.trim() || DEFAULT_TITLE;
  const signature = header?.subtitle?.trim() || DEFAULT_SIGNATURE;
  const logoUrl = settings?.logoUrl || "/logo.png";

  return (
    <section className="relative bg-background overflow-hidden">
      {/* Marca de agua botánica de fondo */}
      <BotanicalWatermark />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* COLUMNA VISUAL: imagen con marco orgánico, línea decorativa y flotación */}
          <Reveal className="lg:col-span-6">
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="group relative aspect-[4/5] max-h-[350px] lg:max-h-[520px] w-full animate-float-soft">
                {/* Trazo asimétrico: sólo sobresale por la esquina superior-izquierda */}
                <div
                  aria-hidden="true"
                  className="absolute -top-4 -left-4 z-0 h-full w-full rounded-[40%_60%_55%_45%/50%_55%_45%_50%] border-t-2 border-l-2 border-primary/30 pointer-events-none"
                />

                {/* Micro-interacción: escalado suave + sombra al hover (desktop)
                    o al tocar (móvil, vía :active), conservando la máscara orgánica */}
                <div className="absolute inset-0 overflow-hidden rounded-[40%_60%_55%_45%/50%_55%_45%_50%] bg-secondary transform-gpu will-change-transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl group-active:scale-[1.02] group-active:shadow-xl">
                  <Image
                    src={storyImage}
                    alt="Manos en proceso de confección artesanal de Maro's Pijamas"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                </div>

                {/* Logotipo institucional directo, fondo 100% transparente */}
                <Image
                  src={cloudinaryUrl(logoUrl)}
                  alt={settings?.siteName ?? "Maro's Pijamas"}
                  width={96}
                  height={96}
                  className="absolute -bottom-3 -left-2 sm:-bottom-4 sm:-left-4 w-20 lg:w-24 object-contain bg-transparent shadow-none border-none"
                />
              </div>
            </div>
          </Reveal>

          {/* COLUMNA NARRATIVA: kicker, título, párrafos, firma y KPIs */}
          <Reveal className="lg:col-span-6 space-y-6" delay={120}>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Nuestra historia
              </p>
              <h2 className="font-heading text-3xl lg:text-5xl font-medium text-primary leading-tight">
                {title}
              </h2>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Maro&apos;s Pijamas nació hace más de 6 años con una idea muy clara:
              crear prendas únicas, cómodas y hechas con amor para los momentos más
              especiales de tu vida.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Lo que empezó como un pequeño proyecto familiar en Colombia, hoy es una
              marca que ha vestido a más de 1.000 clientes felices.
            </p>

            <p className="font-serif italic font-normal text-xl sm:text-2xl text-primary">
              {signature}
            </p>

            <div className="border-t border-border/60" />

            {/* Fila de métricas: distribución compacta con divisores verticales */}
            <div className="grid grid-cols-3">
              {KPIS.map((kpi, i) => {
                const Icon = kpi.icon;
                return (
                  <Reveal
                    key={kpi.label}
                    delay={220 + i * 90}
                    className="group flex flex-col items-center gap-1 text-center px-4 border-r border-border/50 last:border-r-0"
                  >
                    <span className="inline-flex items-center justify-center text-primary transition-transform duration-300 group-hover:scale-110 group-active:scale-110">
                      <Icon className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <p className="font-heading text-2xl lg:text-3xl font-bold text-primary leading-none">
                      {kpi.value}
                    </p>
                    <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-muted-foreground uppercase leading-tight">
                      {kpi.label}
                    </p>
                  </Reveal>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

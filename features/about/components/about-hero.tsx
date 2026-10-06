import Image from "next/image";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPageHeader } from "@/features/page-headers/services/page-headers.service";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

const DEFAULT_TITLE_LINES = { before: "Más de 6 años creando pijamas ", highlight: "únicas" };
const DEFAULT_SUBTITLE =
  "Maro's Pijamas nació con un sueño simple: crear prendas únicas, cómodas y hechas con amor para los momentos más especiales de tu vida.";

export async function AboutHero() {
  // Encabezado configurable desde maros-admin (Encabezados de página > Nosotros).
  // Si no hay contenido guardado, se mantiene el diseño editorial por defecto.
  const header = await getPageHeader("about").catch(() => undefined);

  const hasBackgroundImage = Boolean(header?.backgroundImage?.trim());
  const title = header?.title?.trim() || null;
  const subtitle = header?.subtitle?.trim() || DEFAULT_SUBTITLE;
  const primaryCta =
    header?.primaryButtonText?.trim() && header?.primaryButtonLink?.trim()
      ? { label: header.primaryButtonText.trim(), href: header.primaryButtonLink.trim() }
      : { label: "Ver catálogo", href: "/catalogo" };
  const secondaryCta =
    header?.secondaryButtonText?.trim() && header?.secondaryButtonLink?.trim()
      ? { label: header.secondaryButtonText.trim(), href: header.secondaryButtonLink.trim() }
      : { label: "Contáctanos", href: "/contacto" };

  return (
    <section className="relative overflow-hidden">
      {/* Imagen de fondo configurable desde el admin, con overlay regulable */}
      {hasBackgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={cloudinaryUrl(header!.backgroundImage!)}
            alt={title ?? "Nuestra historia"}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: (header!.overlayOpacity ?? 40) / 100 }}
          />
        </div>
      )}

      {!hasBackgroundImage && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.45]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 85% 20%, color-mix(in oklch, var(--accent) 14%, transparent), transparent 45%), radial-gradient(circle at 10% 90%, color-mix(in oklch, var(--primary) 10%, transparent), transparent 40%)",
          }}
        />
      )}

      <div
        className="relative max-w-7xl mx-auto px-4 pt-14 pb-12 sm:pt-20 sm:pb-16"
        style={hasBackgroundImage ? { color: header!.textColor } : undefined}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p
            className={`text-xs font-medium uppercase tracking-[0.25em] mb-4 ${hasBackgroundImage ? "opacity-80" : "text-primary"
              }`}
          >
            Nuestra historia
          </p>

          {title ? (
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              {title}
            </h1>
          ) : (
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.05] tracking-tight">
              {DEFAULT_TITLE_LINES.before}
              <span className="inline-flex items-center gap-1">
                {DEFAULT_TITLE_LINES.highlight}
                <Heart className="h-7 w-7 sm:h-9 sm:w-9 text-primary fill-primary/20" />
              </span>
            </h1>
          )}

          <p
            className={`mt-5 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto ${hasBackgroundImage ? "opacity-90" : "text-muted-foreground"
              }`}
          >
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
            <Button size="lg" className="rounded-full px-7" asChild>
              <Link href={primaryCta.href}>
                {primaryCta.label}
                <ArrowRight className="ml-1" />
              </Link>
            </Button>
            {/* Sobre la imagen del hero el botón secundario va transparente con
                borde claro; sin imagen conserva el outline editorial. */}
            <Button
              size="lg"
              variant={hasBackgroundImage ? "ghost" : "outline"}
              className={
                hasBackgroundImage
                  ? "rounded-full px-7 bg-transparent border border-white/80 text-white hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm"
                  : "rounded-full px-7"
              }
              asChild
            >
              <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

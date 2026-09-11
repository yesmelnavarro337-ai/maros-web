import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 85% 20%, color-mix(in oklch, var(--accent) 14%, transparent), transparent 45%), radial-gradient(circle at 10% 90%, color-mix(in oklch, var(--primary) 10%, transparent), transparent 40%)",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 pt-14 pb-12 sm:pt-20 sm:pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary mb-4">
            Nuestra historia
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.05] tracking-tight">
            Más de 4 años creando pijamas{" "}
            <span className="inline-flex items-center gap-1">
              únicas
              <Heart className="h-7 w-7 sm:h-9 sm:w-9 text-primary fill-primary/20" />
            </span>
          </h1>
          <p className="text-muted-foreground mt-5 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Maro&apos;s Pijamas nació con un sueño simple: crear prendas únicas, cómodas y hechas
            con amor para los momentos más especiales de tu vida.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
            <Button size="lg" className="rounded-full px-7" asChild>
              <Link href="/catalogo">
                Ver catálogo
                <ArrowRight className="ml-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-7" asChild>
              <Link href="/contacto">Contáctanos</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

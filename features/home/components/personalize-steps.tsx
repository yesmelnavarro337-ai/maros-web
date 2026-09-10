import Link from "next/link";
import { Shirt, Palette, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  { icon: Shirt, title: "Elige el modelo", subtitle: "Tu estilo favorito" },
  { icon: Palette, title: "Selecciona la tela", subtitle: "Color y estampado" },
  { icon: Sparkles, title: "Agrega detalles", subtitle: "Iniciales, bordados, etc." },
  { icon: Heart, title: "Cuéntanos tu idea", subtitle: "Y la hacemos realidad" },
];

export function PersonalizeSteps() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="font-heading text-2xl sm:text-3xl text-foreground text-center mb-8">
        Personaliza tu pijama en <span className="text-primary">4 simples pasos</span>
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_1fr_320px] gap-6 items-stretch">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} className="flex flex-col items-center text-center gap-2 relative">
              <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">
                {i + 1}. {step.title}
              </p>
              <p className="text-xs text-muted-foreground">{step.subtitle}</p>
            </div>
          );
        })}

        <div className="rounded-xl border border-border bg-card p-5 flex flex-col justify-center gap-2">
          <p className="text-sm font-medium text-foreground">¿Tienes una idea especial?</p>
          <p className="text-xs text-muted-foreground">
            Envíanos tu diseño o inspiración y la hacemos posible.
          </p>
          <Button asChild className="mt-2">
            <Link href="/personaliza">Personalizar ahora</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
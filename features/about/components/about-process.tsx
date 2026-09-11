import { Shirt, Palette, Scissors, Sparkles, PackageCheck } from "lucide-react";

const steps = [
  {
    icon: Shirt,
    step: 1,
    title: "Diseño",
    description: "Elegimos el modelo base y planificamos cada detalle del diseño.",
  },
  {
    icon: Palette,
    step: 2,
    title: "Selección de tela",
    description: "Seleccionamos telas de primera calidad en los colores que tú prefieras.",
  },
  {
    icon: Scissors,
    step: 3,
    title: "Confección a mano",
    description: "Nuestros artesanos cortan y confeccionan cada pieza con dedicación y precisión.",
  },
  {
    icon: Sparkles,
    step: 4,
    title: "Personalización",
    description: "Agregamos bordados, iniciales, estampados y cualquier detalle especial.",
  },
  {
    icon: PackageCheck,
    step: 5,
    title: "Control de calidad",
    description: "Revisamos cada prenda minuciosamente antes de empacarla con amor para ti.",
  },
];

export function AboutProcess() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-14 sm:py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary mb-3">
          Cómo trabajamos
        </p>
        <h2 className="font-heading text-3xl sm:text-4xl text-foreground">
          De la idea a tu puerta
        </h2>
        <p className="text-muted-foreground mt-3">
          Cada pijama pasa por un proceso cuidadoso para garantizar que supere tus
          expectativas.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.step} className="flex flex-col items-center text-center gap-3">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                  {s.step}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{s.title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {s.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

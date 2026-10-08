import { Heart, ShieldCheck, Lightbulb, Leaf } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";

const values = [
  {
    icon: Heart,
    title: "Hecho con amor",
    description:
      "Cada pijama es confeccionada a mano con dedicación y cariño, porque creemos que lo que se hace con amor se nota.",
  },
  {
    icon: ShieldCheck,
    title: "Calidad garantizada",
    description:
      "Seleccionamos las mejores telas y materiales para que cada prenda sea tan duradera como cómoda.",
  },
  {
    icon: Lightbulb,
    title: "Diseños únicos",
    description:
      "No seguimos tendencias: las creamos. Cada diseño es original y pensado para que te sientas especial.",
  },
  {
    icon: Leaf,
    title: "Compromiso local",
    description:
      "Todo se produce en Colombia, apoyando artesanos locales y fortaleciendo nuestra economía.",
  },
];

export function AboutValues() {
  return (
    <section className="bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 py-14 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary mb-3">
            Nuestros valores
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl text-foreground">
            Lo que nos mueve cada día
          </h2>
          <p className="text-muted-foreground mt-3">
            Valores que guían cada decisión, desde la selección de la tela hasta la entrega
            final.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <Reveal
                key={v.title}
                delay={i * 90}
                className="group rounded-xl border border-border bg-card p-6 text-center transform-gpu transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-primary/40 active:-translate-y-2 active:shadow-lg active:border-primary/40"
              >
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-primary group-active:bg-primary">
                  <Icon className="h-5 w-5 text-primary transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:text-primary-foreground group-active:scale-110 group-active:rotate-6 group-active:text-primary-foreground" />
                </div>
                <h3 className="font-heading text-base md:text-lg text-foreground">{v.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground mt-2 leading-relaxed">
                  {v.description}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

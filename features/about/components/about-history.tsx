import { Heart, Award, Users, Sparkles } from "lucide-react";
import { BenefitsStrip } from "@/features/home/components/benefits-strip";

const stats = [
  { icon: Award, title: "+4 Años", subtitle: "de experiencia" },
  { icon: Users, title: "+5.000", subtitle: "Clientes felices" },
  { icon: Sparkles, title: "Diseños únicos", subtitle: "Hecho en Colombia" },
  { icon: Heart, title: "100% Personalizado", subtitle: "Atención directa" },
];

export function AboutHistory() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-14 sm:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-heading text-3xl sm:text-4xl text-foreground leading-tight">
            Un sueño hecho a mano
          </h2>
          <p className="text-muted-foreground mt-5 leading-relaxed">
            Maro&apos;s Pijamas comenzó hace más de 4 años con una idea muy clara: que cada
            persona pudiera tener una pijama que la hiciera sentir única, cómoda y amada.
          </p>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Lo que empezó como un proyecto familiar en Colombia, hoy es una marca que ha
            vestido a más de 5.000 clientes felices. Cada pieza sigue siendo confeccionada a
            mano, con la misma dedicación y cariño del primer día.
          </p>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Creemos que los detalles importan: desde la selección de la tela hasta el último
            bordado, cada elemento cuenta una historia de amor por lo que hacemos.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-secondary p-6 flex flex-col items-center justify-center text-center">
            <Award className="h-8 w-8 text-primary mb-2" />
            <p className="font-heading text-2xl text-foreground">+4</p>
            <p className="text-xs text-muted-foreground">Años de experiencia</p>
          </div>
          <div className="rounded-xl bg-secondary p-6 flex flex-col items-center justify-center text-center">
            <Users className="h-8 w-8 text-primary mb-2" />
            <p className="font-heading text-2xl text-foreground">+5.000</p>
            <p className="text-xs text-muted-foreground">Clientes felices</p>
          </div>
          <div className="rounded-xl bg-secondary p-6 flex flex-col items-center justify-center text-center">
            <Sparkles className="h-8 w-8 text-primary mb-2" />
            <p className="font-heading text-2xl text-foreground">100%</p>
            <p className="text-xs text-muted-foreground">Hecho a mano</p>
          </div>
          <div className="rounded-xl bg-primary p-6 flex flex-col items-center justify-center text-center text-primary-foreground">
            <Heart className="h-8 w-8 mb-2 fill-current" />
            <p className="font-heading text-2xl">Hecho con amor</p>
            <p className="text-xs opacity-80">Cada prenda cuenta</p>
          </div>
        </div>
      </div>

      <div className="mt-14 pt-10 border-t border-border">
        <BenefitsStrip items={stats} />
      </div>
    </section>
  );
}

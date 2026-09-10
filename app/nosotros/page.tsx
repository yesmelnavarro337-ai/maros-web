import { ImageOff, Award, Users, Sparkles, Home as HomeIcon, Heart } from "lucide-react";
import { BenefitsStrip } from "@/features/home/components/benefits-strip";

export const metadata = {
  title: "Nosotros",
  description: "Conoce la historia de Maro's Pijamas — más de 4 años creando pijamas únicas, hechas a mano.",
};

const stats = [
  { icon: Award, title: "+4 Años", subtitle: "de experiencia" },
  { icon: Users, title: "+5.000", subtitle: "Clientes felices" },
  { icon: Sparkles, title: "Diseños únicos", subtitle: "Hecho en Colombia" },
  { icon: HomeIcon, title: "100% Personalizado", subtitle: "Atención Personalizada" },
];

export default function NosotrosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-xs text-muted-foreground mb-6">
        Inicio / <span className="text-foreground">Nosotros</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl text-foreground">
            Nuestra historia <Heart className="inline h-7 w-7 text-primary fill-primary/20" />
          </h1>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Maro&apos;s Pijamas nació hace más de 4 años con un sueño: crear pijamas únicas,
            cómodas y hechas con amor.
          </p>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Cada pieza está hecha a mano, pensando en ti y en los momentos especiales que
            mereces.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="aspect-square rounded-xl bg-secondary flex items-center justify-center row-span-2">
            <ImageOff className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="aspect-square rounded-xl bg-secondary flex items-center justify-center">
            <ImageOff className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="rounded-xl bg-primary flex flex-col items-center justify-center text-center p-4 text-primary-foreground">
            <Heart className="h-5 w-5 mb-1 fill-current" />
            <p className="text-sm font-medium">Hecho con amor</p>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-border">
        <BenefitsStrip items={stats} />
      </div>
    </div>
  );
}
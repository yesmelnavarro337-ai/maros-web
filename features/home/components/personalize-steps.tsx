import { Fragment } from "react";
import Link from "next/link";
import { Shirt, Palette, Heart } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

function InitialsGlyph() {
  return <span className="text-[#A38A3E] font-heading text-3xl md:text-4xl font-semibold leading-none">A</span>;
}

const steps = [
  { icon: Shirt, title: "1. Elige el modelo", subtitle: "Tu estilo favorito" },
  { icon: Palette, title: "2. Selecciona la tela", subtitle: "Color y estampado" },
  { icon: InitialsGlyph, title: "3. Agrega detalles", subtitle: "Iniciales, bordados, etc." },
  { icon: Heart, title: "4. Cuéntanos tu idea", subtitle: "Y la hacemos realidad" },
];

export function PersonalizeSteps() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="font-serif text-2xl md:text-3xl text-center text-stone-900">
        Personaliza tu pijama en{" "}
        <span className="text-[#A38A3E]">4 simples pasos</span>
      </h2>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mt-8">
        <div className="flex-1 w-full grid grid-cols-2 lg:flex lg:items-center lg:justify-between gap-2 lg:gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <Fragment key={i}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#FDFBF7] flex items-center justify-center mx-auto mb-3">
                    <Icon className="text-[#A38A3E] h-9 w-9 md:h-10 md:w-10" strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-bold text-stone-900 text-center">{step.title}</p>
                  <p className="text-xs text-stone-500 text-center">{step.subtitle}</p>
                </div>

                {i < steps.length - 1 && (
                  <div
                    aria-hidden
                    className="hidden lg:block w-8 lg:w-12 shrink-0 border-t-2 border-dotted border-stone-300 self-start mt-10"
                  />
                )}
              </Fragment>
            );
          })}
        </div>

        <div className="w-full lg:w-[320px] flex-shrink-0 max-w-sm bg-[#F9F7F1] rounded-3xl p-6 md:p-8 text-center flex flex-col items-center justify-center">
          <p className="font-serif text-xl font-medium text-stone-900 mb-2">¿Tienes una idea especial?</p>
          <p className="text-xs text-stone-600 mb-6 max-w-[220px] mx-auto">
            Envíanos tu diseño o inspiración y la hacemos posible ✨
          </p>
          <Button
            asChild
            className="w-full rounded-full bg-[#A38A3E] hover:bg-[#8C7432] text-white py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Link href="/personaliza">
              Personalizar ahora
              <FaWhatsapp className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
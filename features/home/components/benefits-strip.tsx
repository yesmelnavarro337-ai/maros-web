import { Reveal } from "@/components/shared/reveal";
import type { LucideIcon } from "lucide-react";

export interface BenefitItem {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}

export function BenefitsStrip({
  items,
  compact = false,
}: {
  items: BenefitItem[];
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="bg-secondary/60 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-brand-border/40">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-6 sm:gap-y-8">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={i} delay={i * 70}>
                <div className="group flex flex-col items-center text-center gap-2 transform-gpu transition-all duration-300 hover:-translate-y-1 active:scale-95 cursor-default select-none">
                  <div className="h-11 w-11 rounded-full bg-card/80 flex items-center justify-center shadow-2xs border border-brand-border/40 mb-1 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-primary/10 group-active:scale-110 group-active:rotate-6 group-active:bg-primary/10">
                    <Icon className="h-5 w-5 text-brand-gold transition-transform duration-300 group-hover:scale-110 group-active:scale-110" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">{item.title}</p>
                  {item.subtitle && (
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">{item.subtitle}</p>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-2">
      {/* Móvil: grid 2x2 centrado y acotado. Desktop: una fila de 4 centrada.
          Cada ítem alinea estrictamente el círculo del icono con sus textos. */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:max-w-none lg:grid-cols-4 lg:gap-x-12">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <Reveal key={i} delay={i * 70}>
              <div
                className="flex items-center justify-center gap-3 group transform-gpu transition-all duration-300 hover:-translate-y-1 active:scale-95 cursor-default select-none py-1"
              >
                <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-card flex items-center justify-center shrink-0 border border-brand-warm-beige shadow-2xs transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-primary/10 group-active:scale-110 group-active:rotate-6 group-active:bg-primary/10">
                  <Icon className="h-5 w-5 text-brand-gold transition-transform duration-300 group-hover:scale-110 group-active:scale-110" strokeWidth={1.4} aria-hidden="true" />
                </div>
                <div className="flex flex-col leading-tight text-left">
                  <p className="text-sm sm:text-base font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </p>
                  {item.subtitle && (
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-normal mt-0.5 leading-relaxed">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
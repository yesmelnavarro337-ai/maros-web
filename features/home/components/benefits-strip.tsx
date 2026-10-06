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
              <div key={i} className="flex flex-col items-center text-center gap-2">
                <div className="h-11 w-11 rounded-full bg-card/80 flex items-center justify-center shadow-2xs border border-brand-border/40 mb-1">
                  <Icon className="h-5 w-5 text-brand-gold" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-foreground leading-snug">{item.title}</p>
                {item.subtitle && (
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug">{item.subtitle}</p>
                )}
              </div>
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
            <div
              key={i}
              className="flex items-center justify-center gap-3 group"
            >
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-card flex items-center justify-center shrink-0 border border-brand-warm-beige shadow-2xs transition-transform duration-300 group-hover:scale-105 group-active:scale-105">
                <Icon className="h-5 w-5 text-brand-gold" strokeWidth={1.4} aria-hidden="true" />
              </div>
              <div className="flex flex-col leading-tight text-left">
                <p className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                  {item.title}
                </p>
                {item.subtitle && (
                  <p className="text-[11px] sm:text-xs text-muted-foreground font-normal mt-0.5">
                    {item.subtitle}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
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
      <div className="bg-[#F6F2E9]/70 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-brand-border/40">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-6 sm:gap-y-8">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex flex-col items-center text-center gap-2">
                <div className="h-11 w-11 rounded-full bg-white/80 flex items-center justify-center shadow-2xs border border-brand-border/40 mb-1">
                  <Icon className="h-5 w-5 text-[#A38A3E]" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-[#34351F] leading-snug">{item.title}</p>
                {item.subtitle && (
                  <p className="text-[11px] sm:text-xs text-stone-500 leading-snug">{item.subtitle}</p>
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
      {/* Layout Desktop: 1 sola fila con 4 beneficios / Layout Mobile: Grid 2x2 limpio */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4 sm:gap-x-8 lg:gap-x-10">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="flex items-center justify-start gap-3 sm:gap-3.5 group"
            >
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white flex items-center justify-center shrink-0 border border-[#EFE8D8] shadow-2xs transition-transform duration-300 group-hover:scale-105">
                <Icon className="h-5 w-5 text-[#A38A3E]" strokeWidth={1.4} aria-hidden="true" />
              </div>
              <div className="flex flex-col leading-tight">
                <p className="text-xs sm:text-sm font-semibold text-[#34351F] tracking-tight">
                  {item.title}
                </p>
                {item.subtitle && (
                  <p className="text-[11px] sm:text-xs text-stone-500 font-normal mt-0.5">
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
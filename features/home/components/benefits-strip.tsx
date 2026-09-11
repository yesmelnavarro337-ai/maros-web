import type { LucideIcon } from "lucide-react";

export interface BenefitItem {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}

export function BenefitsStrip({ items, compact = false }: { items: BenefitItem[]; compact?: boolean }) {
  if (compact) {
    return (
      <div className="bg-[#F4EFE6] rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-8">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex flex-col items-center text-center gap-2.5">
                <Icon className="h-10 w-10 text-[#A38A3E]" strokeWidth={1.5} />
                <p className="text-sm font-semibold text-foreground leading-snug">{item.title}</p>
                {item.subtitle && (
                  <p className="text-xs text-muted-foreground leading-snug">{item.subtitle}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={i}
            className="bg-[#F4EFE6] rounded-2xl p-4 flex items-center gap-3 border border-black/5 shadow-sm"
          >
            <Icon className="h-9 w-9 text-[#A38A3E] shrink-0" strokeWidth={1.5} />
            <p className="text-sm font-semibold text-foreground leading-snug">{item.title}</p>
          </div>
        );
      })}
    </div>
  );
}
import type { LucideIcon } from "lucide-react";

export interface BenefitItem {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}

export function BenefitsStrip({ items, compact = false }: { items: BenefitItem[]; compact?: boolean }) {
  return (
    <div className={`grid grid-cols-2 ${items.length > 4 ? "sm:grid-cols-5" : "sm:grid-cols-4"} gap-4`}>
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <div key={i} className="flex items-center gap-3">
            <div className="rounded-full bg-secondary p-2.5 shrink-0">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className={compact ? "text-xs font-medium text-foreground" : "text-sm font-medium text-foreground"}>
                {item.title}
              </p>
              {item.subtitle && <p className="text-xs text-muted-foreground">{item.subtitle}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
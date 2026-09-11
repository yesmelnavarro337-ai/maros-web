import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface LegalCalloutProps {
  title?: string;
  children: ReactNode;
  icon?: LucideIcon;
}

export function LegalCallout({ title, children, icon: Icon }: LegalCalloutProps) {
  return (
    <div className="flex gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4">
      {Icon && (
        <div className="rounded-full bg-primary/10 p-2 shrink-0">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      )}
      <div>
        {title && <p className="text-sm font-medium text-foreground mb-1">{title}</p>}
        <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
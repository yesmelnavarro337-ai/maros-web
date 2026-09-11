import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface LegalCardProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}

export function LegalCard({ icon: Icon, title, children }: LegalCardProps) {
  return (
    <div className="flex gap-3 rounded-2xl border border-border bg-card px-5 py-5">
      <Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <div className="text-sm text-muted-foreground leading-relaxed mt-1">{children}</div>
      </div>
    </div>
  );
}
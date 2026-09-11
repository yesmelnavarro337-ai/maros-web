import { cn } from "@/lib/utils";

export interface LegalTocItem {
  id: string;
  label: string;
}

export function LegalToc({ items, className }: { items: LegalTocItem[]; className?: string }) {
  return (
    <nav
      aria-label="Contenido de esta página"
      className={cn("rounded-2xl border border-border bg-card p-5", className)}
    >
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary mb-4">
        En esta página
      </p>
      <ul className="flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
import type { ReactNode } from "react";
import { LegalToc, type LegalTocItem } from "./legal-toc";

interface LegalShellProps {
  kicker: string;
  title: string;
  description?: string;
  toc: LegalTocItem[];
  children: ReactNode;
}

export function LegalShell({ kicker, title, description, toc, children }: LegalShellProps) {
  return (
    <div className="bg-[#F9F6F0] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-14 sm:py-20">
        <nav className="text-xs text-muted-foreground mb-6">
          Inicio / <span className="text-foreground">{title}</span>
        </nav>

        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary mb-3">
            {kicker}
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl text-foreground">{title}</h1>
          {description && <p className="text-muted-foreground mt-3 mb-10">{description}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <LegalToc items={toc} />
            </div>
          </aside>
          <div className="min-w-0 max-w-3xl">
            <LegalToc items={toc} className="mb-10 lg:hidden" />
            <div className="flex flex-col gap-10">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
import Link from "next/link";
import { ImageOff } from "lucide-react";
import type { CategoryQuickLink } from "../types";

export function CategoryQuickLinks({ categories }: { categories: CategoryQuickLink[] }) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
      {categories.map((c) => (
        <Link key={c.id} href={c.href} className="flex flex-col items-center gap-2 group">
          <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center overflow-hidden group-hover:ring-2 ring-primary transition-all">
            {c.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.image} alt={c.label} className="w-full h-full object-cover" />
            ) : (
              <ImageOff className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <span className="text-xs text-foreground text-center">{c.label}</span>
        </Link>
      ))}
    </div>
  );
}
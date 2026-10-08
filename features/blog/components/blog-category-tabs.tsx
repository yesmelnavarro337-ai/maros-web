import Link from "next/link";
import { cn } from "@/lib/utils";

interface BlogCategoryTabsProps {
  categories: string[];
  active?: string;
}

export function BlogCategoryTabs({ categories, active }: BlogCategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/blog"
        className={cn(
          "rounded-full px-4 py-1.5 text-sm font-medium transform-gpu transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xs",
          !active
            ? "bg-primary text-primary-foreground shadow-xs"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/70 hover:shadow-xs"
        )}
      >
        Todos
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat}
          href={`/blog?categoria=${encodeURIComponent(cat)}`}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transform-gpu transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xs",
            active === cat
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/70 hover:shadow-xs"
          )}
        >
          {cat}
        </Link>
      ))}
    </div>
  );
}
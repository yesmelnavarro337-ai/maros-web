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
          "rounded-full px-3.5 py-1.5 text-sm transition-colors",
          !active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
        )}
      >
        Todos
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat}
          href={`/blog?categoria=${encodeURIComponent(cat)}`}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-sm transition-colors",
            active === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
          )}
        >
          {cat}
        </Link>
      ))}
    </div>
  );
}
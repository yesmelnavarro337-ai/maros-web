import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { UserRound, User, Heart, Users, Baby, Shirt, Briefcase, Tag } from "lucide-react";
import type { CategoryQuickLink } from "../types";

const CATEGORY_RULES: { keywords: string[]; icon: LucideIcon }[] = [
  { keywords: ["mujer", "femenino", "dama"], icon: UserRound },
  { keywords: ["hombre", "masculino", "caballero"], icon: User },
  { keywords: ["pareja", "couple"], icon: Heart },
  { keywords: ["familia"], icon: Users },
  { keywords: ["niñ", "niña", "infantil", "kids"], icon: Baby },
  { keywords: ["bata", "robe"], icon: Shirt },
  { keywords: ["empre", "corporativ", "empresarial"], icon: Briefcase },
];

const FALLBACK_ICON: LucideIcon = Tag;

function resolveIcon(label: string): LucideIcon {
  const normalized = label.toLowerCase();
  const rule = CATEGORY_RULES.find((r) => r.keywords.some((k) => normalized.includes(k)));
  return rule?.icon ?? FALLBACK_ICON;
}

export function CategoryQuickLinks({ categories }: { categories: CategoryQuickLink[] }) {
  // Máximo 7 categorías visibles en el home para no saturar la cuadrícula.
  const visible = categories.slice(0, 7);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
      {visible.map((c) => {
        const Icon = resolveIcon(c.label);
        return (
          <Link
            key={c.id}
            href={c.href}
            className="group flex flex-col items-center gap-2.5 rounded-2xl bg-[#FDFBF7] border border-[#A38A3E]/40 p-5 text-center transition-all hover:border-[#A38A3E] hover:shadow-sm"
          >
            <Icon className="h-10 w-10 sm:h-12 sm:w-12 text-[#A38A3E] transition-transform group-hover:scale-110" strokeWidth={1.5} />
            <span className="text-xs sm:text-sm font-semibold text-stone-900 leading-tight">
              {c.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
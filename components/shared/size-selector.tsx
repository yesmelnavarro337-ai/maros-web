import { cn } from "@/lib/utils";
import { sortSizes } from "@/lib/sizes";

interface SizeSelectorProps {
  sizes: string[];
  selected: string;
  onChange: (size: string) => void;
  disabledSizes?: string[];
}

export function SizeSelector({ sizes, selected, onChange, disabledSizes = [] }: SizeSelectorProps) {
  // Se comparan normalizadas para que "0-3m" y "0-3M" no dejen una talla
  // habilitada o deshabilitada por error.
  const disabledKeys = new Set(disabledSizes.map((s) => s.trim().toUpperCase()));

  return (
    <div className="flex flex-wrap gap-2">
      {/* Orden canónico: el componente garantiza el orden aunque el padre
          le pase las tallas sin ordenar. */}
      {sortSizes(sizes).map((size) => {
        const isDisabled = disabledKeys.has(size.trim().toUpperCase());
        const isSelected = selected === size;
        return (
          <button
            key={size}
            type="button"
            onClick={() => !isDisabled && onChange(size)}
            disabled={isDisabled}
            className={cn(
              "h-9 min-w-9 px-3.5 rounded-lg border text-xs font-semibold transition-all shadow-2xs",
              isSelected && !isDisabled
                ? "bg-[#34351F] text-white border-[#34351F] shadow-xs"
                : "bg-white border-neutral-200 text-neutral-800 hover:border-[#34351F]/50",
              isDisabled && "bg-neutral-100/60 border-neutral-200 text-stone-400 opacity-40 pointer-events-none line-through"
            )}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
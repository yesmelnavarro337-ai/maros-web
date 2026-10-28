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
    <div
      className="flex flex-wrap gap-2"
      role="radiogroup"
      aria-label="Seleccionar talla"
    >
      {/* Orden canónico: el componente garantiza el orden aunque el padre
          le pase las tallas sin ordenar. */}
      {sortSizes(sizes).map((size) => {
        const isDisabled = disabledKeys.has(size.trim().toUpperCase());
        const isSelected = selected === size;
        return (
          <button
            key={size}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={isDisabled}
            onClick={() => !isDisabled && onChange(size)}
            className={cn(
              "h-9 min-w-9 px-3.5 rounded-lg border text-xs font-semibold transition-all duration-150 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              isSelected && !isDisabled
                ? "bg-primary text-primary-foreground border-primary shadow-xs font-bold scale-[1.02]"
                : "bg-card border-border text-foreground hover:border-primary/60 hover:bg-secondary/40 cursor-pointer active:scale-95",
              isDisabled && "bg-muted/40 border-border/50 text-muted-foreground/40 opacity-40 pointer-events-none line-through"
            )}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
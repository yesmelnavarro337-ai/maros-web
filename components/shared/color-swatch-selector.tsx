import { cn } from "@/lib/utils";
import type { ProductColorOption } from "@/features/product-detail/types";

interface ColorSwatchSelectorProps {
  colors: ProductColorOption[];
  selected: string;
  onChange: (hex: string) => void;
  disabledHexes?: string[];
}

export function ColorSwatchSelector({ colors, selected, onChange, disabledHexes = [] }: ColorSwatchSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((c) => {
        const isDisabled = disabledHexes.includes(c.hex);
        return (
          <button
            key={c.hex}
            onClick={() => !isDisabled && onChange(c.hex)}
            disabled={isDisabled}
            className={cn(
              "h-8 w-8 rounded-full border-2 transition-all relative",
              selected === c.hex && !isDisabled ? "border-primary scale-110" : "border-border",
              isDisabled && "opacity-30 cursor-not-allowed"
            )}
            style={{ backgroundColor: c.hex }}
            title={isDisabled ? `${c.name} — sin stock en esta talla` : c.name}
            aria-label={c.name}
          >
            {isDisabled && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="h-[1.5px] w-6 bg-foreground/50 rotate-45" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  sizes: string[];
  selected: string;
  onChange: (size: string) => void;
  disabledSizes?: string[];
}

export function SizeSelector({ sizes, selected, onChange, disabledSizes = [] }: SizeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => {
        const isDisabled = disabledSizes.includes(size);
        return (
          <button
            key={size}
            onClick={() => !isDisabled && onChange(size)}
            disabled={isDisabled}
            className={cn(
              "h-9 min-w-9 px-3 rounded-md border text-sm transition-colors",
              selected === size && !isDisabled
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-foreground hover:bg-secondary",
              isDisabled && "opacity-30 cursor-not-allowed line-through"
            )}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
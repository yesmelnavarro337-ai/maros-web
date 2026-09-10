import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function QuantityStepper({ value, onChange, min = 1, max = 99 }: QuantityStepperProps) {
  return (
    <div className="flex items-center border border-border rounded-md w-fit">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="h-9 w-9 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
        disabled={value <= min}
        aria-label="Disminuir cantidad"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-9 text-center text-sm text-foreground">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="h-9 w-9 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
        disabled={value >= max}
        aria-label="Aumentar cantidad"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
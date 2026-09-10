import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WizardStepKey } from "../types";

const STEPS: { key: WizardStepKey; label: string }[] = [
  { key: "tela", label: "Tela" },
  { key: "color", label: "Color" },
  { key: "estampado", label: "Estampado" },
  { key: "bordado", label: "Bordado" },
  { key: "resumen", label: "Resumen" },
];

export function WizardStepper({ current }: { current: WizardStepKey }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center justify-between max-w-md overflow-x-auto pb-1 [scrollbar-width:none]">
      {STEPS.map((step, i) => {
        const isDone = i < currentIndex;
        const isActive = i === currentIndex;
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0",
                  isDone && "bg-primary text-primary-foreground",
                  isActive && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  !isDone && !isActive && "bg-secondary text-muted-foreground"
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] whitespace-nowrap",
                  isActive ? "text-foreground font-medium" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("h-0.5 flex-1 mx-1", isDone ? "bg-primary" : "bg-secondary")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
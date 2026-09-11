import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomizationChoice } from "../types";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

interface OptionGridProps {
  options: CustomizationChoice[];
  selectedId?: string;
  onSelect: (id: string) => void;
  variant?: "image" | "swatch";
}

export function OptionGrid({ options, selectedId, onSelect, variant = "image" }: OptionGridProps) {
  if (options.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        Aún no hay opciones disponibles en esta categoría. Contáctanos directamente por WhatsApp para coordinar los detalles.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {options.map((option) => {
        const isSelected = option.id === selectedId;
        return (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={cn(
              "rounded-xl border-2 p-3 flex flex-col items-center gap-2 transition-colors text-left",
              isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
            )}
          >
            {variant === "swatch" ? (
              <span
                className="h-12 w-12 rounded-full border border-border"
                style={{ backgroundColor: option.hex }}
              />
            ) : (
              <span className="relative h-12 w-12 rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
                {option.image ? (
                  <Image src={cloudinaryUrl(option.image)} alt={option.name} fill sizes="48px" className="object-cover" />
                ) : (
                  <ImageOff className="h-4 w-4 text-muted-foreground" />
                )}
              </span>
            )}
            <div className="text-center">
              <p className="text-xs font-medium text-foreground">{option.name}</p>
              <p className="text-[10px] text-muted-foreground">
                {option.priceModifier > 0 ? `+$${option.priceModifier.toLocaleString("es-CO")}` : "Sin costo"}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
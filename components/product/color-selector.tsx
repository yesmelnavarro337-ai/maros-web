"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

export interface ColorOption {
  name: string;
  hex: string;
  thumbnailUrl?: string | null;
}

interface ColorSelectorProps {
  colors: ColorOption[];
  selected: string;
  onChange: (hex: string) => void;
  disabledHexes?: string[];
  className?: string;
}

export function ColorSelector({
  colors,
  selected,
  onChange,
  disabledHexes = [],
  className,
}: ColorSelectorProps) {
  const selectedColor = colors.find(
    (c) => c.hex.toLowerCase() === selected.toLowerCase()
  );
  const selectedColorName = selectedColor?.name || "Selecciona un color";

  return (
    <div className={cn("space-y-2.5", className)}>
      {/* Encabezado interactivo con el nombre del color */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          Color:{" "}
          <span className="font-semibold text-foreground capitalize">
            {selectedColorName}
          </span>
        </p>
      </div>

      {/* Tarjetas rectangulares (w-16 h-20) con miniatura */}
      <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Colores disponibles">
        {colors.map((c) => {
          const isSelected = selected.toLowerCase() === c.hex.toLowerCase();
          const isDisabled = disabledHexes.some(
            (dh) => dh.toLowerCase() === c.hex.toLowerCase()
          );

          return (
            <button
              key={c.hex}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isDisabled}
              onClick={() => !isDisabled && onChange(c.hex)}
              className={cn(
                "group relative w-16 h-20 rounded-md border text-left overflow-hidden transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 shrink-0",
                isSelected
                  ? "border-2 border-primary ring-2 ring-primary/20 shadow-xs scale-[1.02]"
                  : "border-border hover:border-foreground/50 bg-secondary/20",
                isDisabled && "opacity-40 cursor-not-allowed hover:border-border scale-100"
              )}
              title={isDisabled ? `${c.name} — sin stock en esta talla` : c.name}
              aria-label={c.name}
            >
              {c.thumbnailUrl ? (
                <div className="relative w-full h-full bg-secondary/40">
                  <Image
                    src={cloudinaryUrl(c.thumbnailUrl)}
                    alt={c.name}
                    fill
                    sizes="64px"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {/* Overlay gradiente suave inferior */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                </div>
              ) : (
                /* Fallback sin foto dedicada: exhibir el color con swatch refinado */
                <div
                  className="w-full h-full flex flex-col items-center justify-center p-1 relative"
                  style={{ backgroundColor: `${c.hex}15` }}
                >
                  <span
                    className="w-7 h-7 rounded-full border border-black/15 shadow-2xs"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[10px] text-foreground/80 font-medium text-center truncate max-w-full px-1 mt-1">
                    {c.name}
                  </span>
                </div>
              )}

              {/* Indicador de swatch de color en la esquina inferior */}
              <span
                className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border border-white/90 shadow-xs shrink-0 z-10"
                style={{ backgroundColor: c.hex }}
                aria-hidden="true"
              />

              {/* Tachado si no hay stock */}
              {isDisabled && (
                <span className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                  <span className="h-[2px] w-14 bg-destructive/80 rotate-45 shadow-xs" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

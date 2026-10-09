import Image from "next/image";
import { Shirt } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomizationModel } from "../types";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

interface ModelGridProps {
  models: CustomizationModel[];
  selectedSlug?: string;
  loadingSlug?: string;
  onSelect: (model: CustomizationModel) => void;
}

export function ModelGrid({ models, selectedSlug, loadingSlug, onSelect }: ModelGridProps) {
  if (models.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        Aún no hay modelos disponibles. Contáctanos por WhatsApp y diseñamos el tuyo.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {models.map((model) => {
        const isSelected = model.slug === selectedSlug;
        const isLoading = model.slug === loadingSlug;
        return (
          <button
            key={model.id}
            onClick={() => onSelect(model)}
            disabled={isLoading}
            className={cn(
              "group rounded-xl border-2 overflow-hidden flex flex-col transform-gpu transition-all duration-300 text-left hover:-translate-y-1 hover:shadow-md active:scale-95 select-none",
              isSelected
                ? "border-primary bg-primary/10 shadow-sm ring-2 ring-primary/20 scale-[1.01]"
                : "border-border hover:border-primary/40 bg-card",
              isLoading && "opacity-60"
            )}
          >
            <span className="relative aspect-[4/5] w-full bg-secondary block overflow-hidden">
              {model.image ? (
                <Image
                  src={cloudinaryUrl(model.image)}
                  alt={model.name}
                  fill
                  sizes="200px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-108 group-active:scale-105"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Shirt className="h-8 w-8 text-primary/40 group-hover:scale-110 transition-transform" />
                </span>
              )}
            </span>
            <span className="p-3 flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {model.name}
              </span>
              <span className="text-[10px] text-muted-foreground">
                Desde ${model.price.toLocaleString("es-CO")}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

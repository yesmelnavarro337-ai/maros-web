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
              "rounded-xl border-2 overflow-hidden flex flex-col transition-colors text-left",
              isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
              isLoading && "opacity-60"
            )}
          >
            <span className="relative aspect-[4/5] w-full bg-secondary block">
              {model.image ? (
                <Image src={cloudinaryUrl(model.image)} alt={model.name} fill sizes="200px" className="object-cover" />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Shirt className="h-8 w-8 text-primary/40" />
                </span>
              )}
            </span>
            <span className="p-3 flex flex-col gap-0.5">
              <span className="text-xs font-medium text-foreground truncate">{model.name}</span>
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
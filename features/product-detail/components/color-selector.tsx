"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { cloudinaryUrl } from "@/lib/images/cloudinary";
import { ImageOff } from "lucide-react";
import type { ProductDetailImage, ProductColorOption } from "../types";

interface ColorGroup {
  hex: string;
  name: string;
  thumbnail: string | null;
}

interface ColorSelectorProps {
  imageDetails: ProductDetailImage[];
  colors: ProductColorOption[];
  selectedColorHex: string;
  onColorChange: (hex: string) => void;
  disabledHexes?: string[];
}

/**
 * Builds unique color groups from imageDetails (primary) and variant colors (fallback).
 * Each group has a representative thumbnail image for that color.
 */
function buildColorGroups(
  imageDetails: ProductDetailImage[],
  colors: ProductColorOption[]
): ColorGroup[] {
  const groupMap = new Map<string, ColorGroup>();

  // First pass: iterate over colors array to preserve color order
  for (const color of colors) {
    const key = color.hex.toLowerCase();
    
    // Find representative thumbnail image from imageDetails by colorHex or colorName
    const matchingImg = imageDetails.find(
      (img) =>
        (img.colorHex && img.colorHex.toLowerCase() === key) ||
        (img.colorName && color.name && img.colorName.toLowerCase() === color.name.toLowerCase())
    );

    groupMap.set(key, {
      hex: color.hex,
      name: color.name,
      thumbnail: matchingImg ? matchingImg.url : null,
    });
  }

  // Second pass: include any color tagged in imageDetails that wasn't in colors array
  for (const img of imageDetails) {
    if (!img.colorHex) continue;
    const key = img.colorHex.toLowerCase();
    if (!groupMap.has(key)) {
      groupMap.set(key, {
        hex: img.colorHex,
        name: img.colorName || img.colorHex,
        thumbnail: img.url,
      });
    }
  }

  return Array.from(groupMap.values());
}

export function ColorSelector({
  imageDetails,
  colors,
  selectedColorHex,
  onColorChange,
  disabledHexes = [],
}: ColorSelectorProps) {
  const colorGroups = buildColorGroups(imageDetails, colors);

  if (colorGroups.length === 0) return null;

  const selectedGroup = colorGroups.find(
    (g) => g.hex.toLowerCase() === selectedColorHex.toLowerCase()
  );
  const selectedColorName = selectedGroup?.name ?? "";

  return (
    <div>
      <p className="text-sm font-medium text-foreground mb-2">
        Color:{" "}
        <span className="font-semibold text-foreground capitalize">
          {selectedColorName}
        </span>
      </p>

      <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Colores disponibles">
        {colorGroups.map((group) => {
          const isSelected =
            group.hex.toLowerCase() === selectedColorHex.toLowerCase();
          const isDisabled = disabledHexes.some(
            (dh) => dh.toLowerCase() === group.hex.toLowerCase()
          );

          return (
            <button
              key={group.hex}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isDisabled}
              onClick={() => !isDisabled && onColorChange(group.hex)}
              className={cn(
                "relative w-16 h-20 rounded-lg border-2 overflow-hidden transition-all flex-shrink-0 group text-left",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                isSelected && !isDisabled
                  ? "border-primary ring-2 ring-primary/30 shadow-md scale-[1.02]"
                  : "border-border hover:border-muted-foreground/40",
                isDisabled && "opacity-40 cursor-not-allowed scale-100"
              )}
              title={
                isDisabled
                  ? `${group.name} — sin stock en esta talla`
                  : group.name
              }
              aria-label={group.name}
            >
              {group.thumbnail ? (
                <div className="relative w-full h-full bg-secondary/30">
                  <Image
                    src={cloudinaryUrl(group.thumbnail)}
                    alt={group.name}
                    fill
                    sizes="64px"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                </div>
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center relative"
                  style={{ backgroundColor: group.hex }}
                >
                  <ImageOff className="h-4 w-4 text-white/70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>
              )}

              {/* Color name label banner at bottom */}
              <span className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-[2px] text-[10px] text-white text-center py-0.5 truncate px-1 font-medium leading-tight z-10">
                {group.name}
              </span>

              {/* Disabled strikethrough */}
              {isDisabled && (
                <span className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                  <span className="h-[2px] w-12 bg-destructive/80 rotate-45 shadow-xs" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

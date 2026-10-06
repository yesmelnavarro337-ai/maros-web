"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { cloudinaryUrl } from "@/lib/images/cloudinary";
import type { ProductDetailImage, ProductColorOption } from "../types";

interface ColorGroup {
  name: string;
  hex: string;
  primaryHex?: string;
  secondaryHex?: string | null;
  isCombined?: boolean;
  thumbnail: string | null;
}

interface ColorSelectorProps {
  imageDetails: ProductDetailImage[];
  colors: ProductColorOption[];
  selectedColorName?: string;
  selectedColorHex?: string;
  onColorChange: (colorName: string) => void;
  disabledColorNames?: string[];
  disabledHexes?: string[];
}

/**
 * Builds unique color groups from colors (primary) and imageDetails (fallback).
 * Keyed by color name to support combined colors sharing the same base hex.
 */
function buildColorGroups(
  imageDetails: ProductDetailImage[],
  colors: ProductColorOption[]
): ColorGroup[] {
  const groupMap = new Map<string, ColorGroup>();

  // Primer paso: iterar sobre colores del producto
  for (const color of colors) {
    if (!color.name) continue;
    const key = color.name.trim().toLowerCase();

    // Buscar imagen asociada al color por colorName o colorHex
    const matchingImg = imageDetails.find(
      (img) =>
        (img.colorName && img.colorName.trim().toLowerCase() === key) ||
        (img.colorHex && color.hex && img.colorHex.toLowerCase() === color.hex.toLowerCase())
    );

    groupMap.set(key, {
      name: color.name,
      hex: color.hex || color.primaryHex || "#6B6832",
      primaryHex: color.primaryHex || color.hex || "#6B6832",
      secondaryHex: color.secondaryHex || null,
      isCombined: Boolean(color.isCombined || color.secondaryHex),
      thumbnail: matchingImg ? matchingImg.url : null,
    });
  }

  // Segundo paso: incluir cualquier color presente en imageDetails que no estuviera en colors
  for (const img of imageDetails) {
    if (!img.colorName && !img.colorHex) continue;
    const name = img.colorName || img.colorHex || "";
    const key = name.trim().toLowerCase();
    if (!groupMap.has(key)) {
      groupMap.set(key, {
        name,
        hex: img.primaryHex || img.colorHex || "#6B6832",
        primaryHex: img.primaryHex || img.colorHex || "#6B6832",
        secondaryHex: img.secondaryHex || null,
        isCombined: Boolean(img.isCombined || img.secondaryHex),
        thumbnail: img.url,
      });
    }
  }

  return Array.from(groupMap.values());
}

export function ColorSelector({
  imageDetails,
  colors,
  selectedColorName,
  selectedColorHex,
  onColorChange,
  disabledColorNames = [],
  disabledHexes = [],
}: ColorSelectorProps) {
  const colorGroups = buildColorGroups(imageDetails, colors);

  if (colorGroups.length === 0) return null;

  const selectedGroup =
    colorGroups.find(
      (g) =>
        (selectedColorName && g.name.toLowerCase() === selectedColorName.toLowerCase()) ||
        (selectedColorHex && g.hex.toLowerCase() === selectedColorHex.toLowerCase())
    ) ?? colorGroups[0];

  const activeName = selectedGroup?.name ?? "";

  return (
    <div>
      <p className="text-sm font-medium text-foreground mb-2">
        Color:{" "}
        <span className="font-semibold text-foreground capitalize">
          {activeName}
        </span>
      </p>

      <div className="flex gap-2 flex-wrap" role="radiogroup" aria-label="Colores disponibles">
        {colorGroups.map((group) => {
          const isSelected = Boolean(
            (selectedColorName && group.name.toLowerCase() === selectedColorName.toLowerCase()) ||
            (!selectedColorName && selectedColorHex && group.hex.toLowerCase() === selectedColorHex.toLowerCase())
          );

          const isDisabled =
            disabledColorNames.some((dn) => dn.toLowerCase() === group.name.toLowerCase()) ||
            disabledHexes.some((dh) => dh.toLowerCase() === group.hex.toLowerCase());

          const swatchBackground =
            group.isCombined && group.secondaryHex
              ? `linear-gradient(135deg, ${group.primaryHex} 50%, ${group.secondaryHex} 50%)`
              : (group.primaryHex || group.hex || "#6B6832");

          return (
            <button
              key={group.name}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isDisabled}
              onClick={() => !isDisabled && onColorChange(group.name)}
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
                  style={{ background: swatchBackground }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>
              )}

              {/* Mini badge cromático en la esquina superior si tiene foto */}
              {group.thumbnail && (
                <span
                  className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full border border-white shadow-xs z-10"
                  style={{ background: swatchBackground }}
                />
              )}

              {/* Banner inferior con nombre del color */}
              <span className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-[2px] text-[10px] text-white text-center py-0.5 truncate px-1 font-medium leading-tight z-10">
                {group.name}
              </span>

              {/* Tachado cuando está deshabilitado */}
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

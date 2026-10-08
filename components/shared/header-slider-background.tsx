"use client";

import { useEffect, useState, useRef, type ReactNode } from "react";
import Image from "next/image";
import { cloudinaryUrl } from "@/lib/images/cloudinary";
import { cn } from "@/lib/utils";

interface HeaderSliderBackgroundProps {
  images: string[];
  overlayOpacity?: number;
  intervalMs?: number;
  className?: string;
  children?: ReactNode;
}

/**
 * Slider de fondo unificado con transición Ken Burns sutil:
 * Transición de opacity: 0 -> 1 con scale: 1.03 -> 1.00 en 700ms.
 * Autoplay cada 5 segundos (5000ms), seguro ante re-renders y gestos táctiles.
 */
export function HeaderSliderBackground({
  images,
  overlayOpacity = 40,
  intervalMs = 3800,
  className,
  children,
}: HeaderSliderBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const validImages = images.filter((img) => Boolean(img?.trim()));
  const count = validImages.length;
  const hasMultiple = count > 1;

  // Temporizador robusto de Autoplay: depende de `count` (primitivo)
  // para no resetearse indebidamente con cada render de padres o animaciones.
  useEffect(() => {
    if (count <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % count);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [count, isPaused, intervalMs]);

  // Manejo de visibilidad de pestaña: pausar en segundo plano y reanudar al volver
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    };
  }, []);

  const pauseAutoplay = (durationMs = 5000) => {
    setIsPaused(true);
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, durationMs);
  };

  const resumeAutoplay = () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    setIsPaused(false);
  };

  const handleTouchStart = () => {
    pauseAutoplay(4000);
  };

  const handleTouchEnd = () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 2000);
  };

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      onMouseEnter={() => pauseAutoplay(5000)}
      onMouseLeave={resumeAutoplay}
      onPointerLeave={resumeAutoplay}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* Slides con Ken Burns Fade + Subtle Zoom */}
      {validImages.map((img, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={`${img}-${idx}`}
            aria-hidden={!isActive}
            className={cn(
              "absolute inset-0 w-full h-full transform-gpu transition-all duration-700 ease-out",
              isActive
                ? "opacity-100 scale-100 z-10 pointer-events-auto"
                : "opacity-0 scale-[1.03] z-0 pointer-events-none"
            )}
          >
            <Image
              src={cloudinaryUrl(img)}
              alt=""
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover object-center transform-gpu"
            />
          </div>
        );
      })}

      {/* Fallback de degradado suave de marca si no hay imágenes */}
      {validImages.length === 0 && (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark-olive via-brand-olive to-brand-olive-gold z-0" />
      )}

      {/* Overlay oscuro regulable */}
      <div
        className="absolute inset-0 bg-black z-20 pointer-events-none transition-opacity duration-500"
        style={{ opacity: overlayOpacity / 100 }}
      />

      {/* Contenido (Textos, botones, etc.) */}
      <div className="relative z-30 w-full">{children}</div>

      {/* Dots indicadores si hay múltiples imágenes */}
      {hasMultiple && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 pointer-events-auto">
          {validImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
                pauseAutoplay(6000);
              }}
              aria-label={`Ir al fondo ${idx + 1}`}
              className={cn(
                "h-1.5 rounded-full shadow-sm transition-all duration-300",
                idx === currentIndex
                  ? "w-6 bg-brand-gold"
                  : "w-1.5 bg-white/50 hover:bg-white/80"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

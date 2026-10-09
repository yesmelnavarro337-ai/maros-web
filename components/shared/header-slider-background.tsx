"use client";

import { useEffect, useState, useRef, type ReactNode } from "react";
import Image from "next/image";
import { cloudinaryUrl } from "@/lib/images/cloudinary";
import { cn } from "@/lib/utils";
import type { HeaderMedia } from "@/features/page-headers/types";

/**
 * Duración de cada slide de imagen, igual que el hero del home (3.8 segundos).
 */
const IMAGE_SLIDE_DURATION_MS = 3800;

interface HeaderSliderBackgroundProps {
  images: string[];
  media?: HeaderMedia[];
  /** URL de respaldo si una imagen del slider falla al cargar. */
  fallbackImage?: string;
  overlayOpacity?: number;
  intervalMs?: number;
  className?: string;
  children?: ReactNode;
}

interface Slide {
  url: string;
  mediaType: "image" | "video";
}

/**
 * Slide de video: se reproduce completo (muted + playsInline) mientras esté
 * activo; al terminar notifica `onEnded` para avanzar al siguiente y al fallar
 * la carga notifica `onError` para que el slider avance y nunca quede congelado
 * (si un video se rompe, el temporizador de imágenes lo dejaría atascado).
 * Se pausa automáticamente cuando la pestaña queda oculta.
 */
function SlideVideo({
  src,
  isActive,
  shouldPlay,
  onEnded,
  onError,
}: {
  src: string;
  isActive: boolean;
  shouldPlay: boolean;
  onEnded: () => void;
  onError?: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  // Sincroniza el video con el slide activo: al entrar reinicia desde el inicio;
  // al salir pausa y vuelve al inicio para no consumir datos ni quedar congelado
  // durante el crossfade. `preload="auto"` mantiene el buffer listo de antemano.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isActive) {
      el.currentTime = 0;
    } else {
      el.pause();
      el.currentTime = 0;
    }
  }, [isActive, shouldPlay]);

  // Reproducción con reintento: mientras el slide esté activo intenta `play()`
  // y vuelve a reintentarlo cuando el navegador tenga datos cargados
  // (`loadeddata`/`canplay`). Así un video lento arranca en cuanto esté listo y
  // su `onEnded` avanza el carrusel; sin autoPlay permanente en inactivos.
  useEffect(() => {
    const el = ref.current;
    if (!el || !isActive || !shouldPlay) return;

    let cancelled = false;
    const tryPlay = () => {
      if (cancelled) return;
      el.play().catch(() => undefined);
    };

    tryPlay();
    el.addEventListener("loadeddata", tryPlay);
    el.addEventListener("canplay", tryPlay);
    return () => {
      cancelled = true;
      el.removeEventListener("loadeddata", tryPlay);
      el.removeEventListener("canplay", tryPlay);
    };
  }, [isActive, shouldPlay]);

  // Solo el video activo lleva `autoPlay` e `onEnded`/`onError`: los inactivos
  // permanecen en el primer fotograma sin descargar ni disparar eventos.
  return (
    <video
      ref={ref}
      src={src}
      autoPlay={isActive}
      muted
      playsInline
      preload="auto"
      onEnded={isActive ? onEnded : undefined}
      onError={isActive ? onError : undefined}
      className="h-full w-full object-cover object-center transform-gpu"
    />
  );
}

/**
 * Imagen de un slide con respaldo ante errores de carga: si la URL real falla
 * (404, CORS, borrada en Cloudinary) se sustituye en el mismo slide por
 * `fallbackSrc`. Así la foto de prueba nunca ocupa un slide propio, solo actúa
 * como red de seguridad, tal como en los headers del home.
 */
function SlideImage({
  src,
  fallbackSrc,
  priority,
  eager,
}: {
  src: string;
  fallbackSrc?: string;
  priority: boolean;
  eager: boolean;
}) {
  // El slide se remonta (key = url+índice) cuando cambia su recurso, así que el
  // estado inicial ya refleja `src` y no hace falta sincronizarlo en un efecto.
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <Image
      src={currentSrc}
      alt=""
      fill
      priority={priority}
      loading={priority ? undefined : eager ? "eager" : "lazy"}
      sizes="100vw"
      onError={() => {
        if (fallbackSrc && currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
      }}
      className="object-cover object-center transform-gpu"
    />
  );
}

/**
 * Slider de fondo unificado con crossfade (fundido en cruz) fluido de 700ms,
 * con los mismos tiempos del hero del home (3800ms por slide de imagen):
 * las capas multimedia se superponen y transicionan su opacidad (0 <-> 100) con
 * `transition-all duration-700 ease-out`, eliminando saltos y parpadeos.
 * Todos los recursos quedan montados y pre-cargados (imágenes `eager` para el
 * siguiente slide y videos `preload="auto"`) antes de hacer visible la transición.
 *
 * Modo multimedia (`media` con items): las imágenes avanzan cada 3.8 segundos de
 * forma fija y los videos se reproducen completos, cambiando de slide solo
 * cuando emiten el evento nativo `onEnded` (regla estricta de video).
 * Si `media` está vacío se usa el modo clásico con `images` e `intervalMs`.
 */
export function HeaderSliderBackground({
  images,
  media,
  fallbackImage,
  overlayOpacity = 40,
  intervalMs = 3800,
  className,
  children,
}: HeaderSliderBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const mediaSlides: Slide[] = (media ?? [])
    .filter((m) => Boolean(m.url?.trim()))
    .sort((a, b) => a.order - b.order)
    .map((m) => ({ url: m.url, mediaType: m.mediaType === "video" ? "video" : "image" }));

  const hasMedia = mediaSlides.length > 0;
  const fallbackSlides: Slide[] = images.filter((img) => Boolean(img?.trim())).map((url) => ({ url, mediaType: "image" as const }));
  const slides = hasMedia ? mediaSlides : fallbackSlides;

  const count = slides.length;
  const hasMultiple = count > 1;
  const safeIndex = count > 0 ? Math.min(currentIndex, count - 1) : 0;
  const nextIndex = count > 0 ? (safeIndex + 1) % count : 0;
  const currentSlide = count > 0 ? slides[safeIndex] : undefined;
  const currentIsVideo = currentSlide?.mediaType === "video";

  // Autoplay de imágenes: timeout único por slide. Los videos NO avanzan por
  // temporizador: solo notifican vía `onEnded`.
  useEffect(() => {
    if (count <= 1 || isPaused || isHidden || currentIsVideo) return;

    const duration = hasMedia ? IMAGE_SLIDE_DURATION_MS : intervalMs;
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % count);
    }, duration);

    return () => clearTimeout(timer);
  }, [count, safeIndex, isPaused, isHidden, currentIsVideo, hasMedia, intervalMs]);

  // Manejo de visibilidad de pestaña: pausar en segundo plano y reanudar al volver.
  // Los videos se pausan solo con la pestaña oculta (no con hover/touch) para
  // que su reproducción continúe hasta emitir `onEnded`.
  useEffect(() => {
    const handleVisibility = () => {
      setIsHidden(document.hidden);
    };
    handleVisibility();
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

  const handleVideoEnded = () => {
    setCurrentIndex((prev) => (prev + 1) % count);
  };

  // Si un video falla al cargar (URL rota, borrada de Cloudinary), avanza al
  // siguiente slide igual que si hubiera terminado: el carrusel nunca se queda
  // atascado en una diapositiva de video irrecuperable.
  const handleVideoError = handleVideoEnded;

  return (
    <div
      className={cn("relative w-full overflow-hidden bg-brand-dark-olive", className)}
      onMouseEnter={() => pauseAutoplay(5000)}
      onMouseLeave={resumeAutoplay}
      onPointerLeave={resumeAutoplay}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* Capas multimedia superpuestas con crossfade fluido (700ms ease-out, el mismo
          del hero del home) y zoom sutil estilo Ken Burns: la capa
          entrante escala de 1.03 a 1.00 mientras sube su opacidad, la saliente
          hace el camino inverso. Durante la transición conviven la capa entrante
          (opacity-0 -> 100) y la saliente (100 -> 0); el resto queda montado en
          opacity-0 con su recurso ya cargado/buffered para evitar saltos. */}
      {slides.map((slide, idx) => {
        const isActive = idx === safeIndex;
        const isNext = count > 1 && idx === nextIndex;
        return (
          <div
            key={`${slide.url}-${idx}`}
            aria-hidden={!isActive}
            className={cn(
              "absolute inset-0 w-full h-full transform-gpu pointer-events-none transition-all duration-700 ease-out will-change-[opacity,transform]",
              isActive ? "opacity-100 scale-100 z-10" : "opacity-0 scale-[1.03] z-0"
            )}
          >
            {slide.mediaType === "video" ? (
              <SlideVideo
                src={slide.url}
                isActive={isActive}
                shouldPlay={!isHidden}
                onEnded={handleVideoEnded}
                onError={handleVideoError}
              />
            ) : (
              // `priority` reserva la primera imagen y `eager` adelanta la carga
              // del siguiente slide, de modo que al hacer crossfade ya esté lista.
              <SlideImage
                src={cloudinaryUrl(slide.url)}
                fallbackSrc={fallbackImage ? cloudinaryUrl(fallbackImage) : undefined}
                priority={idx === 0}
                eager={isNext}
              />
            )}
          </div>
        );
      })}

      {/* Fallback de degradado suave de marca si no hay imágenes */}
      {count === 0 && (
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
          {slides.map((slide, idx) => (
            <button
              key={`${slide.url}-dot-${idx}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
                pauseAutoplay(6000);
              }}
              aria-label={`Ir al fondo ${idx + 1}`}
              className={cn(
                "h-1.5 rounded-full shadow-sm transition-all duration-300",
                idx === safeIndex
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

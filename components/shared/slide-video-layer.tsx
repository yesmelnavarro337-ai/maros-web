"use client";

import { useEffect, useRef } from "react";

interface SlideVideoLayerProps {
  src: string;
  isActive: boolean;
  shouldPlay: boolean;
  onEnded: () => void;
  onError?: () => void;
  className?: string;
}

/**
 * Capa de video para sliders con crossfade.
 *
 * - El video se reproduce completo SOLO cuando su slide está activo: al activarse
 *   se reinicia desde el inicio (currentTime = 0) y se reproduce muted y sin loop,
 *   de modo que al llegar al final emite el evento nativo `onEnded` y el slider
 *   puede avanzar. Con `loop` el navegador nunca lanza `onEnded`, por eso NUNCA
 *   se usa aquí.
 * - Al dejar de estar activo (o al ocultarse la pestaña) solo se pausa, sin
 *   resetear al primer fotograma: así el slide saliente conserva el último
 *   fotograma durante el fundido y el final del video se ve de forma natural.
 * - Cuando el slide vuelve a estar activo se reinicia desde el inicio para
 *   reproducirse completo de nuevo.
 * - Si el video falla al cargar (`onError`) se notifica para que el slider
 *   avance y nunca quede congelado en una diapositiva irrecuperable.
 */
export function SlideVideoLayer({
  src,
  isActive,
  shouldPlay,
  onEnded,
  onError,
  className,
}: SlideVideoLayerProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isActive && shouldPlay) {
      el.currentTime = 0;
      el.play().catch(() => undefined);
    } else {
      el.pause();
    }
  }, [isActive, shouldPlay]);

  // Reintenta la reproducción cuando el navegador ya tenga datos cargados:
  // así un video lento arranca en cuanto `onEnded` pueda emitirse y avanzar.
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
      className={className}
    />
  );
}
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const AUDIO_NAV_TRACK = "/audio/navidad-instrumental.mp3";
const AUDIO_ABOUT_TRACK = "/audio/nosotros-instrumental.mp3";
const STORAGE_KEY = "maros_audio_muted";
const DEFAULT_VOLUME = 0.12; // Volumen ambiental muy suave y sutil de fondo

export function AmbientAudioPlayer() {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Determinar pista según la ruta actual de Next.js
  const currentTrack = pathname?.startsWith("/nosotros")
    ? AUDIO_ABOUT_TRACK
    : AUDIO_NAV_TRACK;
  const trackLabel = pathname?.startsWith("/nosotros")
    ? "Música Instrumental"
    : "Música Navideña";

  // Estado persistente: sólo inicia silenciado si el usuario lo guardó explícitamente como "true"
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const isInteractingRef = useRef<boolean>(false);

  // Función para reproducir el audio con un fade-in suave y volumen bajo
  const playWithFadeIn = useCallback(
    (targetVol = DEFAULT_VOLUME): Promise<void> => {
      const audio = audioRef.current;
      if (!audio) return Promise.reject(new Error("Audio element not ready"));

      // Verificar si el usuario lo tiene explícitamente silenciado en localStorage
      try {
        if (localStorage.getItem(STORAGE_KEY) === "true") {
          return Promise.reject(new Error("Muted by user"));
        }
      } catch {}

      audio.volume = 0.02;
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        return playPromise.then(() => {
          setIsPlaying(true);
          // Rampa suave de volumen muy sutil (fade-in gradual hasta targetVol)
          let v = 0.02;
          const fadeInterval = setInterval(() => {
            v += 0.01;
            if (v >= targetVol) {
              audio.volume = targetVol;
              clearInterval(fadeInterval);
            } else {
              audio.volume = Number(v.toFixed(2));
            }
          }, 70);
        });
      }

      return Promise.resolve();
    },
    []
  );

  // 1. Escuchador de Autoplay Global Bypass tras el primer gesto/interacción
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || isMuted) return;

    let cleanupListeners: (() => void) | null = null;

    // Escuchador que se dispara con cualquier interacción del usuario
    const enableAudioOnInteraction = () => {
      const el = audioRef.current;
      if (!el) return;

      // Si el elemento está pausado y no fue silenciado intencionalmente
      if (el.paused && !isMuted && !isInteractingRef.current) {
        isInteractingRef.current = true;
        playWithFadeIn()
          .then(() => {
            // Se logró reproducir con éxito: removemos los listeners
            if (cleanupListeners) cleanupListeners();
          })
          .catch(() => {
            // Si el navegador aún no concedió permisos para este evento específico,
            // permitimos que el siguiente gesto lo vuelva a intentar
            isInteractingRef.current = false;
          });
      }
    };

    const addInteractionListeners = () => {
      const events = [
        "click",
        "pointerdown",
        "touchstart",
        "touchend",
        "scroll",
        "keydown",
        "wheel",
      ] as const;

      const handlers: Array<() => void> = [];

      events.forEach((evt) => {
        const handler = () => enableAudioOnInteraction();
        window.addEventListener(evt, handler, { passive: true });
        document.addEventListener(evt, handler, { passive: true });
        handlers.push(() => {
          window.removeEventListener(evt, handler);
          document.removeEventListener(evt, handler);
        });
      });

      return () => {
        handlers.forEach((h) => h());
      };
    };

    // Intento 1: Reproducción directa en montaje
    playWithFadeIn()
      .then(() => {
        // Reprodujo sin bloqueo (ej. usuario ya interactuó con el dominio)
      })
      .catch(() => {
        // Bloqueado por política de Autoplay: activar escuchadores de interacción
        cleanupListeners = addInteractionListeners();
      });

    return () => {
      if (cleanupListeners) cleanupListeners();
    };
  }, [isMuted, playWithFadeIn]);

  // 2. Persistencia entre rutas con usePathname (no reiniciar abruptamente al navegar)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.src.endsWith(currentTrack)) {
      const wasPlaying = isPlaying || (!audio.paused && !audio.ended);
      audio.src = currentTrack;
      audio.load();

      if (wasPlaying && !isMuted) {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    }
  }, [currentTrack, isPlaying, isMuted]);

  // 3. Manejador del botón Mute / Unmute
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused && !isMuted) {
      // Acción: Silenciar
      audio.pause();
      setIsMuted(true);
      setIsPlaying(false);
      try {
        localStorage.setItem(STORAGE_KEY, "true");
        sessionStorage.setItem(STORAGE_KEY, "true");
      } catch {}
    } else {
      // Acción: Activar sonido y reproducir
      setIsMuted(false);
      try {
        localStorage.setItem(STORAGE_KEY, "false");
        sessionStorage.setItem(STORAGE_KEY, "false");
      } catch {}

      playWithFadeIn()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          audio.volume = DEFAULT_VOLUME;
          audio.play().then(() => setIsPlaying(true)).catch(() => {});
        });
    }
  };

  return (
    <>
      {/* Elemento HTML5 de audio en bucle infinito */}
      <audio
        ref={audioRef}
        src={currentTrack}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          // Si una pista secundaria falla, reintenta con la principal
          const audio = audioRef.current;
          if (audio && !audio.src.endsWith(AUDIO_NAV_TRACK)) {
            audio.src = AUDIO_NAV_TRACK;
            audio.load();
            if (!isMuted) {
              audio.play().then(() => setIsPlaying(true)).catch(() => {});
            }
          }
        }}
      />

      {/* Micro-control flotante Apple Liquid Glass (Mínimo, ~36px, sin texto para no ocupar espacio) */}
      <div className="fixed bottom-5 left-5 z-40 print:hidden select-none">
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isPlaying ? `Silenciar ${trackLabel} de fondo` : `Activar ${trackLabel} de fondo`}
          title={isPlaying ? `Música de fondo activa (${trackLabel}) — Clic para silenciar` : `Música de fondo silenciada — Clic para activar`}
          className={cn(
            "group relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300",
            // Estética Apple Liquid Glass: material traslúcido con refracción y micro-borde
            "bg-white/25 dark:bg-black/30 backdrop-blur-xl backdrop-saturate-150",
            "border border-white/50 dark:border-white/20",
            "shadow-[0_4px_20px_0_rgba(0,0,0,0.08),inset_0_1px_1px_0_rgba(255,255,255,0.5)]",
            // Opacidad inteligente: 70% en reposo, 100% en hover
            "opacity-70 hover:opacity-100 hover:scale-105 active:scale-95 hover:bg-white/35 dark:hover:bg-black/40"
          )}
        >
          {isPlaying ? (
            <div className="relative flex items-center justify-center">
              <span className="absolute -inset-1 rounded-full bg-[#A38A3E]/20 animate-ping opacity-60" />
              {/* Micro ecualizador sutil dorado */}
              <div className="flex items-end gap-0.5 h-3 px-0.5">
                <span className="w-0.5 bg-[#A38A3E] rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2" />
                <span className="w-0.5 bg-[#A38A3E] rounded-full animate-[pulse_1.1s_ease-in-out_infinite] h-3" />
                <span className="w-0.5 bg-[#A38A3E] rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-1.5" />
              </div>
            </div>
          ) : (
            <VolumeX className="h-4 w-4 text-stone-600 dark:text-stone-300 transition-colors" />
          )}
        </button>
      </div>
    </>
  );
}

// Alias de exportación para compatibilidad
export { AmbientAudioPlayer as BackgroundMusic };

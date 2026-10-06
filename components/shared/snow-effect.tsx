"use client";

import { useEffect, useRef } from "react";

/** Capas de profundidad: 0 fondo, 1 medio, 2 primer plano. */
interface Snowflake {
  x: number;
  y: number;
  radius: number;
  layer: 0 | 1 | 2;
  speedY: number;
  opacity: number;
  phase: number;
  swing: number;
  swingSpeed: number;
  glow: boolean;
}

/** Tono blanco cálido / crema navideño elegante alineado con la identidad de Maro's */
const CREAM = (alpha: number) => `rgba(255, 253, 248, ${alpha})`;

function getViewport() {
  if (typeof window === "undefined") {
    return { w: 1920, h: 1080 };
  }
  const w = window.innerWidth || document.documentElement.clientWidth || document.body?.clientWidth || 1920;
  const h = window.innerHeight || document.documentElement.clientHeight || document.body?.clientHeight || 1080;
  return {
    w: Math.max(w, 320),
    h: Math.max(h, 480),
  };
}

function createFlake(w: number, h: number, initial: boolean): Snowflake {
  // Distribución de capas: 42% fondo, 40% plano medio, 18% primer plano
  const roll = Math.random();
  const layer: 0 | 1 | 2 = roll < 0.42 ? 0 : roll < 0.82 ? 1 : 2;

  let radius: number;
  let speedY: number;
  let opacity: number;
  let swing: number;
  let swingSpeed: number;

  if (layer === 2) {
    // Primer plano: copos prominentes, caída dinámica, brillo ambiental sutil
    radius = 2.8 + Math.random() * 1.4;
    speedY = 1.8 + Math.random() * 1.0;
    opacity = 0.8 + Math.random() * 0.18;
    swing = 0.8 + Math.random() * 0.8;
    swingSpeed = 0.018 + Math.random() * 0.014;
  } else if (layer === 1) {
    // Capa media: copos de caída cadenciosa y tamaño medio
    radius = 1.8 + Math.random() * 0.9;
    speedY = 1.1 + Math.random() * 0.6;
    opacity = 0.5 + Math.random() * 0.22;
    swing = 0.5 + Math.random() * 0.6;
    swingSpeed = 0.014 + Math.random() * 0.012;
  } else {
    // Fondo: copos con caída etérea y profundidad
    radius = 1.0 + Math.random() * 0.7;
    speedY = 0.65 + Math.random() * 0.45;
    opacity = 0.3 + Math.random() * 0.2;
    swing = 0.35 + Math.random() * 0.4;
    swingSpeed = 0.01 + Math.random() * 0.01;
  }

  return {
    x: Math.random() * (w + 40) - 20,
    y: initial ? Math.random() * h : -10 - Math.random() * 35,
    radius,
    layer,
    speedY,
    opacity,
    phase: Math.random() * Math.PI * 2,
    swing,
    swingSpeed,
    glow: layer === 2,
  };
}

/**
 * Nieve navideña continua de alta fidelidad:
 * - Ciclo ininterrumpible con auto-recuperación (Page Visibility, focus, pageshow, resize).
 * - Sincronización continua de delta-time (independiente de 60Hz, 120Hz o ProMotion).
 * - Respaldo elegante de accesibilidad: si el sistema tiene prefers-reduced-motion activo,
 *   la nieve adopta una cadencia ultra-suave y sutil sin jamás congelarse ni detenerse.
 * - Profundidad 3D Parallax en 3 capas con brisa armónica senoidal y reciclaje infinito.
 */
export function SnowEffect() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const flakesRef = useRef<Snowflake[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let isRunning = true;
    let rafId: number | null = null;
    let windTime = 0;
    let lastTimestamp = performance.now();

    // Detección de accesibilidad (ajusta velocidad a cadencia calmada sin detener la caída)
    const mediaQuery = typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
    let reducedMotionMode = mediaQuery ? mediaQuery.matches : false;

    const resize = () => {
      const { w, h } = getViewport();
      const currentSize = sizeRef.current;
      const sizeChanged = Math.abs(currentSize.w - w) > 3 || Math.abs(currentSize.h - h) > 3;

      if (!sizeChanged && flakesRef.current.length > 0) {
        return;
      }

      sizeRef.current = { w, h };

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Densidad adaptativa: pantalla pequeña ~50-65 copos, desktop ~115-145 copos
      const divisor = w < 768 ? 12000 : 9500;
      const targetCount = Math.round(Math.min(145, Math.max(50, (w * h) / divisor)));

      const flakes = flakesRef.current;
      while (flakes.length < targetCount) {
        flakes.push(createFlake(w, h, true));
      }
      if (flakes.length > targetCount) {
        flakes.length = targetCount;
      }

      // Reubicar copos si quedaron fuera de los márgenes tras encoger la ventana
      for (const flake of flakes) {
        if (flake.x > w + 20) flake.x = Math.random() * w;
        if (flake.y > h + 20) flake.y = Math.random() * h;
      }
    };

    const paint = () => {
      const { w, h } = sizeRef.current;
      if (!w || !h) return;

      ctx.clearRect(0, 0, w, h);

      // Paso 1: Fondo y capa media (renderizado ultra-rápido sin sombras)
      ctx.shadowBlur = 0;
      for (const flake of flakesRef.current) {
        if (flake.layer !== 2) {
          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
          ctx.fillStyle = CREAM(flake.opacity);
          ctx.fill();
        }
      }

      // Paso 2: Primer plano (con destello navideño tenue)
      ctx.shadowColor = "rgba(255, 253, 248, 0.5)";
      ctx.shadowBlur = 5;
      for (const flake of flakesRef.current) {
        if (flake.layer === 2) {
          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
          ctx.fillStyle = CREAM(flake.opacity);
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;
    };

    const scheduleFrame = () => {
      if (!isRunning) return;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(step);
    };

    const step = (now: number) => {
      if (!isRunning) return;
      rafId = null;

      const currentNow = typeof now === "number" && !isNaN(now) ? now : performance.now();
      const elapsed = currentNow - lastTimestamp;
      lastTimestamp = currentNow;

      // Delta-time normalizado a 60 FPS (~16.67ms por frame), protegido contra picos
      const dt = Math.min(Math.max(elapsed / 16.67, 0.2), 2.5);

      // Factor de velocidad: si el usuario tiene preferencia de movimiento reducido,
      // la nieve cae a un 60% de velocidad con vaivén suave para no incomodar
      const motionFactor = reducedMotionMode ? 0.6 : 1.0;

      const { w, h } = sizeRef.current;
      windTime += 0.005 * dt * motionFactor;

      // Brisa multivariable con doble oscilación armónica
      const baseWind = (Math.sin(windTime) * 0.45 + Math.sin(windTime * 0.4) * 0.22) * dt * motionFactor;

      const flakes = flakesRef.current;
      for (let i = 0; i < flakes.length; i++) {
        const flake = flakes[i];
        flake.phase += flake.swingSpeed * dt * motionFactor;

        // Desplazamiento vertical fluido
        flake.y += flake.speedY * dt * motionFactor;

        // Bamboleo horizontal con parallax (las capas cercanas reaccionan más a la brisa)
        const windWeight = flake.layer === 2 ? 1.25 : flake.layer === 1 ? 0.9 : 0.65;
        flake.x += Math.sin(flake.phase) * flake.swing * dt * motionFactor + baseWind * windWeight;

        // Ciclo infinito: cuando cruza la parte inferior o los bordes, reaparece sin cortes
        if (flake.y > h + flake.radius + 15) {
          flakes[i] = createFlake(w, h, false);
        } else if (flake.x > w + 25) {
          flake.x = -20;
        } else if (flake.x < -25) {
          flake.x = w + 20;
        }
      }

      paint();
      scheduleFrame();
    };

    // Inicializar dimensiones y copos
    resize();
    scheduleFrame();

    // Reanudación inmediata al cambiar tamaño, foco de ventana o visibilidad
    const handleResize = () => {
      resize();
      scheduleFrame();
    };

    const handleResume = () => {
      if (document.hidden) {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      } else {
        lastTimestamp = performance.now();
        scheduleFrame();
      }
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      reducedMotionMode = e.matches;
      scheduleFrame();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("focus", handleResume);
    window.addEventListener("pageshow", handleResume);
    document.addEventListener("visibilitychange", handleResume);

    if (mediaQuery && mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMotionChange);
    }

    return () => {
      isRunning = false;
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("focus", handleResume);
      window.removeEventListener("pageshow", handleResume);
      document.removeEventListener("visibilitychange", handleResume);

      if (mediaQuery && mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMotionChange);
      }

      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-30 pointer-events-none select-none block w-full h-full"
      aria-hidden="true"
    />
  );
}

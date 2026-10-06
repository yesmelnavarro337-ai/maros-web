"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Retardo en ms para entradas escalonadas. */
  delay?: number;
  /** Fracción del elemento visible para disparar la animación (0-1). */
  amount?: number;
}

/**
 * Scroll reveal global: fade-in-up cuando el elemento entra al viewport.
 * Usa IntersectionObserver, así funciona igual en móvil y escritorio, sin
 * depender de breakpoints ni de eventos de mouse. La regla global de
 * `prefers-reduced-motion` reduce la transición a instantánea.
 */
export function Reveal({ children, className, delay = 0, amount = 0.2 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: amount }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [amount]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transform-gpu will-change-transform transition-all duration-700 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
        className
      )}
    >
      {children}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "maros_visitor_count_cache";
const SESSION_FLAG = "maros_visited_session";

function SparkleAccent({ side = "left" }: { side?: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-[#FFF2C2] shrink-0 drop-shadow-[0_1px_4px_rgba(0,0,0,0.15)] animate-pulse"
      style={{ animationDuration: "3s" }}
      aria-hidden="true"
    >
      {/* 4-point diamond star in center */}
      <path
        d="M18 4C18 11.7 11.7 18 4 18C11.7 18 18 24.3 18 32C18 24.3 24.3 18 32 18C24.3 18 18 11.7 18 4Z"
        fill="currentColor"
      />
      {/* Radiating accent rays */}
      {isLeft ? (
        <>
          <path
            d="M8 8L4 4"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M8 28L4 32"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M5 18H1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <path
            d="M28 8L32 4"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M28 28L32 32"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M31 18H35"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // 1. Cargar caché previo para render instantáneo sin volver a 0
    let cachedCount: number | null = null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        cachedCount = parseInt(stored, 10);
        if (!isNaN(cachedCount) && cachedCount > 0) {
          setCount(cachedCount);
        }
      }
    } catch {}

    // 2. Incrementar si es nueva sesión, o sólo leer si ya visitó en la misma sesión
    const isNewSession = typeof window !== "undefined" && !sessionStorage.getItem(SESSION_FLAG);
    const method = isNewSession ? "POST" : "GET";

    fetch("/api/visitors", {
      method,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Status " + res.status);
        return res.json();
      })
      .then((data) => {
        if (typeof data.count === "number") {
          setCount(data.count);
          try {
            sessionStorage.setItem(SESSION_FLAG, "true");
            localStorage.setItem(STORAGE_KEY, String(data.count));
          } catch {}
        }
      })
      .catch((err) => {
        console.warn("No se pudo obtener contador de visitantes:", err);
        // Fallback al valor cacheado o base realista si está vacío
        if (cachedCount === null) {
          setCount(1251);
        }
      });
  }, []);

  // Formato estricto es-CO con separador de miles en puntos (ej: 1.251)
  const formattedCount = new Intl.NumberFormat("es-CO").format(count ?? 1251);

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 my-2 select-none">
      {/* Destello / Chispa dorada izquierda */}
      <SparkleAccent side="left" />

      {/* Cápsula / Pill Central */}
      <div className="flex flex-col items-center justify-center px-10 sm:px-14 py-2.5 sm:py-3 rounded-full border border-[#FFF5D6]/75 bg-black/10 backdrop-blur-xs shadow-inner">
        {/* Línea Superior: Corazón Rosa + Cifra en Negrita */}
        <div className="flex items-center justify-center gap-2 leading-none">
          {/* Corazón pastel suave */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="#FDB5BA"
            className="shrink-0 drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>

          {/* Número de visitas destacado */}
          <span className="font-sans text-2xl sm:text-3xl font-bold text-white tracking-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.25)]">
            {formattedCount}
          </span>
        </div>

        {/* Línea Inferior: Texto exacto en minúsculas */}
        <p className="font-sans text-xs sm:text-[13px] text-[#FFFDF7]/95 font-normal tracking-wide mt-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
          personitas que pasaron por aquí
        </p>
      </div>

      {/* Destello / Chispa dorada derecha */}
      <SparkleAccent side="right" />
    </div>
  );
}

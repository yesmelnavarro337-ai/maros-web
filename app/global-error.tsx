"use client";

export default function GlobalRootError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Maro&apos;s Pijamas no está disponible en este momento</h1>
            <p style={{ color: "#666", marginBottom: "1.5rem" }}>Intenta recargar la página en unos segundos.</p>
            <button
              onClick={reset}
              style={{ background: "#6B6832", color: "white", border: "none", borderRadius: "6px", padding: "0.6rem 1.2rem", cursor: "pointer" }}
            >
              Reintentar
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
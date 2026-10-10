import { NextResponse } from "next/server";
import { API_URL } from "@/lib/api/config";

export const dynamic = "force-dynamic";

/**
 * Proxy servidor→API (Maros.Api) del contador global de visitas.
 * La cifra vive en PostgreSQL y se gestiona con incremento atómico en la BD,
 * por lo que sobrevive reinicios del backend y despliegues multi-instancia.
 *
 * - GET /api/visitors          → visita nueva (+1)
 * - GET /api/visitors?peek=1   → solo lectura (sondeo pasivo cada 8 s)
 *
 * Se usa un proxy en vez de llamar al backend desde el navegador para evitar
 * CORS y no exponer la URL pública del API (mismo patrón que /api/audio).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const peek = searchParams.get("peek") === "1" || searchParams.get("peek") === "true";

  try {
    const res = await fetch(`${API_URL}/api/visitors?peek=${peek ? "true" : "false"}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ visitors: null });
    }
    const data = await res.json();
    return NextResponse.json({
      visitors: typeof data?.visitors === "number" ? data.visitors : null,
    });
  } catch (err) {
    console.error("Error consultando el contador de visitas en Maros.Api:", err);
    return NextResponse.json({ visitors: null });
  }
}
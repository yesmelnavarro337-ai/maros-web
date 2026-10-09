import { NextResponse } from "next/server";
import { API_URL } from "@/lib/api/config";

export const dynamic = "force-dynamic";

/**
 * Proxy servidor→API de las URLs de audio ambiental gestionadas desde
 * maros-admin (POST/GET /api/Settings/audio). Evita CORS en el cliente y
 * permite que el reproductor reproduzca los MP3 subidos desde el panel.
 */
export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/Settings/audio`, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ navidad: null, nosotros: null });
    }
    const data = await res.json();
    return NextResponse.json({
      navidad: data?.navidad ?? null,
      nosotros: data?.nosotros ?? null,
    });
  } catch {
    return NextResponse.json({ navidad: null, nosotros: null });
  }
}

import { NextResponse, type NextRequest } from "next/server";

// Caché en memoria del middleware (Edge Runtime no soporta IMemoryCache ni React.cache).
// Se actualiza como máximo una vez cada 5 minutos para no golpear el backend
// en cada petición de ruta (el middleware corre en cada navegación).
let _settingsCache: { maintenanceMode: boolean; ts: number } | null = null;
const SETTINGS_TTL_MS = 5 * 60 * 1000; // 5 minutos

async function getMaintenanceMode(apiUrl: string): Promise<boolean> {
  const now = Date.now();
  if (_settingsCache && now - _settingsCache.ts < SETTINGS_TTL_MS) {
    return _settingsCache.maintenanceMode;
  }
  const res = await fetch(`${apiUrl}/api/public/settings`, { cache: "no-store" });
  if (!res.ok) return false;
  const settings = await res.json();
  _settingsCache = { maintenanceMode: Boolean(settings.maintenanceMode), ts: now };
  return _settingsCache.maintenanceMode;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Excluir assets estáticos, archivos internos de Next.js, API pública y favicon
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  try {
    const isMaintenance = await getMaintenanceMode(apiUrl);

    if (isMaintenance && pathname !== "/mantenimiento") {
      return NextResponse.redirect(new URL("/mantenimiento", request.url));
    }

    if (!isMaintenance && pathname === "/mantenimiento") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (error) {
    console.error("Error al consultar settings en middleware:", error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

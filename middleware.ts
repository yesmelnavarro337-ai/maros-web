import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "https://maros-backend-pjvy.onrender.com";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/mantenimiento")) {
    return NextResponse.next();
  }

  try {
    const response = await fetch(`${API_URL}/api/public/settings`);

    if (response.ok) {
      const settings = await response.json();
      if (settings.maintenanceMode) {
        return NextResponse.rewrite(new URL("/mantenimiento", request.url));
      }
    }
  } catch {
    // Si el backend no responde, dejamos pasar la navegación normal en vez
    // de bloquear todo el sitio por un error de red temporal.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.png).*)"],
};
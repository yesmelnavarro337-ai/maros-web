import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware de maros-web.
 *
 * La verificación del modo de mantenimiento y la configuración global de la tienda
 * se gestiona a nivel de RootLayout (`app/layout.tsx`) con caché ISR (`revalidate = 300`)
 * e invalidación instantánea por tags (`tags: ["settings"]`).
 *
 * Para minimizar costos de CPU y consumo de Edge Middleware Invocations en Vercel
 * (plan Hobby), no se ejecuta middleware en rutas públicas.
 * El matcher se deja vacío ya que la tienda pública no requiere validación por request.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};

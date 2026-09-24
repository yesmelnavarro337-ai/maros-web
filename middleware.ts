import { NextResponse, type NextRequest } from "next/server";

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
    const res = await fetch(`${apiUrl}/api/public/settings`, {
      cache: "no-store",
    });

    if (res.ok) {
      const settings = await res.json();
      const isMaintenance = Boolean(settings.maintenanceMode);

      if (isMaintenance && pathname !== "/mantenimiento") {
        return NextResponse.redirect(new URL("/mantenimiento", request.url));
      }

      if (!isMaintenance && pathname === "/mantenimiento") {
        return NextResponse.redirect(new URL("/", request.url));
      }
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

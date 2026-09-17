import { revalidateTag, revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const secret =
      request.headers.get("x-revalidate-secret") ||
      request.nextUrl.searchParams.get("secret") ||
      body.secret;

    const expectedSecret = process.env.REVALIDATION_SECRET || "maros-secret-key";

    if (secret !== expectedSecret) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    const tag = body.tag || request.nextUrl.searchParams.get("tag");
    const path = body.path || request.nextUrl.searchParams.get("path");

    if (tag) {
      revalidateTag(tag, { expire: 0 });
    }
    if (path) {
      revalidatePath(path, "page");
    }

    // Si no se especifica tag/path o es 'all', revalidar tags y rutas principales de la tienda
    if ((!tag && !path) || tag === "all") {
      revalidateTag("categories", { expire: 0 });
      revalidateTag("products", { expire: 0 });
      revalidatePath("/", "page");
      revalidatePath("/catalogo", "page");
      revalidatePath("/colecciones", "page");
    }

    return NextResponse.json({
      revalidated: true,
      tag: tag || null,
      path: path || null,
      now: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "Error during revalidation" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const expectedSecret = process.env.REVALIDATION_SECRET || "maros-secret-key";

  if (secret !== expectedSecret) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const tag = request.nextUrl.searchParams.get("tag");
  const path = request.nextUrl.searchParams.get("path");

  if (tag) revalidateTag(tag, { expire: 0 });
  if (path) revalidatePath(path, "page");
  if (!tag && !path) {
    revalidateTag("categories", { expire: 0 });
    revalidateTag("products", { expire: 0 });
    revalidatePath("/", "page");
    revalidatePath("/catalogo", "page");
  }

  return NextResponse.json({
    revalidated: true,
    tag,
    path,
    now: Date.now(),
  });
}

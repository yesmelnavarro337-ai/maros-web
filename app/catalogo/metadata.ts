import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const rawParams = await searchParams;
  const page = Math.max(1, Number.parseInt(rawParams.page ?? "1", 10) || 1);

  return {
    ...buildMetadata({
      title: page > 1 ? `Catálogo — Página ${page}` : "Catálogo",
      description:
        "Explora nuestro catálogo completo de pijamas personalizadas — para mujer, hombre, niños, parejas y familia.",
      path: `/catalogo${page > 1 ? `?page=${page}` : ""}`,
    }),
    robots: page > 1 ? { index: false, follow: true } : undefined,
  };
}
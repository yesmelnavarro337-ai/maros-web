import type { MetadataRoute } from "next";
import { serverApiFetch } from "@/lib/api/server-fetch";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

interface ApiProductSlug {
  slug: string;
}

interface ApiCollectionId {
  id: string;
}

interface ApiBlogSlug {
  slug: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/catalogo`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/colecciones`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/galeria`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/nosotros`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/contacto`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/preguntas-frecuentes`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const [products, collections, blogPosts] = await Promise.all([
    serverApiFetch<ApiProductSlug[]>("products").catch(() => []),
    serverApiFetch<ApiCollectionId[]>("collection").catch(() => []),
    serverApiFetch<ApiBlogSlug[]>("blog").catch(() => []),
  ]);

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/productos/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const collectionRoutes: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${SITE_URL}/colecciones/${c.id}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((b) => ({
    url: `${SITE_URL}/blog/${b.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...productRoutes, ...collectionRoutes, ...blogRoutes];
}
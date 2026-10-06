import "server-only";
import { cache } from "react";
import { API_URL } from "./config";
import { throwIfError } from "./errors";

interface ServerFetchOptions {
  revalidateSeconds?: number;
  tags?: string[];
  cache?: RequestCache;
}

/**
 * Petición al servidor con soporte para deshabilitar caché (no-store)
 * para asegurar que las actualizaciones de maros-admin se reflejen
 * de forma inmediata en maros-web.
 */
const cachedServerFetch = cache(async (key: string) => {
  const parts = key.split("|");
  const path = parts[0];
  let revalidate = 0;
  let tags: string[] = [];
  let cacheMode: RequestCache | undefined = "no-store";

  for (let i = 1; i < parts.length; i++) {
    if (parts[i].startsWith("cache:")) {
      cacheMode = (parts[i].slice(6) as RequestCache) || "no-store";
    } else if (parts[i].startsWith("revalidate:")) {
      revalidate = Number(parts[i].slice(11));
    } else if (parts[i].startsWith("tags:")) {
      const rawTags = parts[i].slice(5);
      tags = rawTags ? rawTags.split(",") : [];
    }
  }

  const fetchInit: RequestInit =
    cacheMode === "no-store" || revalidate === 0
      ? { cache: "no-store" }
      : {
          next: {
            revalidate,
            ...(tags.length > 0 ? { tags } : {}),
          },
        };

  const response = await fetch(`${API_URL}/api/public/${path}`, fetchInit);

  await throwIfError(response);
  return response.json();
});

export function serverApiFetch<T>(path: string, options: ServerFetchOptions = {}): Promise<T> {
  const isProductOrCategoryPath = path.startsWith("products") || path.startsWith("categories");
  const defaultCache = isProductOrCategoryPath ? "no-store" : options.cache;
  const defaultRevalidate = isProductOrCategoryPath ? 0 : (options.revalidateSeconds ?? (defaultCache === "no-store" ? 0 : 60));

  const cacheMode = options.cache || defaultCache || "no-store";
  const revalidate = options.revalidateSeconds ?? defaultRevalidate;

  const cacheStr = cacheMode ? `cache:${cacheMode}` : "cache:no-store";
  const tagsStr = options.tags ? options.tags.join(",") : "";
  return cachedServerFetch(`${path}|revalidate:${revalidate}|${cacheStr}|tags:${tagsStr}`) as Promise<T>;
}
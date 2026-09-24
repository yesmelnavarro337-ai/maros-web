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
 * Dedup nativo de Next.js/React: el mismo path dentro del mismo render
 * comparte una única petición (p.ej. settings en layout + generateMetadata,
 * categories en catálogo + home). La caché de datos de Next (revalidate)
 * se encarga de la deduplicación entre renders.
 */
const cachedServerFetch = cache(async (key: string) => {
  const parts = key.split("|");
  const path = parts[0];
  let revalidate = 60;
  let tags: string[] = [];
  let cacheMode: RequestCache | undefined;

  for (let i = 1; i < parts.length; i++) {
    if (parts[i].startsWith("cache:")) {
      cacheMode = parts[i].slice(6) as RequestCache;
    } else if (parts[i].startsWith("revalidate:")) {
      revalidate = Number(parts[i].slice(11));
    } else if (parts[i].startsWith("tags:")) {
      const rawTags = parts[i].slice(5);
      tags = rawTags ? rawTags.split(",") : [];
    }
  }

  const fetchInit: RequestInit = cacheMode === "no-store" || revalidate === 0
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
  const revalidate = options.revalidateSeconds ?? (options.cache === "no-store" ? 0 : 60);
  const cacheStr = options.cache ? `cache:${options.cache}` : "";
  const tagsStr = options.tags ? options.tags.join(",") : "";
  return cachedServerFetch(`${path}|revalidate:${revalidate}|${cacheStr}|tags:${tagsStr}`) as Promise<T>;
}
import "server-only";
import { cache } from "react";
import { API_URL } from "./config";
import { throwIfError } from "./errors";

interface ServerFetchOptions {
  revalidateSeconds?: number;
  tags?: string[];
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

  for (let i = 1; i < parts.length; i++) {
    if (parts[i].startsWith("revalidate:")) {
      revalidate = Number(parts[i].slice(11));
    } else if (parts[i].startsWith("tags:")) {
      const rawTags = parts[i].slice(5);
      tags = rawTags ? rawTags.split(",") : [];
    }
  }

  const response = await fetch(`${API_URL}/api/public/${path}`, {
    next: {
      revalidate,
      ...(tags.length > 0 ? { tags } : {}),
    },
  });

  await throwIfError(response);
  return response.json();
});

export function serverApiFetch<T>(path: string, options: ServerFetchOptions = {}): Promise<T> {
  const revalidate = options.revalidateSeconds ?? 60;
  const tagsStr = options.tags ? options.tags.join(",") : "";
  return cachedServerFetch(`${path}|revalidate:${revalidate}|tags:${tagsStr}`) as Promise<T>;
}
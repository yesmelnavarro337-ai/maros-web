import "server-only";
import { cache } from "react";
import { API_URL } from "./config";
import { throwIfError } from "./errors";

interface ServerFetchOptions {
  revalidateSeconds?: number;
}

/**
 * Dedup nativo de Next.js/React: el mismo path dentro del mismo render
 * comparte una única petición (p.ej. settings en layout + generateMetadata,
 * categories en catálogo + home). La caché de datos de Next (revalidate)
 * se encarga de la deduplicación entre renders.
 */
const cachedServerFetch = cache(async (key: string) => {
  const separator = key.lastIndexOf("|revalidate:");
  const revalidate = separator === -1 ? 60 : Number(key.slice(separator + 12));
  const path = separator === -1 ? key : key.slice(0, separator);

  const response = await fetch(`${API_URL}/api/public/${path}`, {
    next: { revalidate },
  });

  await throwIfError(response);
  return response.json();
});

export function serverApiFetch<T>(path: string, options: ServerFetchOptions = {}): Promise<T> {
  const revalidate = options.revalidateSeconds ?? 60;
  return cachedServerFetch(`${path}|revalidate:${revalidate}`) as Promise<T>;
}
import { PUBLIC_API_URL } from "./config";
import { throwIfError } from "./errors";

interface ClientFetchOptions {
  method?: "GET" | "POST";
  body?: unknown;
}

export async function clientApiFetch<T>(path: string, options: ClientFetchOptions = {}): Promise<T> {
  const response = await fetch(`${PUBLIC_API_URL}/api/public/${path}`, {
    method: options.method ?? "GET",
    headers: options.body ? { "content-type": "application/json" } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  await throwIfError(response);
  return response.json();
}
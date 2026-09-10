import { API_URL } from "./config";
import { throwIfError } from "./errors";

interface ServerFetchOptions {
  revalidateSeconds?: number;
}

export async function serverApiFetch<T>(path: string, options: ServerFetchOptions = {}): Promise<T> {
  const response = await fetch(`${API_URL}/api/public/${path}`, {
    next: { revalidate: options.revalidateSeconds ?? 60 },
  });

  await throwIfError(response);
  return response.json();
}
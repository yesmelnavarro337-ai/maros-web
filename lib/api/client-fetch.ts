import { toast } from "sonner";
import { PUBLIC_API_URL } from "./config";
import { throwIfError } from "./errors";

interface ClientFetchOptions {
  method?: "GET" | "POST";
  body?: unknown;
}

export async function clientApiFetch<T>(path: string, options: ClientFetchOptions = {}): Promise<T> {
  let toastId: string | number | undefined;
  // Interceptor para avisar al usuario si la petición excede 5 segundos (Cold Start Render)
  const timer = setTimeout(() => {
    try {
      toastId = toast.info("Reconectando con el servidor...", {
        description: "Nuestro servidor se está inicializando. Gracias por tu paciencia.",
        duration: 9000,
      });
    } catch {
      // Entornos sin sonner activo
    }
  }, 5000);

  try {
    const response = await fetch(`${PUBLIC_API_URL}/api/public/${path}`, {
      method: options.method ?? "GET",
      headers: options.body ? { "content-type": "application/json" } : undefined,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    await throwIfError(response);
    return response.json();
  } finally {
    clearTimeout(timer);
    if (toastId !== undefined) {
      try {
        toast.dismiss(toastId);
      } catch {}
    }
  }
}
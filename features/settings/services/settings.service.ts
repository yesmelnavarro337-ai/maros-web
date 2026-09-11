import type { PublicSettings } from "../types";

export function buildWhatsAppHref(whatsappNumber: string, message?: string): string {
  const base = `https://wa.me/${whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export type { PublicSettings };
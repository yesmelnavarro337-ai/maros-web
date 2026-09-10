import { serverApiFetch } from "@/lib/api/server-fetch";
import type { PublicSettings } from "../types";

interface ApiPublicSettings {
  siteName: string;
  description: string;
  maintenanceMode: boolean;
  logoUrl?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  tikTok?: string | null;
  whatsappNumber: string;
  emailFromAddress?: string | null;
  legalTermsUrl?: string | null;
  legalPrivacyUrl?: string | null;
  legalReturnsPolicy?: string | null;
  seoMetaTitle?: string | null;
  seoMetaDescription?: string | null;
  seoSocialImageUrl?: string | null;
}

const FALLBACK_SETTINGS: PublicSettings = {
  siteName: "Maro's Pijamas",
  description: "Pijamas personalizadas hechas a mano con los mejores materiales.",
  maintenanceMode: false,
  whatsappNumber: "573001234567",
  contactEmail: "marospijamas@gmail.com",
};

export async function getPublicSettings(): Promise<PublicSettings> {
  try {
    const s = await serverApiFetch<ApiPublicSettings>("settings");
    return {
      siteName: s.siteName || FALLBACK_SETTINGS.siteName,
      description: s.description || FALLBACK_SETTINGS.description,
      maintenanceMode: s.maintenanceMode,
      logoUrl: s.logoUrl ?? undefined,
      instagram: s.instagram ?? undefined,
      facebook: s.facebook ?? undefined,
      tiktok: s.tikTok ?? undefined,
      whatsappNumber: (s.whatsappNumber || FALLBACK_SETTINGS.whatsappNumber).replace(/\D/g, ""),
      contactEmail: s.emailFromAddress || FALLBACK_SETTINGS.contactEmail,
      legalTermsUrl: s.legalTermsUrl ?? undefined,
      legalPrivacyUrl: s.legalPrivacyUrl ?? undefined,
      legalReturnsPolicy: s.legalReturnsPolicy ?? undefined,
      seoMetaTitle: s.seoMetaTitle ?? undefined,
      seoMetaDescription: s.seoMetaDescription ?? undefined,
      seoSocialImageUrl: s.seoSocialImageUrl ?? undefined,
    };
  } catch {
    // Si el backend no responde, la landing sigue funcionando con valores
    // de respaldo razonables en vez de romperse por completo.
    return FALLBACK_SETTINGS;
  }
}

export function buildWhatsAppHref(whatsappNumber: string, message?: string): string {
  const base = `https://wa.me/${whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}


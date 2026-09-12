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
  address: string;
  businessHours: string;
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
  address: "Mz 3 Casa 98 Urb. Doña Clara, Valledupar",
  businessHours: "Lunes a Sábado · 8:00 a.m. – 6:00 p.m.",
};

export async function getPublicSettings(): Promise<PublicSettings> {
  try {
    // FORZAR actualización en cada petición (sin cacheo)
    // Usamos fetch directo con cache: "no-store" para asegurar el modo mantenimiento
    // se refleja inmediatamente en el frontend
    const s = await fetch(new Request("/api/settings", { cache: "no-store" }), {
      credentials: "include"
    }).then(res => res.json());
    
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
      address: s.address || FALLBACK_SETTINGS.address,
      businessHours: s.businessHours || FALLBACK_SETTINGS.businessHours,
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
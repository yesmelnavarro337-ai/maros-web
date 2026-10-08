import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/features/layout/components/header";
import { AnnouncementBar } from "@/features/layout/components/announcement-bar";
import { Footer } from "@/features/layout/components/footer";
import { WhatsAppFloatButton } from "@/features/layout/components/whatsapp-float-button";
import { SnowEffect } from "@/components/shared/snow-effect";
import { AmbientAudioPlayer } from "@/components/shared/ambient-audio-player";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/features/cart/cart-context";
import { WishlistProvider } from "@/features/wishlist/wishlist-context";
import { getPublicSettings } from "@/features/settings/services/settings.server";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import { MaintenanceView } from "@/features/settings/components/maintenance-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"),
    title: {
      default: settings.seoMetaTitle || `${settings.siteName} — Pijamas personalizadas hechas a mano`,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.seoMetaDescription || settings.description,
    openGraph: {
      siteName: settings.siteName,
      locale: "es_CO",
      type: "website",
      images: settings.seoSocialImageUrl ? [{ url: settings.seoSocialImageUrl }] : undefined,
    },
    verification: {
      google: "SlT_wzDfVkvuOsy_lzg6OvJ20vDx0pjRm2cA0VQS3qQ",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getPublicSettings();

  if (settings.maintenanceMode) {
    return (
      <html lang="es" className="bg-background">
        <body className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen overflow-x-hidden`}>
          <MaintenanceView settings={settings} />
        </body>
      </html>
    );
  }

  return (
    <html lang="es" className="bg-background">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground min-h-screen overflow-x-hidden`}>
        <CartProvider>
          <WishlistProvider>
            {/* min-h-screen + flex-col adhiere el footer al fondo del viewport y
                evita el bloque blanco que aparecía debajo al hacer scroll en móvil. */}
            <div className="min-h-screen flex flex-col overflow-x-hidden">
              <AnnouncementBar />
              <Header settings={settings} />
              <main className="flex-1">{children}</main>
              <Footer settings={settings} />
              <WhatsAppFloatButton settings={settings} />
            </div>
            {/* Nieve navideña sutil: capa fija z-30, no intercepta clics ni scroll */}
            <SnowEffect />
            {/* Reproductor de audio ambiental persistente */}
            <AmbientAudioPlayer />
          </WishlistProvider>
        </CartProvider>
        <JsonLd
          data={organizationJsonLd({
            name: settings.siteName,
            description: settings.description,
            logoUrl: settings.logoUrl,
            whatsappNumber: settings.whatsappNumber,
            instagram: settings.instagram,
            facebook: settings.facebook,
            tiktok: settings.tiktok,
          })}
        />
        <JsonLd
          data={websiteJsonLd(settings.siteName, settings.seoMetaDescription || settings.description)}
        />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

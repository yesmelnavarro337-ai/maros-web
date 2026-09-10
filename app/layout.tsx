import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/features/layout/components/header";
import { AnnouncementBar } from "@/features/layout/components/announcement-bar";
import { Footer } from "@/features/layout/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { getPublicSettings } from "@/features/settings/services/settings.service";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["500", "600", "700"],
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
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getPublicSettings();

  return (
    <html lang="es">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <AnnouncementBar />
        <Header settings={settings} />
        <main>{children}</main>
        <Footer settings={settings} />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://maros-pijamas.vercel.app";

interface BuildMetadataParams {
  title: string;
  description: string;
  path: string;
  image?: string;
}

export function buildMetadata({ title, description, path, image }: BuildMetadataParams): Metadata {
  const url = `${SITE_URL}${path}`;

  let absoluteImageUrl: string | undefined = undefined;
  if (image) {
    if (image.startsWith("http://") || image.startsWith("https://")) {
      absoluteImageUrl = image;
    } else if (image.startsWith("/")) {
      absoluteImageUrl = `${SITE_URL}${image}`;
    } else {
      absoluteImageUrl = cloudinaryUrl(image);
    }
  }

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Maro's Pijamas",
      locale: "es_CO",
      type: "website",
      images: absoluteImageUrl ? [{ url: absoluteImageUrl, width: 1200, height: 630, alt: title }] : undefined,
    },
    twitter: {
      card: absoluteImageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: absoluteImageUrl ? [absoluteImageUrl] : undefined,
    },
  };
}
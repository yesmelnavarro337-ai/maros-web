import { serverApiFetch } from "@/lib/api/server-fetch";
import type { HeaderMedia, PageHeader, PageKey } from "../types";

interface ApiHeaderMedia {
  url: string;
  mediaType: string;
  order: number;
}

interface ApiPageHeader {
  pageKey: string;
  title: string;
  subtitle: string;
  backgroundImageUrl?: string | null;
  primaryButtonText?: string | null;
  primaryButtonLink?: string | null;
  secondaryButtonText?: string | null;
  secondaryButtonLink?: string | null;
  textColor: string;
  overlayOpacity: number;
  media?: ApiHeaderMedia[] | null;
}

function adaptMedia(media?: ApiHeaderMedia[] | null): HeaderMedia[] {
  if (!media?.length) return [];
  return media
    .filter((m) => m.url)
    .sort((a, b) => a.order - b.order)
    .map((m, index) => ({
      url: m.url,
      mediaType: m.mediaType === "video" ? ("video" as const) : ("image" as const),
      order: index,
    }));
}

function adaptPageHeader(h: ApiPageHeader): PageHeader {
  return {
    pageKey: h.pageKey as PageKey,
    title: h.title,
    subtitle: h.subtitle,
    backgroundImage: h.backgroundImageUrl ?? undefined,
    primaryButtonText: h.primaryButtonText ?? undefined,
    primaryButtonLink: h.primaryButtonLink ?? undefined,
    secondaryButtonText: h.secondaryButtonText ?? undefined,
    secondaryButtonLink: h.secondaryButtonLink ?? undefined,
    textColor: h.textColor,
    overlayOpacity: h.overlayOpacity,
    media: adaptMedia(h.media),
  };
}

export async function getPageHeaders(): Promise<PageHeader[]> {
  const headers = await serverApiFetch<ApiPageHeader[]>("page-headers");
  return headers.map(adaptPageHeader);
}

export async function getPageHeader(pageKey: PageKey): Promise<PageHeader | undefined> {
  const headers = await getPageHeaders();
  return headers.find((h) => h.pageKey === pageKey);
}
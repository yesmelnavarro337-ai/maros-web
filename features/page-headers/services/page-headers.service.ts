import { serverApiFetch } from "@/lib/api/server-fetch";
import type { PageHeader, PageKey } from "../types";

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
import { serverApiFetch } from "@/lib/api/server-fetch";
import type { BannerItem } from "../types";

interface ApiBanner {
  title: string;
  imageUrl?: string | null;
  linkUrl: string;
  position: string;
}

function adaptBanner(b: ApiBanner, index: number): BannerItem {
  return {
    id: `${b.position}-${index}`,
    title: b.title,
    image: b.imageUrl ?? undefined,
    linkHref: b.linkUrl || "/catalogo",
  };
}

export async function getActiveBanners(position: string): Promise<BannerItem[]> {
  const banners = await serverApiFetch<ApiBanner[]>(`banners?position=${encodeURIComponent(position)}`);
  return banners.map(adaptBanner);
}
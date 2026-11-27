import { serverApiFetch } from "@/lib/api/server-fetch";
import { BlackDaysAnnouncementBar } from "@/features/promotions/components/black-days-announcement-bar";

interface ApiSeasonPublic {
  name: string;
  ctaLink: string;
}

export async function AnnouncementBar() {
  const season = await serverApiFetch<ApiSeasonPublic | null>("season/active").catch(() => null);

  return (
    <BlackDaysAnnouncementBar
      seasonName={season?.name}
      seasonCtaHref={season?.ctaLink || undefined}
    />
  );
}

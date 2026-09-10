import { serverApiFetch } from "@/lib/api/server-fetch";
import { DismissibleAnnouncementBar } from "./dismissible-announcement-bar";

interface ApiSeasonPublic {
  name: string;
  ctaLink: string;
}

export async function AnnouncementBar() {
  const season = await serverApiFetch<ApiSeasonPublic | null>("season/active").catch(() => null);

  if (!season) return null;

  return (
    <DismissibleAnnouncementBar
      message={`🎁 Colección ${season.name} — Diseña pijamas únicas para quienes más amas ✨`}
      ctaLabel="Ver colección"
      ctaHref={season.ctaLink || "/colecciones"}
    />
  );
}

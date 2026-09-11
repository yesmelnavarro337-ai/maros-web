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
      message={
        <>
          <span className="font-medium uppercase tracking-wide text-brand-gold-foreground">
            Colección {season.name}
          </span>
          <span className="hidden sm:inline italic text-brand-gold-foreground/85">
            — Diseña pijamas únicas para quienes más amas
          </span>
        </>
      }
      ctaLabel="Ver colección"
      ctaHref={season.ctaLink || "/colecciones"}
    />
  );
}
"use client";

import { DismissibleAnnouncementBar } from "@/features/layout/components/dismissible-announcement-bar";
import { useBlackDaysCountdown } from "./black-days-countdown-provider";
import { BlackDaysTopBanner } from "./black-days-top-banner";

interface BlackDaysAnnouncementBarProps {
  seasonName?: string;
  seasonCtaHref?: string;
}

export function BlackDaysAnnouncementBar({ seasonName, seasonCtaHref }: BlackDaysAnnouncementBarProps) {
  const { isActive } = useBlackDaysCountdown();

  if (!isActive) {
    if (!seasonName) return null;

    return (
      <DismissibleAnnouncementBar
        message={
          <>
            <span className="font-medium uppercase tracking-wide text-brand-gold-foreground">
              Colección {seasonName}
            </span>
            <span className="hidden sm:inline italic text-brand-gold-foreground/85">
              — Diseña pijamas únicas para quienes más amas
            </span>
          </>
        }
        ctaLabel="Ver colección"
        ctaHref={seasonCtaHref || "/colecciones"}
      />
    );
  }

  return <BlackDaysTopBanner />;
}

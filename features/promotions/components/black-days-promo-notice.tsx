"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { BLACK_DAYS_MESSAGE } from "@/lib/promotions/black-days";
import { BlackDaysCountdown } from "./black-days-countdown";
import { useBlackDaysCountdown } from "./black-days-countdown-provider";

export function BlackDaysPromoNotice({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  const { isActive } = useBlackDaysCountdown();

  if (!isActive) return null;

  return (
    <div
      className={`rounded-xl border border-primary/25 bg-primary/5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 ${
        compact ? "px-3 py-2" : "px-4 py-3"
      } ${className}`}
    >
      <span className="inline-flex items-center gap-1.5 font-semibold text-foreground text-xs sm:text-sm">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        {BLACK_DAYS_MESSAGE}
      </span>
      <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
        <BlackDaysCountdown compact={compact} />
        <Link
          href="/productos"
          className="text-xs font-semibold text-primary underline underline-offset-2 hover:opacity-80 whitespace-nowrap"
        >
          Ver productos →
        </Link>
      </span>
    </div>
  );
}

"use client";

import { formatCountdownPart } from "@/lib/promotions/black-days";
import { useBlackDaysCountdown } from "./black-days-countdown-provider";

interface TimeUnitProps {
  value: number;
  label: string;
}

function TimeUnit({ value, label }: TimeUnitProps) {
  return (
    <span className="inline-flex items-baseline gap-0.5 whitespace-nowrap">
      <span className="font-mono font-bold tabular-nums">{formatCountdownPart(value)}</span>
      <span className="opacity-75">{label}</span>
    </span>
  );
}

export function BlackDaysCountdown({ compact = false }: { compact?: boolean }) {
  const countdown = useBlackDaysCountdown();

  if (!countdown.isActive) return null;

  const formatted = `${formatCountdownPart(countdown.days)}d ${formatCountdownPart(countdown.hours)}h ${formatCountdownPart(countdown.minutes)}m ${formatCountdownPart(countdown.seconds)}s`;

  return (
    <span
      className={`inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 font-medium tabular-nums ${
        compact ? "text-[11px]" : "text-xs sm:text-sm"
      }`}
      aria-label={`Tiempo restante de Black Days: ${formatted}`}
    >
      <TimeUnit value={countdown.days} label="días" />
      <TimeUnit value={countdown.hours} label="horas" />
      <TimeUnit value={countdown.minutes} label="minutos" />
      <TimeUnit value={countdown.seconds} label="segundos" />
    </span>
  );
}

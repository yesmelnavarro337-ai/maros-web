"use client";

import { createContext, useContext } from "react";
import type { BlackDaysCountdown } from "@/lib/promotions/black-days";
import { useCountdown } from "../hooks/use-countdown";

const BlackDaysCountdownContext = createContext<BlackDaysCountdown | null>(null);

export function BlackDaysCountdownProvider({
  initiallyActive,
  children,
}: {
  initiallyActive: boolean;
  children: React.ReactNode;
}) {
  const countdown = useCountdown(initiallyActive);

  return (
    <BlackDaysCountdownContext.Provider value={countdown}>
      {children}
    </BlackDaysCountdownContext.Provider>
  );
}

export function useBlackDaysCountdown(): BlackDaysCountdown {
  const countdown = useContext(BlackDaysCountdownContext);
  if (!countdown) {
    throw new Error("useBlackDaysCountdown debe usarse dentro de BlackDaysCountdownProvider");
  }
  return countdown;
}

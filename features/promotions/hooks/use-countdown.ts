"use client";

import { useEffect, useState } from "react";
import {
  BLACK_DAYS_END_MS,
  BLACK_DAYS_START_MS,
  getBlackDaysCountdown,
  type BlackDaysCountdown,
} from "@/lib/promotions/black-days";

export function useCountdown(initiallyActive = true): BlackDaysCountdown {
  const [countdown, setCountdown] = useState<BlackDaysCountdown>(() =>
    getBlackDaysCountdown(initiallyActive ? BLACK_DAYS_START_MS : BLACK_DAYS_END_MS + 1)
  );

  useEffect(() => {
    const update = () => setCountdown(getBlackDaysCountdown(Date.now()));
    update();
    const intervalId = window.setInterval(update, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  return countdown;
}

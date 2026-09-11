"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

interface DismissibleAnnouncementBarProps {
  message: React.ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
}

export function DismissibleAnnouncementBar({ message, ctaLabel, ctaHref }: DismissibleAnnouncementBarProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-brand-gold text-brand-gold-foreground text-sm border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-center gap-3 relative">
        <span className="text-center">{message}</span>
        {ctaLabel && ctaHref && (
          <Link href={ctaHref} className="underline underline-offset-2 whitespace-nowrap hover:opacity-80">
            {ctaLabel} →
          </Link>
        )}
        <button
          onClick={() => setVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70"
          aria-label="Cerrar anuncio"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
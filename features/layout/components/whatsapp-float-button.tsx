"use client";

import { FaWhatsapp } from "react-icons/fa6";
import { buildWhatsAppHref } from "@/features/settings/services/settings.service";
import type { PublicSettings } from "@/features/settings/types";

export function WhatsAppFloatButton({ settings }: { settings: PublicSettings }) {
  const href = buildWhatsAppHref(
    settings.whatsappNumber,
    "¡Hola! Me interesa hacer un pedido de pijamas personalizadas."
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-108 active:scale-95 hover:bg-[#1ebe5b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]"
    >
      <FaWhatsapp className="h-6 w-6 sm:h-7 sm:w-7" />
    </a>
  );
}
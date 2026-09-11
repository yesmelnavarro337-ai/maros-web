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
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-110 hover:bg-[#1ebe5b]"
    >
      <FaWhatsapp className="h-7 w-7" />
    </a>
  );
}
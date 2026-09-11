import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { mainNavLinks, footerHelpLinks } from "../config/navigation";
import { buildWhatsAppHref } from "@/features/settings/services/settings.service";
import type { PublicSettings } from "@/features/settings/types";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

function formatPhone(digits: string): string {
  if (digits.length === 12 && digits.startsWith("57")) {
    return `+57 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return `+${digits}`;
}

export function Footer({ settings }: { settings: PublicSettings }) {
  const whatsappHref = buildWhatsAppHref(settings.whatsappNumber);

  const footerNav = mainNavLinks.filter((link) => link.href !== "/");

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Image
              src={cloudinaryUrl(settings.logoUrl || "/logo.png")}
              alt={settings.siteName}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="leading-tight">
              <p className="font-heading text-lg text-primary-foreground">MARO&apos;S</p>
              <p className="text-[9px] tracking-widest text-primary-foreground/70 -mt-0.5">PIJAMAS</p>
            </div>
          </div>
          <p className="text-sm text-primary-foreground/80 leading-relaxed">{settings.description}</p>
          <div className="flex items-center gap-3">
            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-full bg-primary-foreground/10 p-2 hover:bg-primary-foreground/20 transition-colors"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
            )}
            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="rounded-full bg-primary-foreground/10 p-2 hover:bg-primary-foreground/20 transition-colors"
              >
                <FaFacebook className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-4 opacity-90">Navegación</h3>
          <ul className="flex flex-col gap-2.5">
            {footerNav.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-4 opacity-90">Ayuda y políticas</h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            {footerHelpLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="opacity-80 hover:opacity-100 transition-opacity">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-4 opacity-90">Contacto</h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 opacity-80 hover:opacity-100 transition-opacity">
                <Phone className="h-4 w-4 shrink-0" />
                {formatPhone(settings.whatsappNumber)}
              </a>
            </li>
            <li className="flex items-start gap-2.5 opacity-80">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
              {settings.address}
            </li>
            <li className="flex items-center gap-2.5 opacity-80">
              <Mail className="h-4 w-4 shrink-0" />
              {settings.contactEmail}
            </li>
            <li className="flex items-start gap-2.5 opacity-80">
              <Clock className="h-4 w-4 shrink-0 mt-0.5" />
              {settings.businessHours}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs opacity-75">
          <span>© {new Date().getFullYear()} {settings.siteName}. Todos los derechos reservados.</span>
          <span>Diseñado con ♥ para ti</span>
        </div>
      </div>
    </footer>
  );
}
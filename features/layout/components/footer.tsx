import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
    <footer className="bg-brand-gold text-brand-gold-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* =========================================================================
            DESKTOP FOOTER (>= 1024px): 4 Columnas
            ========================================================================= */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-10">
          
          {/* Columna 1: Marca, Descripción y Redes */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <Image
                src={cloudinaryUrl(settings.logoUrl || "/logo.png")}
                alt={settings.siteName}
                width={40}
                height={40}
                className="rounded-full ring-2 ring-brand-gold-foreground/30"
              />
              <div className="leading-tight">
                <p className="font-heading text-lg text-brand-gold-foreground tracking-wide">MARO&apos;S</p>
                <p className="text-[9px] tracking-widest text-brand-gold-foreground/75 -mt-0.5">PIJAMAS</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-brand-gold-foreground/85 leading-relaxed max-w-xs">
              {settings.description || "Pijamas personalizadas que cuentan historias, hechas a mano con amor en Colombia."}
            </p>

            <div className="flex items-center gap-3 pt-2">
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="rounded-full bg-brand-gold-foreground/15 p-2.5 hover:bg-brand-gold-foreground/30 text-brand-gold-foreground transition-all duration-300"
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
                  className="rounded-full bg-brand-gold-foreground/15 p-2.5 hover:bg-brand-gold-foreground/30 text-brand-gold-foreground transition-all duration-300"
                >
                  <FaFacebook className="h-4 w-4" />
                </a>
              )}
              {settings.tiktok && (
                <a
                  href={settings.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="rounded-full bg-brand-gold-foreground/15 p-2.5 hover:bg-brand-gold-foreground/30 text-brand-gold-foreground transition-all duration-300"
                >
                  <FaTiktok className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Columna 2: Navegación */}
          <div>
            <h3 className="font-heading text-base text-brand-gold-foreground font-medium mb-4 tracking-wide opacity-95">
              Navegación
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
              {footerNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-brand-gold-foreground/80 hover:text-brand-gold-foreground hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Ayuda y Políticas */}
          <div>
            <h3 className="font-heading text-base text-brand-gold-foreground font-medium mb-4 tracking-wide opacity-95">
              Ayuda y políticas
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
              {footerHelpLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-brand-gold-foreground/80 hover:text-brand-gold-foreground hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="font-heading text-base text-brand-gold-foreground font-medium mb-4 tracking-wide opacity-95">
              Contacto
            </h3>
            <ul className="flex flex-col gap-3 text-xs sm:text-sm text-brand-gold-foreground/85">
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:opacity-100 transition-opacity"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{formatPhone(settings.whatsappNumber)}</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{settings.contactEmail}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{settings.businessHours}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* =========================================================================
            MOBILE FOOTER (< 1024px): Acordeones con Color Dorado Original
            ========================================================================= */}
        <div className="lg:hidden flex flex-col gap-6">
          
          {/* Cabecera de Marca en Móvil */}
          <div className="flex flex-col items-center text-center gap-3 pb-4 border-b border-brand-gold-foreground/15">
            <div className="flex items-center gap-2">
              <Image
                src={cloudinaryUrl(settings.logoUrl || "/logo.png")}
                alt={settings.siteName}
                width={40}
                height={40}
                className="rounded-full ring-2 ring-brand-gold-foreground/30"
              />
              <div className="leading-tight text-left">
                <p className="font-heading text-lg text-brand-gold-foreground">MARO&apos;S</p>
                <p className="text-[9px] tracking-widest text-brand-gold-foreground/75 -mt-0.5">PIJAMAS</p>
              </div>
            </div>

            <p className="text-xs text-brand-gold-foreground/85 max-w-xs leading-relaxed">
              {settings.description || "Pijamas que cuentan historias."}
            </p>

            <div className="flex items-center gap-3 mt-1">
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="rounded-full bg-brand-gold-foreground/15 p-2 text-brand-gold-foreground hover:bg-brand-gold-foreground/30 transition-colors"
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
                  className="rounded-full bg-brand-gold-foreground/15 p-2 text-brand-gold-foreground hover:bg-brand-gold-foreground/30 transition-colors"
                >
                  <FaFacebook className="h-4 w-4" />
                </a>
              )}
              {settings.tiktok && (
                <a
                  href={settings.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="rounded-full bg-brand-gold-foreground/15 p-2 text-brand-gold-foreground hover:bg-brand-gold-foreground/30 transition-colors"
                >
                  <FaTiktok className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Acordeones para Móvil */}
          <Accordion type="single" collapsible className="w-full">
            
            <AccordionItem value="nav" className="border-b border-brand-gold-foreground/15">
              <AccordionTrigger className="text-sm font-heading font-medium text-brand-gold-foreground py-3.5 hover:no-underline">
                Navegación
              </AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col gap-2.5 pt-1 pb-3 text-xs text-brand-gold-foreground/85">
                  {footerNav.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="hover:underline transition-all">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="help" className="border-b border-brand-gold-foreground/15">
              <AccordionTrigger className="text-sm font-heading font-medium text-brand-gold-foreground py-3.5 hover:no-underline">
                Ayuda y políticas
              </AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col gap-2.5 pt-1 pb-3 text-xs text-brand-gold-foreground/85">
                  {footerHelpLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="hover:underline transition-all">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="contact" className="border-b border-brand-gold-foreground/15">
              <AccordionTrigger className="text-sm font-heading font-medium text-brand-gold-foreground py-3.5 hover:no-underline">
                Contacto
              </AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col gap-3 pt-1 pb-3 text-xs text-brand-gold-foreground/85">
                  <li>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:underline transition-all"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>{formatPhone(settings.whatsappNumber)}</span>
                    </a>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 mt-0.5" />
                    <span>{settings.address}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    <span>{settings.contactEmail}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="h-3.5 w-3.5 mt-0.5" />
                    <span>{settings.businessHours}</span>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

          </Accordion>

        </div>

      </div>

      {/* BARRA INFERIOR DE COPYRIGHT */}
      <div className="border-t border-brand-gold-foreground/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-gold-foreground/80">
          <span>© {new Date().getFullYear()} {settings.siteName}. Todos los derechos reservados.</span>
          <span className="flex items-center gap-1 font-medium">
            Hecho con ♥ para ti
          </span>
        </div>
      </div>
    </footer>
  );
}
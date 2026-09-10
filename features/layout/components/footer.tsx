import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { Phone, Mail, MapPin } from "lucide-react";
import { mainNavLinks } from "../config/navigation";
import { buildWhatsAppHref } from "@/features/settings/services/settings.service";
import type { PublicSettings } from "@/features/settings/types";

export function Footer({ settings }: { settings: PublicSettings }) {
  const whatsappHref = buildWhatsAppHref(settings.whatsappNumber);

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="text-sm font-medium mb-3 opacity-90">Navegación</h3>
          <ul className="flex flex-col gap-2">
            {mainNavLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

       <div>
  <h3 className="text-sm font-medium mb-3 opacity-90">Ayuda</h3>
  <ul className="flex flex-col gap-2 text-sm">
    <li>
      <Link href="/preguntas-frecuentes" className="opacity-80 hover:opacity-100 transition-opacity">
        Preguntas frecuentes
      </Link>
    </li>
    <li>
      <Link href="/envios" className="opacity-80 hover:opacity-100 transition-opacity">
        Envíos y entregas
      </Link>
    </li>
    <li>
      <Link href="/devoluciones" className="opacity-80 hover:opacity-100 transition-opacity">
        Cambios y devoluciones
      </Link>
    </li>
    {settings.legalTermsUrl && (
      <li>
        <a href={settings.legalTermsUrl} target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
          Términos y condiciones
        </a>
      </li>
    )}
    {settings.legalPrivacyUrl && (
      <li>
        <a href={settings.legalPrivacyUrl} target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
          Políticas de privacidad
        </a>
      </li>
    )}
  </ul>
</div>

        <div>
          <h3 className="text-sm font-medium mb-3 opacity-90">Información</h3>
          <ul className="flex flex-col gap-2 text-sm opacity-80">
            <li>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-100">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                +{settings.whatsappNumber}
              </a>
            </li>
            {/* Dirección y horario: contenido fijo de marca — sin campo
                equivalente en Configuración, mismo criterio que "Nosotros". */}
            <li className="flex items-start gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              Mz 3 Casa 98 Urb. Doña Clara, Valledupar, Colombia
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              {settings.contactEmail}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3 opacity-90">Síguenos</h3>
          <div className="flex items-center gap-3">
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="opacity-80 hover:opacity-100 transition-opacity">
                <FaInstagram className="h-5 w-5" />
              </a>
            )}
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="opacity-80 hover:opacity-100 transition-opacity">
                <FaFacebook className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs opacity-75">
          <div className="flex items-center gap-2">
            <Image src={settings.logoUrl || "/logo.png"} alt={settings.siteName} width={24} height={24} className="rounded-full" />
            <span>© {new Date().getFullYear()} {settings.siteName}. Todos los derechos reservados.</span>
          </div>
          <span>Diseñado con ♥ para ti</span>
        </div>
      </div>
    </footer>
  );
}
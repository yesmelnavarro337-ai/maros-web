import { MessageCircle, MapPin, Clock, Mail } from "lucide-react";
import { ContactForm } from "@/features/contact/components/contact-form";
import { getPublicSettings, buildWhatsAppHref } from "@/features/settings/services/settings.service";

function formatPhone(digits: string): string {
  if (digits.length === 12 && digits.startsWith("57")) {
    return `+57 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return `+${digits}`;
}

export default async function ContactoPage() {
  const settings = await getPublicSettings();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-xs text-muted-foreground mb-6">
        Inicio / <span className="text-foreground">Contacto</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h1 className="font-heading text-3xl text-foreground mb-1">Escríbenos o visítanos</h1>
          <p className="text-muted-foreground mb-6">
            Estamos aquí para ayudarte con cualquier duda sobre tu pedido.
          </p>

          <div className="flex flex-col gap-4">
            <a
              href={buildWhatsAppHref(settings.whatsappNumber, "¡Hola! Tengo una consulta.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3"
            >
              <div className="rounded-full bg-secondary p-2 shrink-0">
                <MessageCircle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground">{formatPhone(settings.whatsappNumber)}</p>
                <p className="text-xs text-muted-foreground">WhatsApp</p>
              </div>
            </a>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-secondary p-2 shrink-0">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground">{settings.address}</p>
                <p className="text-xs text-muted-foreground">Dirección</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-secondary p-2 shrink-0">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground">{settings.businessHours}</p>
                <p className="text-xs text-muted-foreground">Horario de atención</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-secondary p-2 shrink-0">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground">{settings.contactEmail}</p>
                <p className="text-xs text-muted-foreground">Correo electrónico</p>
              </div>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
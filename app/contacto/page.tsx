import type { Metadata } from "next";
import { MessageCircle, MapPin, Clock, Mail } from "lucide-react";
import { ContactForm } from "@/features/contact/components/contact-form";
import { buildWhatsAppHref } from "@/features/settings/services/settings.service";
import { getPublicSettings } from "@/features/settings/services/settings.server";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Contacto",
    description:
      "Escríbenos o visítanos — estamos aquí para ayudarte con cualquier duda sobre tu pedido de pijamas personalizadas.",
    path: "/contacto",
  }),
};

const contactItems = [
  { key: "whatsappNumber" as const, icon: MessageCircle, label: "WhatsApp" },
  { key: "address" as const, icon: MapPin, label: "Dirección" },
  { key: "businessHours" as const, icon: Clock, label: "Horario de atención" },
  { key: "contactEmail" as const, icon: Mail, label: "Correo electrónico" },
];

export default async function ContactoPage() {
  const settings = await getPublicSettings();

  return (
    <div className="bg-brand-ivory">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <nav className="text-xs text-muted-foreground mb-6">
          Inicio / <span className="text-brand-dark-olive font-medium">Contacto</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-start">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-brand-olive-gold mb-3">
              Hablemos
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl text-brand-dark-olive leading-tight">
              Estamos aquí para ayudarte
            </h1>
            <p className="text-muted-foreground mt-3 leading-relaxed">
              ¿Dudas sobre tu pedido, una cotización o una idea especial? Escríbenos y te
              responderemos lo antes posible.
            </p>

            <div className="flex flex-col gap-4 mt-8">
              {contactItems.map((item) => {
                const Icon = item.icon;
                const value = settings[item.key];
                const href =
                  item.key === "whatsappNumber"
                    ? buildWhatsAppHref(settings.whatsappNumber, "¡Hola! Tengo una consulta.")
                    : item.key === "contactEmail"
                      ? `mailto:${settings.contactEmail}`
                      : undefined;

                const content = (
                  <>
                    <div className="rounded-full bg-brand-olive-gold/15 p-2 shrink-0">
                      <Icon className="h-4 w-4 text-brand-olive" />
                    </div>
                    <div>
                      <p className="text-sm text-brand-dark-olive font-medium">{value}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  </>
                );

                return href ? (
                  <a
                    key={item.key}
                    href={href}
                    target={item.key === "whatsappNumber" ? "_blank" : undefined}
                    rel={item.key === "whatsappNumber" ? "noopener noreferrer" : undefined}
                    className="flex items-start gap-3 group"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={item.key} className="flex items-start gap-3">
                    {content}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 rounded-xl border border-brand-olive-gold/30 bg-white/60 p-5">
              <p className="text-xs text-brand-olive font-medium uppercase tracking-wide mb-1.5">
                ¿Algo urgente?
              </p>
              <p className="text-sm text-muted-foreground">
                Escríbenos al WhatsApp y te atenderemos directamente, sin intermediarios.
              </p>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </div>
  );
}
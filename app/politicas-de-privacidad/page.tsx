import type { Metadata } from "next";
import { Lock, Mail } from "lucide-react";
import { LegalShell } from "@/features/legal/components/legal-shell";
import { LegalSection } from "@/features/legal/components/legal-section";
import { LegalCallout } from "@/features/legal/components/legal-callout";
import { ContactCta } from "@/features/legal/components/contact-cta";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { getPublicSettings } from "@/features/settings/services/settings.server";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Políticas de privacidad",
    description:
      "Conoce cómo Maro's Pijamas recopila, usa y protege tus datos personales al usar nuestro sitio web.",
    path: "/politicas-de-privacidad",
  });
}

const toc = [
  { id: "responsable", label: "Responsable del tratamiento" },
  { id: "datos", label: "Datos que recopilamos" },
  { id: "uso", label: "Uso de la información" },
  { id: "compartir", label: "Compartir información" },
  { id: "derechos", label: "Derechos del titular" },
  { id: "seguridad", label: "Seguridad de los datos" },
  { id: "enlaces", label: "Enlaces a sitios externos" },
  { id: "contacto", label: "Contacto" },
];

export default async function PoliticasDePrivacidadPage() {
  const settings = await getPublicSettings();

  return (
    <LegalShell
      kicker="Legal"
      title="Políticas de privacidad"
      description={
        `En ${settings.siteName} respetamos tu privacidad y tratamos tus datos personales de forma transparente y segura.`
      }
      toc={toc}
    >
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Inicio", href: "/" },
          { label: "Políticas de privacidad", href: "/politicas-de-privacidad" },
        ])}
      />

      <LegalSection id="responsable" title="Responsable del tratamiento">
        <p>
          {settings.siteName} es el responsable del tratamiento de los datos personales que
          recopilamos a través de este sitio web. Nuestros datos de contacto:{" "}
          <span className="font-medium text-foreground">{settings.address}</span>, correo{" "}
          <span className="font-medium text-foreground">{settings.contactEmail}</span> y WhatsApp{" "}
          <span className="font-medium text-foreground">{settings.whatsappNumber}</span>.
        </p>
      </LegalSection>

      <LegalSection id="datos" title="Datos que recopilamos">
        <p>
          Recopilamos únicamente la información necesaria para atender tus pedidos y consultas:
          nombre, datos de contacto (correo, teléfono/WhatsApp), ciudad de entrega y los detalles de
          personalización que nos compartes (tallas, nombres, bordados y preferencias de diseño).
        </p>
      </LegalSection>

      <LegalSection id="uso" title="Uso de la información">
        <p>Usamos tus datos para:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Elaborar, confirmar y entregar tus pedidos personalizados.</li>
          <li>Responder consultas tanto por WhatsApp como por correo electrónico.</li>
          <li>Mantener la relación comercial y cumplir con obligaciones legales.</li>
        </ul>
        <p>
          No utilizamos tus datos para fines distintos a los descritos sin tu consentimiento previo.
        </p>
      </LegalSection>

      <LegalSection id="compartir" title="Compartir información">
        <p>
          Solo compartimos los datos estrictamente necesarios con terceros aliados (por ejemplo,
          transportadoras) para poder despachar tu pedido. No vendemos, alquilamos ni cedemos tus
          datos personales a terceros ajenos al proceso comercial.
        </p>
      </LegalSection>

      <LegalSection id="derechos" title="Derechos del titular">
        <p>
          De acuerdo con la ley colombiana de protección de datos (Ley 1581 de 2012), puedes ejercer
          tus derechos de conocer, actualizar, rectificar, suprimir y revocar autorización sobre tus
          datos personales. Para ejercerlos, escríbenos a{" "}
          <span className="font-medium text-foreground">{settings.contactEmail}</span> indicando el
          derecho que deseas ejercer.
        </p>
      </LegalSection>

      <LegalSection id="seguridad" title="Seguridad de los datos">
        <LegalCallout icon={Lock} title="Protegemos tu información">
          Aplicamos medidas técnicas y organizativas razonables para proteger tus datos frente a
          accesos no autorizados, pérdida o uso indebido.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="enlaces" title="Enlaces a sitios externos">
        <p>
          Nuestro sitio puede contener enlaces a plataformas externas (como nuestra página de
          Instagram o WhatsApp). No somos responsables por las políticas de privacidad de esos sitios.
        </p>
      </LegalSection>

      <LegalSection id="contacto" title="Contacto">
        <LegalCallout icon={Mail} title="Dudas sobre tu privacidad">
          Si tienes preguntas sobre esta política, escríbenos a{" "}
          <span className="font-medium text-foreground">{settings.contactEmail}</span> o por WhatsApp
          al <span className="font-medium text-foreground">{settings.whatsappNumber}</span>.
        </LegalCallout>
      </LegalSection>

      <ContactCta settings={settings} />
    </LegalShell>
  );
}
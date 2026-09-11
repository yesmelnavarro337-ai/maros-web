import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Scale } from "lucide-react";
import { LegalShell } from "@/features/legal/components/legal-shell";
import { LegalSection } from "@/features/legal/components/legal-section";
import { LegalCallout } from "@/features/legal/components/legal-callout";
import { ContactCta } from "@/features/legal/components/contact-cta";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { getPublicSettings } from "@/features/settings/services/settings.server";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Términos y condiciones",
    description:
      "Conoce los términos y condiciones de compra, personalización, pagos y envíos de Maro's Pijamas.",
    path: "/terminos-y-condiciones",
  });
}

const toc = [
  { id: "informacion-general", label: "Información general" },
  { id: "pedidos", label: "Pedidos y personalización" },
  { id: "precios", label: "Precios y pagos" },
  { id: "envios", label: "Envíos y entregas" },
  { id: "cambios", label: "Cambios y devoluciones" },
  { id: "propiedad-intelectual", label: "Propiedad intelectual" },
  { id: "responsabilidad", label: "Limitación de responsabilidad" },
  { id: "contacto", label: "Contacto" },
];

export default async function TerminosYCondicionesPage() {
  const settings = await getPublicSettings();

  return (
    <LegalShell
      kicker="Legal"
      title="Términos y condiciones"
      description={
        "Al usar este sitio web y realizar compras, aceptas los términos y condiciones descritos a continuación."
      }
      toc={toc}
    >
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Inicio", href: "/" },
          { label: "Términos y condiciones", href: "/terminos-y-condiciones" },
        ])}
      />

      <LegalSection id="informacion-general" title="Información general">
        <p>
          {settings.siteName} es una tienda de pijamas personalizadas elaboradas a mano. Al navegar
          en este sitio o realizar una compra, aceptas cumplir y estar sujeto a estos términos,
          así como a nuestras políticas de envíos, cambios y privacidad.
        </p>
      </LegalSection>

      <LegalSection id="pedidos" title="Pedidos y personalización">
        <p>
          Cada producto puede personalizarse (talla, diseño, bordado, nombre, entre otros). Al
          confirmar tu pedido por WhatsApp, validamos contigo todos los detalles antes de iniciar la
          confección, ya que los productos personalizados no admiten cambios una vez entran en
          producción.
        </p>
        <p>
          La aceptación de un pedido queda sujeta a disponibilidad de materiales y a la confirmación
          escrita por parte de nuestro equipo.
        </p>
      </LegalSection>

      <LegalSection id="precios" title="Precios y pagos">
        <p>
          Los precios publicados están expresados en pesos colombianos (COP) e incluyen el valor de
          la confección. El método de pago se acuerda al momento de la cotización (aplican pagos por
          transferencia o pago al recibir, según lo pactado).
        </p>
        <p>
          No hay cobros adicionales no informados. Cualquier costo de envío será siempre acordado y
          comunicado antes de despachar tu pedido.
        </p>
      </LegalSection>

      <LegalSection id="envios" title="Envíos y entregas">
        <p>
          Nuestros tiempos de entrega varían según el producto, su personalización y tu ubicación.
          Consulta todos los detalles en nuestra página de{" "}
          <Link href="/envios-y-entregas" className="font-medium text-primary hover:underline">
            envíos y entregas
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection id="cambios" title="Cambios y devoluciones">
        <p>
          Trabajamos con estándares de calidad en cada una de nuestras prendas. Conoce el detalle de
          nuestra política en la página de{" "}
          <Link href="/cambios-y-devoluciones" className="font-medium text-primary hover:underline">
            cambios y devoluciones
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection id="propiedad-intelectual" title="Propiedad intelectual">
        <p>
          Las imágenes, textos, logotipos y demás contenidos de este sitio son propiedad de{" "}
          {settings.siteName}. Queda prohibida su reproducción o uso sin autorización previa por
          escrito.
        </p>
      </LegalSection>

      <LegalSection id="responsabilidad" title="Limitación de responsabilidad">
        <p>
          Hacemos nuestro mejor esfuerzo para que las fotografías reflejen fielmente los productos;
          sin embargo, los colores pueden variar ligeramente según la pantalla del dispositivo.
        </p>
        <LegalCallout icon={FileText} title="Fecha de vigencia">
          Estos términos pueden actualizarse periódicamente para reflejar cambios en nuestros
          procesos o en la normativa aplicable.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="contacto" title="Contacto">
        <LegalCallout icon={Scale} title="¿Tienes preguntas sobre estos términos?">
          Escríbenos por WhatsApp al{" "}
          <span className="font-medium text-foreground">{settings.whatsappNumber}</span> o por correo
          a <span className="font-medium text-foreground">{settings.contactEmail}</span>. Estamos en{" "}
          {settings.address}.
        </LegalCallout>
      </LegalSection>

      <ContactCta settings={settings} />
    </LegalShell>
  );
}
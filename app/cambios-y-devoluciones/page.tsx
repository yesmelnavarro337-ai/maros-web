import type { Metadata } from "next";
import { Palette, ShieldCheck, Store } from "lucide-react";
import { LegalShell } from "@/features/legal/components/legal-shell";
import { LegalSection } from "@/features/legal/components/legal-section";
import { LegalCard } from "@/features/legal/components/legal-card";
import { LegalCallout } from "@/features/legal/components/legal-callout";
import { ContactCta } from "@/features/legal/components/contact-cta";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { getPublicSettings } from "@/features/settings/services/settings.server";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Cambios y devoluciones",
    description:
      "Consulta la política de cambios y devoluciones de Maro's Pijamas y cómo solicitar un cambio o reportar un inconveniente con tu pedido.",
    path: "/cambios-y-devoluciones",
  });
}

const toc = [
  { id: "politica", label: "Política de cambios y devoluciones" },
  { id: "personalizados", label: "Productos personalizados" },
  { id: "garantia", label: "Garantía de calidad" },
  { id: "como-solicitar", label: "Cómo solicitar un cambio" },
];

export default async function CambiosYDevolucionesPage() {
  const settings = await getPublicSettings();

  return (
    <LegalShell
      kicker="Ayuda"
      title="Cambios y devoluciones"
      description={
        "Queremos que recibas exactamente lo que pediste. Te contamos nuestra política de cambios, devoluciones y garantía de calidad."
      }
      toc={toc}
    >
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Inicio", href: "/" },
          { label: "Cambios y devoluciones", href: "/cambios-y-devoluciones" },
        ])}
      />

      <LegalSection id="politica" title="Política de cambios y devoluciones">
        {settings.legalReturnsPolicy ? (
          <p className="whitespace-pre-line">{settings.legalReturnsPolicy}</p>
        ) : (
          <p>
            Para consultas sobre cambios o devoluciones, contáctanos directamente por WhatsApp y con
            gusto te ayudamos a resolver tu caso.
          </p>
        )}
      </LegalSection>

      <LegalSection id="personalizados" title="Productos personalizados">
        <LegalCard icon={Palette} title="Pijamas hechas a tu medida">
          Por ser productos personalizados y elaborados a mano, los cambios por talla o diseño no
          aplican una vez tu pedido entra en confección. Siempre validamos contigo todos los detalles
          antes de empezar, para que el resultado sea tal como lo imaginaste.
        </LegalCard>
      </LegalSection>

      <LegalSection id="garantia" title="Garantía de calidad">
        <LegalCard icon={ShieldCheck} title="Garantía sobre nuestros productos">
          Nuestras pijamas están hechas con materiales de calidad. Si tu producto llega con fallas de
          confección o daños por transporte, cuéntanos y lo resolvemos a la brevedad, ya sea con un
          arreglo o reposición.
        </LegalCard>
      </LegalSection>

      <LegalSection id="como-solicitar" title="Cómo solicitar un cambio">
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            Escríbenos por WhatsApp al{" "}
            <span className="font-medium text-foreground">{settings.whatsappNumber}</span> indicando
            el número de tu pedido.
          </li>
          <li>Adjunta una foto del producto y, si aplica, del empaque y la guía de envío.</li>
          <li>
            Te confirmamos la solución (reparación, reposición o devolución) y los siguientes pasos.
          </li>
        </ol>
      </LegalSection>

      <LegalSection id="canal-complementario" title="Otros canales de contacto">
        <LegalCallout icon={Store} title="También puedes escribirnos">
          Contáctanos por correo a{" "}
          <span className="font-medium text-foreground">{settings.contactEmail}</span> para casos que
          requieran un registro escrito. Te responderemos dentro de nuestro horario de atención:{" "}
          {settings.businessHours}.
        </LegalCallout>
      </LegalSection>

      <ContactCta settings={settings} />
    </LegalShell>
  );
}
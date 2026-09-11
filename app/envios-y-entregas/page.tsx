import type { Metadata } from "next";
import { Banknote, Clock, MapPin, Package, Truck } from "lucide-react";
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
    title: "Envíos y entregas",
    description:
      "Conoce cómo hacemos llegar tu pedido de Maro's Pijamas a cualquier ciudad de Colombia y qué tiempos de entrega puedes esperar.",
    path: "/envios-y-entregas",
  });
}

const toc = [
  { id: "cobertura", label: "Cobertura nacional" },
  { id: "tiempos", label: "Tiempos de entrega" },
  { id: "pago-al-recibir", label: "Pago al recibir" },
  { id: "personalizados", label: "Pedidos personalizados" },
];

export default async function EnviosYEntregasPage() {
  const settings = await getPublicSettings();

  return (
    <LegalShell
      kicker="Ayuda"
      title="Envíos y entregas"
      description={
        "Trabajamos con transportadoras aliadas para hacer llegar tus pijamas a cualquier ciudad del país, con tiempos claros y confirmación antes de despachar."
      }
      toc={toc}
    >
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Inicio", href: "/" },
          { label: "Envíos y entregas", href: "/envios-y-entregas" },
        ])}
      />

      <LegalSection id="cobertura" title="Cobertura nacional">
        <div className="flex flex-col gap-3">
          <LegalCard icon={Truck} title="Envíos a todo Colombia">
            Hacemos envíos a todas las ciudades y municipios del país a través de transportadoras
            aliadas.
          </LegalCard>
          <LegalCard icon={MapPin} title={`Entrega en ${settings.address.split(",")[0] || "Valledupar"}`}>
            Coordinamos la entrega de acuerdo con tu ubicación. Para pedidos cerca de la ciudad
            principal de origen, la entrega suele ser más rápida.
          </LegalCard>
        </div>
      </LegalSection>

      <LegalSection id="tiempos" title="Tiempos de entrega">
        <p>
          El tiempo de entrega varía según el producto y su nivel de personalización. Al momento de
          coordinar tu cotización te confirmamos un tiempo estimado y exacto para tu pedido.
        </p>
        <p>
          Recuerda que, como cada pijama es elaborada a mano, el tiempo de confección se suma al
          tiempo de transporte.
        </p>
      </LegalSection>

      <LegalSection id="pago-al-recibir" title="Pago al recibir">
        <LegalCard icon={Banknote} title="Confirmación antes de despachar">
          Confirmamos tu pedido por WhatsApp antes de enviarlo, para que tengas total claridad sobre
          lo que vas a recibir y el método de pago acordado.
        </LegalCard>
        <LegalCard icon={Package} title="Seguimiento de tu pedido">
          Cuando tu pedido queda en manos de la transportadora, te compartimos la guía de seguimiento
          para que sepas dónde va tu paquete.
        </LegalCard>
      </LegalSection>

      <LegalSection id="personalizados" title="Pedidos personalizados">
        <LegalCallout icon={Clock} title="Nuestros productos llevan tiempo de confección">
          Por ser pijamas hechas a mano, cada pedido personalizado se elabora especialmente para ti.
          Esto puede sumar días al tiempo total de entrega; te lo indicamos siempre en tu cotización.
        </LegalCallout>
      </LegalSection>

      <ContactCta settings={settings} />
    </LegalShell>
  );
}
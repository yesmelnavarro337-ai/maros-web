import type { Metadata } from "next";
import { AboutHero } from "@/features/about/components/about-hero";
import { AboutHistory } from "@/features/about/components/about-history";
import { AboutValues } from "@/features/about/components/about-values";
import { AboutProcess } from "@/features/about/components/about-process";
import { AboutCta } from "@/features/about/components/about-cta";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Nosotros",
    description:
      "Conoce la historia de Maro's Pijamas — más de 4 años creando pijamas únicas, cómodas y hechas a mano en Colombia.",
    path: "/nosotros",
  }),
};

export default function NosotrosPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Inicio", href: "/" },
          { label: "Nosotros", href: "/nosotros" },
        ])}
      />

      <AboutHero />
      <AboutHistory />
      <AboutValues />
      <AboutProcess />
      <AboutCta />
    </>
  );
}

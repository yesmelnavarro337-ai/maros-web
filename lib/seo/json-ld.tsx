import { SITE_URL } from "../seo";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}

interface OrganizationJsonLdInput {
  name: string;
  description: string;
  logoUrl?: string;
  whatsappNumber: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
}

export function organizationJsonLd(data: OrganizationJsonLdInput): Record<string, unknown> {
  const sameAs = [data.instagram, data.facebook, data.tiktok].filter(
    (url): url is string => Boolean(url)
  );

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: data.name,
    url: SITE_URL,
    description: data.description,
    ...(data.logoUrl ? { logo: data.logoUrl } : {}),
    telephone: `+${data.whatsappNumber}`,
    ...(sameAs.length > 0 ? { sameAs } : {}),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: `+${data.whatsappNumber}`,
        availableLanguage: "es",
        areaServed: "CO",
      },
    ],
  };
}

interface ProductJsonLdInput {
  name: string;
  slug: string;
  description: string;
  price: number;
  available: boolean;
  images: string[];
  categoryName: string;
  brand: string;
}

export function productJsonLd(product: ProductJsonLdInput): Record<string, unknown> {
  const url = `${SITE_URL}/productos/${product.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    url,
    description: product.description,
    ...(product.images.length > 0 ? { image: product.images } : {}),
    ...(product.categoryName ? { category: product.categoryName } : {}),
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "COP",
      price: product.price,
      availability: product.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };
}
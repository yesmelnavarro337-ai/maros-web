import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/features/product-detail/components/product-detail-client";
import { ProductInfoTabs } from "@/features/product-detail/components/product-info-tabs";
import { RelatedProducts } from "@/features/product-detail/components/related-products";
import { ProductFeaturesStrip } from "@/features/product-detail/components/product-features-strip";
import { getProductDetail, getRelatedProducts } from "@/features/product-detail/services/product-detail.service";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd, productJsonLd } from "@/lib/seo/json-ld";
import { cloudinaryUrl, cloudinaryUrlList } from "@/lib/images/cloudinary";
import { getPublicSettings } from "@/features/settings/services/settings.server";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductDetail(slug);

  if (!product) return {};

  const cleanDescription = (product.seoDescription || product.description || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const rawImage = product.seoSocialImageUrl || product.images?.[0];
  const imageUrl = rawImage ? (rawImage.startsWith("http") ? rawImage : cloudinaryUrl(rawImage)) : undefined;

  return buildMetadata({
    title: product.seoTitle || `${product.name} | Maro's Pijamas`,
    description: cleanDescription ? cleanDescription.slice(0, 160) : `Pijama personalizada ${product.name} confeccionada a mano con amor en Colombia.`,
    path: `/productos/${product.slug}`,
    image: imageUrl,
  });
}

export const revalidate = 300;

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { slug } = await params;
  const rawSearchParams = await searchParams;
  const categorySlug = rawSearchParams.categoria ?? undefined;

  const product = await getProductDetail(slug);
  if (!product) notFound();

  const [related, settings] = await Promise.all([
    getRelatedProducts(product, product.slug),
    getPublicSettings(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-xs text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground">Inicio</Link> /{" "}
        <Link href="/catalogo" className="hover:text-foreground">Productos</Link> /{" "}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <JsonLd
        data={productJsonLd({
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          available: product.available,
          images: cloudinaryUrlList(product.images),
          categoryName: product.categoryName,
          brand: settings.siteName,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Inicio", href: "/" },
          { label: "Catálogo", href: "/catalogo" },
          { label: product.name, href: `/productos/${product.slug}` },
        ])}
      />

      <ProductDetailClient product={product} categorySlug={categorySlug} />

      <ProductInfoTabs description={product.description} />

      <ProductFeaturesStrip deliveryTime={product.deliveryTime} />

      <RelatedProducts products={related} />
    </div>
  );
}
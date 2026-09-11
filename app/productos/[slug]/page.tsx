import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/features/product-detail/components/product-gallery";
import { ProductInfoPanel } from "@/features/product-detail/components/product-info-panel";
import { ProductInfoTabs } from "@/features/product-detail/components/product-info-tabs";
import { RelatedProducts } from "@/features/product-detail/components/related-products";
import { ProductFeaturesStrip } from "@/features/product-detail/components/product-features-strip";
import { getProductDetail, getRelatedProducts } from "@/features/product-detail/services/product-detail.service";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd, productJsonLd } from "@/lib/seo/json-ld";
import { cloudinaryUrlList } from "@/lib/images/cloudinary";
import { getPublicSettings } from "@/features/settings/services/settings.server";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductDetail(slug);

  if (!product) return {};

  return buildMetadata({
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.description.slice(0, 160),
    path: `/productos/${product.slug}`,
    image: product.seoSocialImageUrl || product.images[0],
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ProductGallery images={product.images} productName={product.name} />
        <ProductInfoPanel product={product} />
      </div>

      <ProductInfoTabs description={product.description} />

      <ProductFeaturesStrip deliveryTime={product.deliveryTime} />

      <RelatedProducts products={related} />
    </div>
  );
}
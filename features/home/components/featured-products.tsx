import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ImageOff, ShoppingBag } from "lucide-react";
import { WishlistButton } from "@/components/shared/wishlist-button";
import type { ProductPreview } from "@/types/product";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

function formatPrice(price: number): string {
  return `$ ${price.toLocaleString("es-CO")}`;
}

export function FeaturedProducts({ products }: { products: ProductPreview[] }) {
  if (!products || products.length === 0) return null;

  const displayProducts = products.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      {/* Encabezado Editorial */}
      <div className="flex items-end justify-between mb-6 sm:mb-8">
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-[#34351F] font-medium tracking-tight">
            Productos <span className="italic font-normal">destacados</span>
          </h2>
          <p className="font-sans text-xs sm:text-sm text-stone-500 mt-1 sm:mt-1.5">
            Favoritos de nuestras clientas.
          </p>
        </div>

        <Link
          href="/catalogo"
          className="group inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[#6B6832] hover:text-[#34351F] transition-colors"
        >
          <span>Ver catálogo</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Grid de Productos Ecommerce */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
        {displayProducts.map((product) => {
          const productImages = product.images ?? [];
          const secondImage = productImages.length > 1 ? productImages[1] : undefined;

          return (
            <div
              key={product.id}
              className="group flex flex-col justify-between bg-[#FDFBF7] rounded-2xl sm:rounded-3xl border border-brand-border/50 p-3 sm:p-4 shadow-2xs hover:shadow-md hover:border-[#6B6832]/40 transition-all duration-300"
            >
              <Link href={`/productos/${product.slug}`} className="block">
                {/* Contenedor de Imagen */}
                <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden bg-stone-100 mb-3 sm:mb-4">
                  {product.image ? (
                    <>
                      <Image
                        src={cloudinaryUrl(product.image)}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      {secondImage && (
                        <Image
                          src={cloudinaryUrl(secondImage)}
                          alt={`${product.name} vista alternativa`}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-stone-100">
                      <ImageOff className="h-6 w-6 text-stone-300" />
                    </div>
                  )}

                  {/* Botón de Favoritos flotante */}
                  <WishlistButton
                    className="absolute top-2.5 right-2.5 z-10"
                    item={{
                      id: product.id,
                      type: "product",
                      name: product.name,
                      image: product.image,
                      slug: `/productos/${product.slug}`,
                      price: product.price,
                    }}
                  />

                  {/* Icono de bolsa/carrito decorativo en esquina inferior */}
                  <div className="absolute bottom-2.5 right-2.5 h-8 w-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#34351F] shadow-2xs group-hover:bg-[#34351F] group-hover:text-white transition-colors duration-300 pointer-events-none">
                    <ShoppingBag className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Datos del Producto */}
                <div>
                  <h3 className="font-heading text-xs sm:text-sm lg:text-base text-[#34351F] font-medium leading-snug truncate group-hover:text-[#6B6832] transition-colors">
                    {product.name}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm font-semibold text-[#34351F] mt-1">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
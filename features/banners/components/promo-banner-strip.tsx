import Link from "next/link";
import Image from "next/image";
import { Truck } from "lucide-react";
import { getActiveBanners } from "../services/banners.service";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

export async function PromoBannerStrip() {
  const banners = await getActiveBanners("Home - Medio");

  if (banners.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4">
      {banners.map((banner) => (
        <Link
          key={banner.id}
          href={banner.linkHref}
          className="relative rounded-2xl overflow-hidden bg-primary flex items-center min-h-[140px] block"
        >
          {banner.image ? (
            <Image src={cloudinaryUrl(banner.image)} alt={banner.title} fill sizes="100vw" className="object-cover opacity-25" />
          ) : null}
          <div className="relative z-10 px-8 py-6 flex items-center gap-4">
            <div className="rounded-full bg-primary-foreground/15 p-3 shrink-0">
              <Truck className="h-6 w-6 text-primary-foreground" />
            </div>
            <p className="font-heading text-xl sm:text-2xl text-primary-foreground">{banner.title}</p>
          </div>
        </Link>
      ))}
    </section>
  );
}
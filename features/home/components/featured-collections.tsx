"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { CollectionCard } from "@/components/shared/collection-card";
import type { CollectionSummary } from "@/types/collection";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

function MobileCollectionCard({ collection }: { collection: CollectionSummary }) {
  return (
    <Link
      href={`/colecciones/${collection.id}`}
      className="group flex flex-row items-center overflow-hidden rounded-2xl h-24 w-full bg-card border border-border"
      style={{ backgroundColor: `${collection.accentHex}1A` }}
    >
      <div className="relative w-28 h-full shrink-0 overflow-hidden">
        {collection.image ? (
          <Image
            src={cloudinaryUrl(collection.image)}
            alt={collection.name}
            fill
            sizes="112px"
            className="object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/60">
            <ImageOff className="h-5 w-5" style={{ color: collection.accentHex }} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 px-4 py-3 bg-gradient-to-r from-black/55 via-black/35 to-transparent">
        <p className="font-heading text-base text-white leading-tight">{collection.name}</p>
        <p
          className="mt-1 text-sm font-semibold inline-flex items-center gap-1.5"
          style={{ color: `${collection.accentHex}` }}
        >
          Ver colección
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </p>
      </div>
    </Link>
  );
}

export function FeaturedCollections({ collections }: { collections: CollectionSummary[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    scrollRef.current?.scrollBy({ left: direction === "left" ? -280 : 280, behavior: "smooth" });
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading text-2xl sm:text-3xl text-foreground">
          Colecciones <span className="text-primary">destacadas</span>
        </h2>
        <div className="hidden md:flex items-center gap-2">
          <Link href="/colecciones" className="text-sm text-primary hover:underline">
            Ver todas →
          </Link>
          <button onClick={() => scroll("left")} className="rounded-full border border-border p-1.5 hover:bg-secondary">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => scroll("right")} className="rounded-full border border-border p-1.5 hover:bg-secondary">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full md:hidden">
        {collections.map((c) => (
          <MobileCollectionCard key={c.id} collection={c} />
        ))}
        <div className="flex justify-center pt-1">
          <Link
            href="/colecciones"
            className="rounded-full border border-amber-600/40 text-amber-800 bg-amber-50/50 hover:bg-amber-50 py-2 px-6 text-sm font-medium transition-colors"
          >
            Ver todas →
          </Link>
        </div>
      </div>

      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-3 gap-5">
        {collections.map((c) => (
          <CollectionCard key={c.id} collection={c} />
        ))}
      </div>
    </section>
  );
}
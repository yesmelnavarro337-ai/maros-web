"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CollectionCard } from "@/components/shared/collection-card";
import type { CollectionSummary } from "@/types/collection";

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
        <div className="flex items-center gap-2">
          <Link href="/colecciones" className="text-sm text-primary hover:underline hidden sm:block">
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

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none]">
        {collections.map((c) => (
          <div key={c.id} className="shrink-0 w-64">
            <CollectionCard collection={c} />
          </div>
        ))}
      </div>
    </section>
  );
}
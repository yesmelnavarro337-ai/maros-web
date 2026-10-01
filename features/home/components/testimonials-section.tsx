import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTestimonials } from "@/features/testimonials/services/testimonials.service";
import { TestimonialsCarousel } from "./testimonials-carousel";

export async function TestimonialsSection() {
  const testimonials = await getTestimonials();

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      {/* Encabezado Editorial */}
      <div className="flex items-end justify-between mb-6 sm:mb-8">
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-[#34351F] font-medium tracking-tight">
            Lo dicen nuestras <span className="italic font-normal">clientas</span>
          </h2>
          <p className="font-sans text-xs sm:text-sm text-stone-500 mt-1 sm:mt-1.5">
            Historias reales, pijamas favoritas.
          </p>
        </div>

        <Link
          href="/nosotros"
          className="group hidden sm:inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[#6B6832] hover:text-[#34351F] transition-colors"
        >
          <span>Ver más</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Carrusel / Grid de Testimonios */}
      <TestimonialsCarousel testimonials={testimonials} />
    </section>
  );
}
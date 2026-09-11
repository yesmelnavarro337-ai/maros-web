import { Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StarRatingDisplay } from "@/components/shared/star-rating-display";
import { getTestimonials } from "@/features/testimonials/services/testimonials.service";

export async function TestimonialsSection() {
  const testimonials = await getTestimonials();

  if (testimonials.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="font-heading text-2xl sm:text-3xl text-foreground text-center mb-8">
        Lo que dicen nuestras <span className="text-primary">clientas</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {testimonials.map((t) => (
          <div key={t.id} className="rounded-2xl bg-[#F4EFE6] p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <StarRatingDisplay rating={t.rating} />
              <Quote className="h-5 w-5 text-[#A38A3E]" />
            </div>
            <p className="text-sm text-foreground italic leading-relaxed">&quot;{t.quote}&quot;</p>
            <div className="flex items-center gap-2.5 mt-auto pt-3">
              <Avatar className="h-10 w-10 ring-2 ring-[#A38A3E]/60">
                <AvatarFallback className="bg-[#A38A3E] text-white text-xs">
                  {t.clientName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground leading-tight">{t.clientName}</p>
                <p className="text-xs text-muted-foreground">Cliente verificada</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StarRatingDisplay } from "@/components/shared/star-rating-display";
import { getTestimonials } from "@/features/testimonials/services/testimonials.service";

export async function TestimonialsSection() {
  const testimonials = await getTestimonials();

  if (testimonials.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="font-heading text-2xl sm:text-3xl text-foreground text-center mb-8">
        Lo que dicen nuestras <span className="text-primary">clientas</span> ✨
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {testimonials.map((t) => (
          <div key={t.id} className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
            <StarRatingDisplay rating={t.rating} />
            <p className="text-sm text-foreground italic">&quot;{t.quote}&quot;</p>
            <div className="flex items-center gap-2 mt-auto pt-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                  {t.clientName[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{t.clientName}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
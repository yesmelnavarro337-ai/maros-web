import { serverApiFetch } from "@/lib/api/server-fetch";
import type { TestimonialPreview } from "../types";

interface ApiTestimonial {
  id?: string;
  clientName: string;
  city?: string | null;
  rating: number;
  quote: string;
  avatarUrl?: string | null;
  publishDate?: string | null;
}

function adaptTestimonial(t: ApiTestimonial, index: number): TestimonialPreview {
  return {
    id: t.id || `testimonial-${index}`,
    clientName: t.clientName,
    city: t.city ?? undefined,
    rating: t.rating ?? 5,
    quote: t.quote,
    avatarUrl: t.avatarUrl ?? undefined,
  };
}

export async function getTestimonials(): Promise<TestimonialPreview[]> {
  const testimonials = await serverApiFetch<ApiTestimonial[]>("testimonials");
  return testimonials.map(adaptTestimonial);
}

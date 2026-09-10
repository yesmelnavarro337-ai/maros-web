import { serverApiFetch } from "@/lib/api/server-fetch";
import type { TestimonialPreview } from "../types";

interface ApiTestimonial {
  clientName: string;
  rating: number;
  quote: string;
}

function adaptTestimonial(t: ApiTestimonial, index: number): TestimonialPreview {
  return {
    id: `testimonial-${index}`,
    clientName: t.clientName,
    rating: t.rating,
    quote: t.quote,
  };
}

export async function getTestimonials(): Promise<TestimonialPreview[]> {
  const testimonials = await serverApiFetch<ApiTestimonial[]>("testimonials");
  return testimonials.map(adaptTestimonial);
}
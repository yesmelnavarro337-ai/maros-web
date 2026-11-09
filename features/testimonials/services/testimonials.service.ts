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

const FALLBACK_TESTIMONIALS: TestimonialPreview[] = [
  {
    id: "test-1",
    clientName: "Camila Restrepo",
    city: "Medellín",
    rating: 5,
    quote: "Quedé enamorada desde que abrí la caja. La envoltura tan delicada, el aroma delicioso que trae la prenda y el lazo de regalo demuestran el amor con el que hacen todo. La tela es increíblemente suave y fresca.",
  },
  {
    id: "test-2",
    clientName: "Valentina Gómez",
    city: "Bogotá",
    rating: 5,
    quote: "La calidad de las costuras y los terminados es impecable. Se nota que es confección colombiana hecha a mano de verdad. No se motosea ni pierde color tras varias lavadas. ¡100% recomendada!",
  },
  {
    id: "test-3",
    clientName: "María Alejandra Morales",
    city: "Cali",
    rating: 5,
    quote: "Pedí el set de parejas para nuestro aniversario y fue un acierto total. La asesoría por WhatsApp para elegir las tallas de ambos fue súper atenta y acertada. A mi esposo le encantó la comodidad del pantalón.",
  },
  {
    id: "test-4",
    clientName: "Carolina Henao",
    city: "Bucaramanga",
    rating: 5,
    quote: "Tenía miedo de que no llegara a tiempo para el cumpleaños de mi mamá, pero el envío fue súper rápido a Bucaramanga. Llegó antes de lo esperado y en perfecto estado. ¡Mil gracias por la gestión tan eficiente!",
  },
  {
    id: "test-5",
    clientName: "Daniela Pardo",
    city: "Barranquilla",
    rating: 5,
    quote: "Vivo en clima caliente y me daba miedo el calor, pero la tela es ultra fresca y transpirable. El diseño de short y tiras es comodísimo y súper femenino. Ya encargué mi segunda pijama.",
  },
  {
    id: "test-6",
    clientName: "Andrés Felipe Caicedo",
    city: "Manizales",
    rating: 5,
    quote: "La atención al cliente es de otro nivel. Me ayudaron a elegir el diseño perfecto para sorprender a mi novia, resolvieron todas mis dudas con paciencia y le añadieron una dedicatoria hermosa. ¡Ella quedó fascinada!",
  },
  {
    id: "test-7",
    clientName: "Paola Andrea Duque",
    city: "Pereira",
    rating: 5,
    quote: "Mandé a personalizar mi pijama con las iniciales bordadas y el resultado superó mis expectativas. El bordado es fino, limpio y no pica por dentro. Una prenda de lujo a un precio muy justo.",
  },
  {
    id: "test-8",
    clientName: "Sofía Castaño",
    city: "Cartagena",
    rating: 5,
    quote: "Hicimos el pedido familiar para Navidad (papá, mamá y nuestros dos niños) y las fotos quedaron soñadas. Las tallas de los niños fueron exactas y los estampados son preciosos.",
  },
  {
    id: "test-9",
    clientName: "Laura Victoria Rincón",
    city: "Ibagué",
    rating: 5,
    quote: "La tela se siente como una caricia en la piel. Es la pijama más cómoda que he tenido en mi vida; perfecta tanto para descansar los fines de semana como para trabajar cómoda desde casa.",
  },
  {
    id: "test-10",
    clientName: "Juliana Suescún",
    city: "Santa Marta",
    rating: 5,
    quote: "El unboxing fue toda una experiencia sensorial. El empaque boutique con papel de seda, la tarjetita escrita con cariño y la pijama impecablemente planchada. Cuidan cada detalle al máximo.",
  },
  {
    id: "test-11",
    clientName: "Felipe & Mariana",
    city: "Envigado",
    rating: 5,
    quote: "Llevamos comprándole pijamas a Maro's desde hace dos años y la calidad siempre es constante y excelente. La tela de algodón conserva su elasticidad y suavidad intactas.",
  },
  {
    id: "test-12",
    clientName: "Natalia Zuluaga",
    city: "Cúcuta",
    rating: 5,
    quote: "Soy talla XL y siempre me costaba encontrar pijamas con buen corte y que no quedaran apretadas. En Maro's el tallaje es real, holgado y elegante. Me siento hermosa y cómoda.",
  },
  {
    id: "test-13",
    clientName: "Diana Marcela Ortiz",
    city: "Villavicencio",
    rating: 5,
    quote: "Tuve una duda sobre los colores de la tela y me mandaron fotos reales y videos de cómo se veía a la luz. Esa transparencia y amabilidad no se encuentra en cualquier tienda online.",
  },
  {
    id: "test-14",
    clientName: "Luisa Fernanda Mejía",
    city: "Armenia",
    rating: 5,
    quote: "Compré la bata para el día de mi boda y fue el complemento perfecto para las fotos del arreglo. Elegante, con una caída de ensueño y súper suave. Quedé sumamente agradecida.",
  },
];

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
  try {
    const raw = await serverApiFetch<ApiTestimonial[]>("testimonials");
    if (raw && raw.length >= 8) {
      return raw.map(adaptTestimonial);
    }

    // Si la BD tiene pocos o ninguno, combinamos los de la BD con los testimonios curados
    const adaptedDb = (raw || []).map(adaptTestimonial);
    const existingNames = new Set(adaptedDb.map((t) => t.clientName.toLowerCase().trim()));
    const remaining = FALLBACK_TESTIMONIALS.filter(
      (f) => !existingNames.has(f.clientName.toLowerCase().trim())
    );

    return [...adaptedDb, ...remaining];
  } catch {
    return FALLBACK_TESTIMONIALS;
  }
}

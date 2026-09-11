import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getFaqItems } from "@/features/faq/services/faq.service";
import { buildWhatsAppHref } from "@/features/settings/services/settings.service";
import { getPublicSettings } from "@/features/settings/services/settings.server";
import { MessageCircle } from "lucide-react";

export const metadata = {
  title: "Preguntas frecuentes",
  description: "Resolvemos tus dudas más comunes sobre pedidos, envíos y personalización.",
};

export default async function PreguntasFrecuentesPage() {
  const items = await getFaqItems();
  const settings = await getPublicSettings();
  const whatsappHref = buildWhatsAppHref(settings.whatsappNumber, "¡Hola! Tengo una pregunta que no aparece en las preguntas frecuentes.");

  return (
    <div className="bg-[#F9F6F0]">
      <div className="max-w-3xl mx-auto px-4 py-14 sm:py-20">
        <nav className="text-xs text-muted-foreground mb-6">
          Inicio / <span className="text-foreground">Preguntas frecuentes</span>
        </nav>

        <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary mb-3">
          Ayuda
        </p>
        <h1 className="font-heading text-3xl sm:text-4xl text-foreground">
          Preguntas frecuentes
        </h1>
        <p className="text-muted-foreground mt-3 mb-10">
          Resolvemos tus dudas más comunes sobre pedidos, envíos, materiales y personalización.
        </p>

        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-16">
            Aún no hay preguntas frecuentes publicadas.
          </p>
        ) : (
          <Accordion type="single" collapsible>
            {items.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="py-5 text-base font-medium text-foreground hover:no-underline hover:text-primary transition-colors">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-[15px] text-muted-foreground leading-relaxed pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border bg-card px-6 py-6">
          <div>
            <p className="font-heading text-lg text-foreground">¿No encuentras tu respuesta?</p>
            <p className="text-sm text-muted-foreground mt-1">
              Escríbenos y te ayudamos con cualquier duda.
            </p>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
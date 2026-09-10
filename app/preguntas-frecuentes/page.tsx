import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getFaqItems } from "@/features/faq/services/faq.service";

export const metadata = {
  title: "Preguntas frecuentes",
  description: "Resolvemos tus dudas más comunes sobre pedidos, envíos y personalización.",
};

export default async function PreguntasFrecuentesPage() {
  const items = await getFaqItems();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-xs text-muted-foreground mb-3">
        Inicio / <span className="text-foreground">Preguntas frecuentes</span>
      </nav>
      <h1 className="font-heading text-3xl text-foreground">Preguntas frecuentes</h1>
      <p className="text-muted-foreground mt-1 mb-8">Resolvemos tus dudas más comunes.</p>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-16">
          Aún no hay preguntas frecuentes publicadas.
        </p>
      ) : (
        <Accordion type="single" collapsible className="flex flex-col gap-2">
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="border border-border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
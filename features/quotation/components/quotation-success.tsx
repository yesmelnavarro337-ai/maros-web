import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuotationSuccess({ whatsappLink }: { whatsappLink: string }) {
  return (
    <div className="max-w-md mx-auto text-center py-16 px-4">
      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 className="h-8 w-8 text-primary" />
      </div>
      <h1 className="font-heading text-2xl text-foreground">¡Cotización enviada!</h1>
      <p className="text-muted-foreground mt-2">
        Tu solicitud fue registrada correctamente.
      </p>
      <p className="mt-3 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-sm font-medium text-foreground">
        Importante: para confirmar tu cotización y recibir atención inmediata,
        continúa la conversación en WhatsApp con el botón de abajo.
      </p>
      <div className="flex flex-col gap-3 mt-6">
        <Button asChild size="lg">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4 mr-2" />
            Continuar en WhatsApp
          </a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
}
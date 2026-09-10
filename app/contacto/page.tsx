"use client";

import { useState } from "react";
import { MessageCircle, MapPin, Clock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { contactSchema, type ContactFormValues } from "@/features/contact/schemas/contact.schema";
import { submitContactMessage } from "@/features/contact/services/contact.service";

export default function ContactoPage() {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { fullName: "", whatsapp: "", email: "", message: "" },
  });

  async function onSubmit(values: ContactFormValues) {
    setSubmitting(true);
    try {
      await submitContactMessage(values);
      toast.success("Mensaje enviado — te responderemos pronto.");
      form.reset();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-xs text-muted-foreground mb-6">
        Inicio / <span className="text-foreground">Contacto</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h1 className="font-heading text-3xl text-foreground mb-1">Escríbenos o visítanos</h1>
          <p className="text-muted-foreground mb-6">
            Estamos aquí para ayudarte con cualquier duda sobre tu pedido.
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-secondary p-2 shrink-0">
                <MessageCircle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground">+57 301 316 9974</p>
                <p className="text-xs text-muted-foreground">WhatsApp</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-secondary p-2 shrink-0">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground">Mz 3 Casa 98 Urb. Doña Clara</p>
                <p className="text-xs text-muted-foreground">Valledupar, Colombia</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-secondary p-2 shrink-0">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground">Lunes a Sábado</p>
                <p className="text-xs text-muted-foreground">8:00 a.m. – 6:00 p.m.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-secondary p-2 shrink-0">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground">marospijamas@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm font-medium text-foreground mb-4">Envíanos un mensaje</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl><Input placeholder="Tu nombre" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl><Input placeholder="Ej. 300 123 4567" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico (opcional)</FormLabel>
                    <FormControl><Input placeholder="tu@email.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿En qué podemos ayudarte?</FormLabel>
                    <FormControl><Textarea rows={4} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" disabled={submitting}>
                {submitting ? "Enviando..." : "Enviar mensaje"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
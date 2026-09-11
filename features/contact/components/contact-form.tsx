"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
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

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { fullName: "", whatsapp: "", email: "", message: "" },
  });

  async function onSubmit(values: ContactFormValues) {
    setSubmitting(true);
    try {
      await submitContactMessage(values);
      toast.success("Mensaje enviado — te responderemos pronto.", {
        description: "Gracias por escribirnos, valoramos mucho tu contacto.",
      });
      form.reset();
    } catch {
      toast.error("No pudimos enviar tu mensaje.", {
        description: "Intenta de nuevo en unos minutos o escríbenos por WhatsApp.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-brand-border bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <MessageCircle className="h-4 w-4 text-brand-olive-gold" />
        <p className="font-heading text-xl text-brand-dark-olive">Envíanos un mensaje</p>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Completa el formulario y te contactaremos a la brevedad.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre completo</FormLabel>
                <FormControl>
                  <Input placeholder="Tu nombre" {...field} />
                </FormControl>
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
                <FormControl>
                  <Input placeholder="Ej. 300 123 4567" {...field} />
                </FormControl>
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
                <FormControl>
                  <Input placeholder="tu@email.com" {...field} />
                </FormControl>
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
                <FormControl>
                  <Textarea rows={4} placeholder="Cuéntanos tu idea o duda..." {...field} />
                </FormControl>
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
  );
}
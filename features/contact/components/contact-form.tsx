"use client";

import { useState } from "react";
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
      toast.success("Mensaje enviado — te responderemos pronto.");
      form.reset();
    } finally {
      setSubmitting(false);
    }
  }

  return (
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
  );
}
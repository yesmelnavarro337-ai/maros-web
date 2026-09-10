import { z } from "zod";

export const quotationSchema = z.object({
  customerName: z.string().min(3, "Ingresa tu nombre completo"),
  customerPhone: z.string().min(7, "Ingresa un número de WhatsApp válido"),
  customerEmail: z.string().email("Correo inválido").optional().or(z.literal("")),
  customerCity: z.string().min(2, "Ingresa tu ciudad"),
  notes: z.string().optional(),
});

export type QuotationFormSchema = z.infer<typeof quotationSchema>;
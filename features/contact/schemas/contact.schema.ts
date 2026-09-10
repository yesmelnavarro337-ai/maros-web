import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().min(3, "Ingresa tu nombre completo"),
  whatsapp: z.string().min(7, "Ingresa un número válido"),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  message: z.string().min(10, "Cuéntanos un poco más — mínimo 10 caracteres"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
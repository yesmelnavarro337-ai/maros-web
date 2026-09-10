import { clientApiFetch } from "@/lib/api/client-fetch";
import type { ContactFormValues } from "../schemas/contact.schema";

export async function submitContactMessage(values: ContactFormValues): Promise<void> {
  await clientApiFetch<{ message: string }>("contact-message", {
    method: "POST",
    body: {
      fullName: values.fullName,
      phone: values.whatsapp,
      email: values.email || null,
      message: values.message,
    },
  });
}
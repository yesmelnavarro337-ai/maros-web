import { clientApiFetch } from "@/lib/api/client-fetch";
import type { QuotationFormValues, QuotationItemDraft, QuotationResult } from "../types";

interface ApiQuotationResponse {
  message: string;
  id: string;
  whatsapp: {
    phoneNumber: string;
    message: string;
    link: string;
  };
}

export async function submitQuotation(
  customer: QuotationFormValues,
  items: QuotationItemDraft[]
): Promise<QuotationResult> {
  const response = await clientApiFetch<ApiQuotationResponse>("quotation", {
    method: "POST",
    body: {
      customerName: customer.customerName,
      customerPhone: customer.customerPhone,
      customerEmail: customer.customerEmail || null,
      customerCity: customer.customerCity,
      items: items.map((item) => ({
        productId: item.productId,
        size: item.size,
        quantity: item.quantity,
        customizationOptionIds: item.customizationOptionIds,
        embroideryText: item.embroideryText || null,
      })),
      referenceImageUrls: [],
      notes: customer.notes || "",
    },
  });

  return { id: response.id, whatsappLink: response.whatsapp.link };
}
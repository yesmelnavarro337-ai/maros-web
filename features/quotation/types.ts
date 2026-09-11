export interface QuotationItemDraft {
  productId: string;
  productName: string;
  productSlug: string;
  image?: string;
  size: string;
  quantity: number;
  baseColor?: string;
  customizationOptionIds: string[];
  customizationLabels?: {
    tela?: string;
    color?: string;
    estampado?: string;
    bordado?: string;
  };
  embroideryText?: string;
  totalPrice: number;
}

export interface QuotationFormValues {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerCity: string;
  notes?: string;
}

export interface QuotationResult {
  id: string;
  whatsappLink: string;
}
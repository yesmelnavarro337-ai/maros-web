export type WizardStepKey = "tela" | "color" | "estampado" | "bordado" | "resumen";

export interface CustomizationChoice {
  id: string;
  name: string;
  image?: string;
  hex?: string;
  priceModifier: number;
}

export interface CustomizationSelections {
  telaId?: string;
  colorId?: string;
  estampadoId?: string;
  bordadoId?: string;
  embroideryText?: string;
}

export interface CustomizationDraft {
  productId: string;
  productSlug: string;
  productName: string;
  basePrice: number;
  size: string;
  baseColor: string;
  quantity: number;
  selections: CustomizationSelections;
  totalPrice: number;
}
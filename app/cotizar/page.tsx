"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderSummaryCard } from "@/features/quotation/components/order-summary-card";
import { QuotationForm } from "@/features/quotation/components/quotation-form";
import { QuotationSuccess } from "@/features/quotation/components/quotation-success";
import { submitQuotation } from "@/features/quotation/services/quotation.service";
import { getProductSummaryClient } from "@/features/product-detail/services/product-detail.client";
import {
  getFabrics,
  getColors,
  getPrints,
  getEmbroideries,
} from "@/features/customization-wizard/services/customization-catalog.service";
import { readCustomizationDraft, clearCustomizationDraft } from "@/lib/customization-draft";
import type { QuotationItemDraft, QuotationResult } from "@/features/quotation/types";
import type { QuotationFormSchema } from "@/features/quotation/schemas/quotation.schema";

export default function CotizarPage() {
  const searchParams = useSearchParams();
  const [item, setItem] = useState<QuotationItemDraft | null | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuotationResult | null>(null);

  useEffect(() => {
    async function loadItem() {
      // Caso 1: viene del wizard de Personalización — hay un borrador guardado.
      const draft = readCustomizationDraft();
      if (draft) {
        const [fabrics, colors, prints, embroideries] = await Promise.all([
          getFabrics(),
          getColors(),
          getPrints(),
          getEmbroideries(),
        ]);

        const optionIds = [
          draft.selections.telaId,
          draft.selections.colorId,
          draft.selections.estampadoId && draft.selections.estampadoId !== "none" ? draft.selections.estampadoId : undefined,
          draft.selections.bordadoId && draft.selections.bordadoId !== "none" ? draft.selections.bordadoId : undefined,
        ].filter((id): id is string => !!id);

        setItem({
          productId: draft.productId,
          productName: draft.productName,
          productSlug: draft.productSlug,
          size: draft.size,
          quantity: draft.quantity,
          baseColor: draft.baseColor || undefined,
          customizationOptionIds: optionIds,
          customizationLabels: {
            tela: fabrics.find((f) => f.id === draft.selections.telaId)?.name,
            color: colors.find((c) => c.id === draft.selections.colorId)?.name,
            estampado: prints.find((p) => p.id === draft.selections.estampadoId && p.id !== "none")?.name,
            bordado: embroideries.find((e) => e.id === draft.selections.bordadoId && e.id !== "none")?.name,
          },
          embroideryText: draft.selections.embroideryText,
          totalPrice: draft.totalPrice,
        });
        return;
      }

      // Caso 2: viene directo del botón "Solicitar cotización" del detalle,
      // sin pasar por personalización — solo talla/color/cantidad en la URL.
      const productSlug = searchParams.get("producto");
      if (!productSlug) {
        setItem(null);
        return;
      }

      const product = await getProductSummaryClient(productSlug);
      if (!product) {
        setItem(null);
        return;
      }

      const size = searchParams.get("talla") ?? product.sizes[0] ?? "";
      const colorHex = searchParams.get("color") ?? "";
      const quantity = Number(searchParams.get("cantidad") ?? "1");
      const colorName = product.colors.find((c) => c.hex === colorHex)?.name;

      setItem({
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        size,
        quantity,
        baseColor: colorName,
        customizationOptionIds: [],
        totalPrice: product.basePrice * quantity,
      });
    }

    loadItem();
  }, [searchParams]);

  async function handleSubmit(values: QuotationFormSchema) {
    if (!item) return;
    setSubmitting(true);
    try {
      const response = await submitQuotation(values, [item]);
      clearCustomizationDraft();
      setResult(response);
    } finally {
      setSubmitting(false);
    }
  }

  if (item === undefined) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (item === null) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4">
        <p className="text-muted-foreground">
          No encontramos ningún producto para cotizar. Vuelve al catálogo para elegir uno.
        </p>
      </div>
    );
  }

  if (result) {
    return <QuotationSuccess whatsappLink={result.whatsappLink} />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-xs text-muted-foreground mb-3">
        Inicio / <span className="text-foreground">Cotización</span>
      </nav>
      <h1 className="font-heading text-3xl text-foreground mb-1">Solicita tu cotización</h1>
      <p className="text-muted-foreground mb-6">
        Completa tus datos y te contactaremos por WhatsApp.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_280px] gap-8">
        <QuotationForm onSubmit={handleSubmit} submitting={submitting} />
        <OrderSummaryCard item={item} />
      </div>
    </div>
  );
}
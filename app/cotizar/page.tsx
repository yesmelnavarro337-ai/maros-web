"use client";

import { useEffect, useRef, useState } from "react";
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
import { useCart } from "@/features/cart/cart-context";
import type { QuotationItemDraft, QuotationResult } from "@/features/quotation/types";
import type { QuotationFormSchema } from "@/features/quotation/schemas/quotation.schema";

type QuotationSource = "draft" | "url" | "cart" | null;

export default function CotizarPage() {
  const searchParams = useSearchParams();
  const { items: cartItems, clear: clearCart } = useCart();
  const [items, setItems] = useState<QuotationItemDraft[] | null | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuotationResult | null>(null);
  const sourceRef = useRef<QuotationSource>(null);

  useEffect(() => {
    async function loadItems() {
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

        sourceRef.current = "draft";
        setItems([
          {
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
          },
        ]);
        return;
      }

      // Caso 2: viene directo del botón "Solicitar cotización" del detalle,
      // sin pasar por personalización — solo talla/color/cantidad en la URL.
      const productSlug = searchParams.get("producto");
      if (productSlug) {
        const product = await getProductSummaryClient(productSlug);
        if (!product) {
          setItems([]);
          return;
        }

        const size = searchParams.get("talla") ?? product.sizes[0] ?? "";
        const colorHex = searchParams.get("color") ?? "";
        const quantity = Number(searchParams.get("cantidad") ?? "1");
        const colorName = product.colors.find((c) => c.hex === colorHex)?.name;

        sourceRef.current = "url";
        setItems([
          {
            productId: product.id,
            productName: product.name,
            productSlug: product.slug,
            image: product.image || undefined,
            size,
            quantity,
            baseColor: colorName,
            customizationOptionIds: [],
            totalPrice: product.basePrice * quantity,
          },
        ]);
        return;
      }

      // Caso 3: hay ítems en el carrito — la vista de cotización lee
      // directamente el mismo estado global (useCart) para no perder
      // la hidratación al navegar desde el carrito.
      if (cartItems.length > 0) {
        sourceRef.current = "cart";
        setItems(
          cartItems.map<QuotationItemDraft>((i) => ({
            productId: i.productId,
            productName: i.name,
            productSlug: i.slug,
            image: i.image || undefined,
            size: i.size,
            quantity: i.quantity,
            baseColor: i.colorName || undefined,
            customizationOptionIds: i.customizationOptionIds ?? [],
            embroideryText: i.embroideryText,
            totalPrice: i.price * i.quantity,
          }))
        );
        return;
      }

      setItems([]);
    }

    loadItems();
  }, [searchParams, cartItems]);

  async function handleSubmit(values: QuotationFormSchema) {
    if (!items || items.length === 0) return;
    setSubmitting(true);
    try {
      const response = await submitQuotation(values, items);
      if (sourceRef.current === "draft") {
        clearCustomizationDraft();
      }
      if (sourceRef.current === "cart") {
        clearCart();
      }
      setResult(response);
    } finally {
      setSubmitting(false);
    }
  }

  if (items === undefined) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!items || items.length === 0) {
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

  const total = items.reduce((acc, i) => acc + i.totalPrice, 0);

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
        <div className="flex flex-col gap-4">
          {items.map((item, i) => (
            <OrderSummaryCard key={i} item={item} />
          ))}
          {items.length > 1 && (
            <div className="rounded-xl border border-border bg-card p-5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total estimado</span>
                <span className="font-heading text-lg text-foreground">${total.toLocaleString("es-CO")} COP</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                El valor final lo confirmamos en tu cotización.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
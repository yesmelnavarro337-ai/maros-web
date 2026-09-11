"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartLineItem } from "@/features/cart/cart-line-item";
import { useCart } from "@/features/cart/cart-context";
import { QuotationForm } from "@/features/quotation/components/quotation-form";
import { QuotationSuccess } from "@/features/quotation/components/quotation-success";
import { submitQuotation } from "@/features/quotation/services/quotation.service";
import type { QuotationResult } from "@/features/quotation/types";
import type { QuotationFormSchema } from "@/features/quotation/schemas/quotation.schema";

export default function CarritoPage() {
  const { items, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuotationResult | null>(null);

  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const totalCount = items.reduce((acc, i) => acc + i.quantity, 0);

  async function handleSubmit(values: QuotationFormSchema) {
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      const response = await submitQuotation(
        values,
        items.map((i) => ({
          productId: i.productId,
          productName: i.name,
          productSlug: i.slug,
          size: i.size,
          quantity: i.quantity,
          baseColor: i.colorName || undefined,
          customizationOptionIds: i.customizationOptionIds ?? [],
          embroideryText: i.embroideryText,
          totalPrice: i.price * i.quantity,
        }))
      );
      clear();
      setResult(response);
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return <QuotationSuccess whatsappLink={result.whatsappLink} />;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-4">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-5">
          <ShoppingBag className="h-7 w-7 text-primary" />
        </div>
        <h1 className="font-heading text-2xl text-foreground">Tu carrito está vacío</h1>
        <p className="text-muted-foreground mt-2 mb-6">
          Explora el catálogo y agrega tus pijamas favoritas.
        </p>
        <Button asChild size="lg">
          <Link href="/catalogo">Ver catálogo</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-xs text-muted-foreground mb-3">
        Inicio / <span className="text-foreground">Carrito · Cotización</span>
      </nav>
      <h1 className="font-heading text-3xl text-foreground mb-1">Tu carrito</h1>
      <p className="text-muted-foreground mb-8">
        {totalCount} {totalCount === 1 ? "producto" : "productos"} — revisa, ajusta cantidades y solicita tu cotización.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <CartLineItem key={item.key} cartKey={item.key} />
          ))}
        </ul>

        <div className="flex flex-col gap-5">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total estimado</span>
              <span className="font-heading text-xl text-foreground">${total.toLocaleString("es-CO")} COP</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              El valor final lo confirmamos en tu cotización.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <p className="font-heading text-lg text-foreground mb-3">Solicita tu cotización</p>
            <QuotationForm onSubmit={handleSubmit} submitting={submitting} />
          </div>
        </div>
      </div>
    </div>
  );
}
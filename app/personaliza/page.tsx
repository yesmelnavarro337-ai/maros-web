"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { WizardStepper } from "@/features/customization-wizard/components/wizard-stepper";
import { OptionGrid } from "@/features/customization-wizard/components/option-grid";
import { EmbroideryTextInput } from "@/features/customization-wizard/components/embroidery-text-input";
import { SelectionSummaryPanel } from "@/features/customization-wizard/components/selection-summary-panel";
import {
  getFabrics,
  getColors,
  getPrints,
  getEmbroideries,
} from "@/features/customization-wizard/services/customization-catalog.service";
import { getProductSummaryClient } from "@/features/product-detail/services/product-detail.client";
import { saveCustomizationDraft } from "@/lib/customization-draft";
import type { ProductClientSummary } from "@/features/product-detail/services/product-detail.client";
import type { CustomizationChoice, CustomizationSelections, WizardStepKey } from "@/features/customization-wizard/types";

const STEP_ORDER: WizardStepKey[] = ["tela", "color", "estampado", "bordado", "resumen"];

export default function PersonalizaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const productSlug = searchParams.get("producto") ?? "";
  const size = searchParams.get("talla") ?? "";
  const quantity = Number(searchParams.get("cantidad") ?? "1");

  const [product, setProduct] = useState<ProductClientSummary | null | undefined>(undefined);
  const [step, setStep] = useState<WizardStepKey>("tela");

  const [fabrics, setFabrics] = useState<CustomizationChoice[]>([]);
  const [colors, setColors] = useState<CustomizationChoice[]>([]);
  const [prints, setPrints] = useState<CustomizationChoice[]>([]);
  const [embroideries, setEmbroideries] = useState<CustomizationChoice[]>([]);

  const [selections, setSelections] = useState<CustomizationSelections>({});
  const [embroideryText, setEmbroideryText] = useState("");

  useEffect(() => {
    if (!productSlug) return;
    getProductSummaryClient(productSlug).then((data) => setProduct(data ?? null));
    getFabrics().then(setFabrics);
    getColors().then(setColors);
    getPrints().then(setPrints);
    getEmbroideries().then(setEmbroideries);
  }, [productSlug]);

  const selectedFabric = fabrics.find((f) => f.id === selections.telaId);
  const selectedColor = colors.find((c) => c.id === selections.colorId);
  const selectedPrint = prints.find((p) => p.id === selections.estampadoId);
  const selectedEmbroidery = embroideries.find((e) => e.id === selections.bordadoId);

  const total = useMemo(() => {
    if (!product) return 0;
    return (
      product.basePrice +
      (selectedFabric?.priceModifier ?? 0) +
      (selectedPrint?.priceModifier ?? 0) +
      (selectedEmbroidery?.priceModifier ?? 0)
    );
  }, [product, selectedFabric, selectedPrint, selectedEmbroidery]);

  function goNext() {
    const currentIndex = STEP_ORDER.indexOf(step);
    if (currentIndex < STEP_ORDER.length - 1) setStep(STEP_ORDER[currentIndex + 1]);
  }

  function goBack() {
    const currentIndex = STEP_ORDER.indexOf(step);
    if (currentIndex > 0) setStep(STEP_ORDER[currentIndex - 1]);
  }

  function canAdvance(): boolean {
    if (step === "tela") return !!selections.telaId;
    if (step === "color") return !!selections.colorId;
    if (step === "estampado") return !!selections.estampadoId;
    if (step === "bordado") return !!selections.bordadoId;
    return true;
  }

  function handleFinish() {
    if (!product) return;

    saveCustomizationDraft({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      basePrice: product.basePrice,
      size,
      baseColor: searchParams.get("color") ?? "",
      quantity,
      selections: { ...selections, embroideryText: embroideryText || undefined },
      totalPrice: total,
    });

    toast.success("Personalización lista");
    router.push("/cotizar");
  }

  if (!productSlug) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">
          Selecciona un producto desde el catálogo antes de personalizar.
        </p>
        <Button asChild className="mt-4">
          <a href="/catalogo">Ver catálogo</a>
        </Button>
      </div>
    );
  }

  if (product === undefined) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">No encontramos ese producto.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-xs text-muted-foreground mb-3">
        Inicio / <span className="text-foreground">Personalización</span>
      </nav>
      <h1 className="font-heading text-3xl text-foreground mb-1">
        Personaliza tu pijama <span className="text-primary">♡</span>
      </h1>
      <p className="text-muted-foreground mb-6">{product.name} — diseña tu pijama única en 5 simples pasos.</p>

      <WizardStepper current={step} />

      <div className="flex flex-col sm:flex-row gap-8 mt-8">
        <div className="flex-1">
          {step === "tela" && (
            <div>
              <h2 className="font-heading text-xl text-foreground mb-4">Elige la tela</h2>
              <OptionGrid
                options={fabrics}
                selectedId={selections.telaId}
                onSelect={(id) => setSelections((s) => ({ ...s, telaId: id }))}
              />
            </div>
          )}

          {step === "color" && (
            <div>
              <h2 className="font-heading text-xl text-foreground mb-4">Elige el color</h2>
              <OptionGrid
                options={colors}
                selectedId={selections.colorId}
                onSelect={(id) => setSelections((s) => ({ ...s, colorId: id }))}
                variant="swatch"
              />
            </div>
          )}

          {step === "estampado" && (
            <div>
              <h2 className="font-heading text-xl text-foreground mb-4">Elige el estampado</h2>
              <OptionGrid
                options={prints}
                selectedId={selections.estampadoId}
                onSelect={(id) => setSelections((s) => ({ ...s, estampadoId: id }))}
              />
            </div>
          )}

          {step === "bordado" && (
            <div>
              <h2 className="font-heading text-xl text-foreground mb-4">Elige el bordado</h2>
              <OptionGrid
                options={embroideries}
                selectedId={selections.bordadoId}
                onSelect={(id) => setSelections((s) => ({ ...s, bordadoId: id }))}
              />
              {selections.bordadoId && selections.bordadoId !== "none" && (
                <EmbroideryTextInput value={embroideryText} onChange={setEmbroideryText} />
              )}
            </div>
          )}

          {step === "resumen" && (
            <div>
              <h2 className="font-heading text-xl text-foreground mb-4">Resumen de tu diseño</h2>
              <div className="flex flex-col gap-2 text-sm">
                <p><span className="text-muted-foreground">Producto:</span> {product.name}</p>
                <p><span className="text-muted-foreground">Talla:</span> {size} · <span className="text-muted-foreground">Cantidad:</span> {quantity}</p>
                <p><span className="text-muted-foreground">Tela:</span> {selectedFabric?.name}</p>
                <p><span className="text-muted-foreground">Color:</span> {selectedColor?.name}</p>
                <p><span className="text-muted-foreground">Estampado:</span> {selectedPrint?.name}</p>
                <p><span className="text-muted-foreground">Bordado:</span> {selectedEmbroidery?.name}{embroideryText && ` — "${embroideryText}"`}</p>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step !== "tela" ? (
              <Button variant="outline" onClick={goBack}>Volver</Button>
            ) : (
              <span />
            )}
            {step === "resumen" ? (
              <Button onClick={handleFinish}>Solicitar cotización</Button>
            ) : (
              <Button onClick={goNext} disabled={!canAdvance()}>Siguiente</Button>
            )}
          </div>
        </div>

        <SelectionSummaryPanel
          productName={product.name}
          basePrice={product.basePrice}
          size={size}
          quantity={quantity}
          fabric={selectedFabric}
          color={selectedColor}
          print={selectedPrint}
          embroidery={selectedEmbroidery}
          embroideryText={embroideryText}
          total={total}
        />
      </div>
    </div>
  );
}
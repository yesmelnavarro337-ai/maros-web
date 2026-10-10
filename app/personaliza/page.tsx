"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ShoppingBag, Loader2, Info } from "lucide-react";
import { WizardStepper } from "@/features/customization-wizard/components/wizard-stepper";
import { OptionGrid } from "@/features/customization-wizard/components/option-grid";
import { EmbroideryTextInput } from "@/features/customization-wizard/components/embroidery-text-input";
import { SelectionSummaryPanel } from "@/features/customization-wizard/components/selection-summary-panel";
// import { AiAssistantPanel } from "@/features/customization-wizard/components/ai-assistant-panel"; // DESACTIVADO (asistente IA)
import { ProductCard } from "@/components/shared/product-card";
import { Reveal } from "@/components/shared/reveal";
import { ProductQuickViewModal } from "@/features/catalog/components/product-quick-view-modal";
import type { PersonalizeSelection } from "@/features/catalog/components/product-quick-view-modal";
import { useQuickView } from "@/features/catalog/hooks/use-quick-view";
import { useCart } from "@/features/cart/cart-context";
import {
  getFabrics,
  getColors,
  getPrints,
  getEmbroideries,
  getCustomizableModels,
  // getAssistantStatus, // DESACTIVADO (asistente IA)
  // type AssistantSuggestion, // DESACTIVADO (asistente IA)
} from "@/features/customization-wizard/services/customization-catalog.service";
import { getProductSummaryClient } from "@/features/product-detail/services/product-detail.client";
import { saveCustomizationDraft } from "@/lib/customization-draft";
import { sortSizes } from "@/lib/sizes";
import type { ProductPreview } from "@/types/product";
import type { ProductClientSummary } from "@/features/product-detail/services/product-detail.client";
import type { CustomizationChoice, CustomizationModel, CustomizationSelections, WizardStepKey } from "@/features/customization-wizard/types";

const STEP_ORDER: WizardStepKey[] = ["modelo", "tela", "color", "estampado", "bordado", "talla", "resumen"];
const MODELS_PAGE_SIZE = 6;
/** Recargo COP del bordado de diseño estándar (mismo valor que en la vista previa). */
const EMBROIDERY_DESIGN_SURCHARGE = 7000;

export default function PersonalizaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  const { isOpen, isLoading, previewProduct, fullProduct, openQuickView, closeQuickView } =
    useQuickView();

  // El producto puede llegar por `product` (slug) o `productId`. `producto` se
  // mantiene por compatibilidad con los enlaces históricos.
  const productSlug = searchParams.get("product") ?? searchParams.get("producto") ?? "";
  const productId = searchParams.get("productId") ?? "";
  const urlSize = searchParams.get("talla") ?? "";
  const quantity = Number(searchParams.get("cantidad") ?? "1");
  // Estado arrastrado desde la vista previa: `bordado=1` marca que el checklist
  // de bordado venía activo; `paso=tela` aterriza directo en el paso 2; el
  // `estilo` y `bordadotexto` completan el contexto para precargar el resumen.
  const urlBordado = searchParams.get("bordado");
  const urlPaso = searchParams.get("paso") ?? "";
  const urlEstilo = searchParams.get("estilo") ?? "";
  const urlBordadoTexto = searchParams.get("bordadotexto") ?? "";

  const [models, setModels] = useState<CustomizationModel[]>([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [hasMoreModels, setHasMoreModels] = useState(false);
  const [loadingMoreModels, setLoadingMoreModels] = useState(false);
  const [loadingModelSlug, setLoadingModelSlug] = useState("");
  const [product, setProduct] = useState<ProductClientSummary | null | undefined>(undefined);
  const [step, setStep] = useState<WizardStepKey>("modelo");

  const [fabrics, setFabrics] = useState<CustomizationChoice[]>([]);
  const [colors, setColors] = useState<CustomizationChoice[]>([]);
  const [prints, setPrints] = useState<CustomizationChoice[]>([]);
  const [embroideries, setEmbroideries] = useState<CustomizationChoice[]>([]);

  const [selections, setSelections] = useState<CustomizationSelections>({});
  const [embroideryText, setEmbroideryText] = useState(urlBordadoTexto);
  const [size, setSize] = useState(urlSize);
  const [styleName, setStyleName] = useState(urlEstilo);
  // const [assistantEnabled, setAssistantEnabled] = useState(false); // DESACTIVADO (asistente IA)

  // Asegura que la navegación desde la vista previa (checklist de bordado activo,
  // salto a paso 2) solo se aplique una vez, cuando el producto esté cargado.
  const pasoApplied = useRef(false);
  const bordadoApplied = useRef(false);
  const productRef = useRef<ProductClientSummary | null>(null);
  const embroideriesRef = useRef<CustomizationChoice[]>([]);

  // Si el checklist «Incluir bordado» venía activo en la vista previa, precarga
  // la opción de bordado de diseño (+$7.000) en cuanto producto y catálogo de
  // bordados estén disponibles. Se ejecuta desde los .then (async) para no
  // provocar renders en cascada dentro de un effect.
  const applyInitialBordado = useCallback(() => {
    if (bordadoApplied.current || urlBordado !== "1") return;
    const current = productRef.current;
    const list = embroideriesRef.current;
    if (!current || !list || list.length === 0) return;

    bordadoApplied.current = true;
    const assigned = new Set(current.customizationOptionIds ?? []);
    const visible = assigned.size === 0 ? list : list.filter((o) => o.id === "none" || assigned.has(o.id));
    const design =
      visible.find((e) => e.priceModifier === EMBROIDERY_DESIGN_SURCHARGE) ??
      visible.find((e) => e.id !== "none");
    if (design) {
      setSelections((s) => (s.bordadoId ? s : { ...s, bordadoId: design.id }));
    }
  }, [urlBordado]);

  useEffect(() => {
    getCustomizableModels(1, MODELS_PAGE_SIZE)
      .then((page) => {
        setModels(page.items);
        setHasMoreModels(page.hasMore);

        // Si llegó un productId, se resuelve a su slug para reutilizar la
        // misma carga que el resto del flujo.
        const targetSlug =
          productSlug || (productId ? (page.items.find((m) => m.id === productId)?.slug ?? "") : "");

        if (targetSlug) {
          setLoadingModelSlug(targetSlug);
          return getProductSummaryClient(targetSlug).then((detail) => {
            const normalized = detail?.allowCustomization ? detail : null;
            productRef.current = normalized;
            setProduct(normalized);
            if (detail?.sizes?.length) {
              setSize((current) =>
                current && detail.sizes.includes(current) ? current : sortSizes(detail.sizes)[0]
              );
            }

            // Enlace venido de la vista previa con `paso=tela`: saltamos directo
            // al paso 2 sin pasar por la rejilla de modelos.
            if (normalized && urlPaso === "tela" && !pasoApplied.current) {
              pasoApplied.current = true;
              setStep("tela");
            }

            applyInitialBordado();
          });
        }
        return undefined;
      })
      .then(() => setLoadingModelSlug(""))
      .finally(() => setModelsLoading(false));

    getFabrics().then(setFabrics);
    getColors().then(setColors);
    getPrints().then(setPrints);
    getEmbroideries().then((list) => {
      embroideriesRef.current = list;
      setEmbroideries(list);
      applyInitialBordado();
    });
    // getAssistantStatus().then(setAssistantEnabled); // DESACTIVADO (asistente IA)
  }, [productSlug, productId, urlPaso, applyInitialBordado]);

  // Al elegir un modelo en la vista previa (botón «Personalizar») la selección
  // llega por la URL (`product`): cerramos el modal para volver al asistente.
  useEffect(() => {
    if (productSlug || productId) {
      closeQuickView();
    }
  }, [productSlug, productId, closeQuickView]);

  async function handleLoadMoreModels() {
    setLoadingMoreModels(true);
    try {
      const nextPage = Math.floor(models.length / MODELS_PAGE_SIZE) + 1;
      const page = await getCustomizableModels(nextPage, MODELS_PAGE_SIZE);
      setModels((current) => {
        const seen = new Set(current.map((m) => m.id));
        return [...current, ...page.items.filter((m) => !seen.has(m.id))];
      });
      setHasMoreModels(page.hasMore);
    } finally {
      setLoadingMoreModels(false);
    }
  }

  const selectedFabric = fabrics.find((f) => f.id === selections.telaId);
  const selectedColor = colors.find((c) => c.id === selections.colorId);
  const selectedPrint = prints.find((p) => p.id === selections.estampadoId);
  const selectedEmbroidery = embroideries.find((e) => e.id === selections.bordadoId);

  // El modelo de personalización vinculado al producto limita las opciones
  // disponibles (telas, colores, estampados, bordados). Si el producto no tiene
  // un modelo asignado o este no tiene opciones, se muestran todas.
  const assignedOptionIds = useMemo(
    () => new Set(product?.customizationOptionIds ?? []),
    [product?.customizationOptionIds]
  );
  const visibleFabrics = useMemo(
    () => (assignedOptionIds.size === 0 ? fabrics : fabrics.filter((o) => assignedOptionIds.has(o.id))),
    [fabrics, assignedOptionIds]
  );
  const visibleColors = useMemo(
    () => (assignedOptionIds.size === 0 ? colors : colors.filter((o) => assignedOptionIds.has(o.id))),
    [colors, assignedOptionIds]
  );
  const visiblePrints = useMemo(
    () =>
      assignedOptionIds.size === 0
        ? prints
        : prints.filter((o) => o.id === "none" || assignedOptionIds.has(o.id)),
    [prints, assignedOptionIds]
  );
  const visibleEmbroideries = useMemo(
    () =>
      assignedOptionIds.size === 0
        ? embroideries
        : embroideries.filter((o) => o.id === "none" || assignedOptionIds.has(o.id)),
    [embroideries, assignedOptionIds]
  );

  // ── Selección actual enviada al asistente IA (DESACTIVADO) ──────────────
  /*
  const currentSelection = useMemo(() => {
    const selection: Record<string, string> = {};
    if (selections.telaId) selection.Tela = selections.telaId;
    if (selections.colorId) selection.Color = selections.colorId;
    if (selections.estampadoId) selection.Estampado = selections.estampadoId;
    if (selections.bordadoId) selection.Bordado = selections.bordadoId;
    return selection;
  }, [selections]);
  */

  const total = useMemo(() => {
    if (!product) return 0;
    return (
      product.basePrice +
      (selectedFabric?.priceModifier ?? 0) +
      (selectedPrint?.priceModifier ?? 0) +
      (selectedEmbroidery?.priceModifier ?? 0)
    );
  }, [product, selectedFabric, selectedPrint, selectedEmbroidery]);

  // Los modelos personalizables se presentan con la misma tarjeta del catálogo
  // (botón «Elegir» + vista previa rápida).
  const modelPreviews: ProductPreview[] = useMemo(
    () =>
      models.map((m) => ({
        id: m.id,
        slug: m.slug,
        name: m.name,
        price: m.price,
        image: m.image,
        sizes: m.sizes,
      })),
    [models]
  );

  // El botón «Personalizar» de la vista previa entrega el estilo elegido con su
  // precio real y avanza de inmediato al paso 2 (tela).
  function handlePersonalizeFromPreview(selection: PersonalizeSelection) {
    setProduct({
      id: selection.id,
      name: selection.name,
      slug: selection.slug,
      basePrice: selection.basePrice,
      image: selection.image,
      sizes: selection.sizes,
      colors: selection.colors,
      allowCustomization: selection.allowCustomization,
      customizationOptionIds: selection.customizationOptionIds,
    });
    setStyleName(selection.styleName);
    setSelections({});
    setEmbroideryText(selection.embroideryText ?? "");
    setSize(
      selection.size ||
        (selection.sizes.length ? (sortSizes(selection.sizes)[0] ?? "") : "")
    );
    closeQuickView();
    setStep("tela");

    // Si el checklist «Incluir bordado» estaba activo en la vista previa, se
    // precarga el bordado de diseño (o el primero disponible) para que el paso 5
    // arranque con esa opción elegida.
    if (selection.hasEmbroidery) {
      bordadoApplied.current = true;
      const design =
        visibleEmbroideries.find((e) => e.priceModifier === EMBROIDERY_DESIGN_SURCHARGE) ??
        visibleEmbroideries.find((e) => e.id !== "none");
      if (design) setSelections({ bordadoId: design.id });
    }
  }

  // ── Aplica la recomendación del asistente preservando lo ya elegido (DESACTIVADO) ──
  /*
  function handleApplyAssistant(suggestion: AssistantSuggestion, embroideryTextSuggestion?: string | null) {
    setSelections((current) => ({
      ...current,
      telaId: suggestion.telaId ?? current.telaId,
      colorId: suggestion.colorId ?? current.colorId,
      estampadoId: suggestion.estampadoId ?? current.estampadoId,
      bordadoId: suggestion.bordadoId ?? current.bordadoId,
    }));
    if (embroideryTextSuggestion) setEmbroideryText(embroideryTextSuggestion);
  }
  */

  function goNext() {
    if (step === "modelo" && !product) {
      toast.error("Debes elegir un modelo para continuar", {
        description:
          "Presiona «Elegir» en la pijama que quieras, revisa la vista previa y pulsa «Personalizar» para seleccionar el modelo.",
      });
      return;
    }
    const currentIndex = STEP_ORDER.indexOf(step);
    if (currentIndex < STEP_ORDER.length - 1) setStep(STEP_ORDER[currentIndex + 1]);
  }

  function goBack() {
    const currentIndex = STEP_ORDER.indexOf(step);
    if (currentIndex > 0) setStep(STEP_ORDER[currentIndex - 1]);
  }

  function canAdvance(): boolean {
    if (step === "modelo") return true;
    if (step === "tela") return !!selections.telaId;
    if (step === "color") return !!selections.colorId;
    if (step === "estampado") return !!selections.estampadoId;
    if (step === "bordado") return !!selections.bordadoId;
    if (step === "talla") return !!size;
    return true;
  }

  function handleFinish() {
    if (!product || !size) return;

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

  function handleAddToCart() {
    if (!product || !size) return;

    const optionIds = [
      selections.telaId,
      selections.colorId,
      selections.estampadoId && selections.estampadoId !== "none" ? selections.estampadoId : undefined,
      selections.bordadoId && selections.bordadoId !== "none" ? selections.bordadoId : undefined,
    ].filter((id): id is string => !!id);

    const labelParts = [
      selectedFabric?.name,
      selectedColor?.name,
      selectedPrint && selectedPrint.id !== "none" ? selectedPrint.name : undefined,
      selectedEmbroidery && selectedEmbroidery.id !== "none" ? selectedEmbroidery.name : undefined,
    ].filter((v): v is string => !!v);

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: total,
      image: product.image,
      size,
      colorName: "",
      colorHex: "",
      quantity,
      customizationOptionIds: optionIds,
      embroideryText: embroideryText || undefined,
      customizationLabel: labelParts.join(" · "),
    });

    toast.success("Agregado a tu carrito");
    router.push("/carrito");
  }

  if ((!productSlug && !productId) && modelsLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-xs text-muted-foreground mb-3">
        Inicio / <span className="text-foreground">Personalización</span>
      </nav>
      <h1 className="font-heading text-3xl text-foreground mb-1">
        Personaliza tu pijama <span className="text-primary">♡</span>
      </h1>
      <p className="text-muted-foreground mb-6">
        {product ? product.name : "Elige un modelo y diseñalo a tu gusto en 7 simples pasos."}
      </p>

      <WizardStepper current={step} />

      <div className="flex flex-col sm:flex-row gap-8 mt-8">
        <div className="flex-1">
          {/* DESACTIVADO (asistente IA)
          {assistantEnabled && product && ["tela", "color", "estampado", "bordado"].includes(step) && (
            <AiAssistantPanel
              productSlug={product.slug}
              currentSelection={currentSelection}
              onApply={handleApplyAssistant}
            />
          )}
          */}

          {step === "modelo" && (
            <div>
              <h2 className="font-heading text-xl text-foreground mb-4">1. Elige el modelo</h2>
              <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-primary/30 bg-primary/5 p-3">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Presiona <span className="font-semibold text-foreground">«Elegir»</span> en la pijama que quieras
                  para abrir su <span className="font-semibold text-foreground">vista previa</span>. Ahí debes
                  confirmar con <span className="font-semibold text-foreground">«Personalizar»</span> para
                  seleccionar el modelo y poder continuar al paso 2.
                </p>
              </div>

              {loadingModelSlug && (
                <p className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Cargando modelo…
                </p>
              )}

              {product && (
                <div className="mb-4 rounded-lg border border-primary/40 bg-primary/5 px-3 py-2 text-xs text-foreground">
                  Modelo elegido: <span className="font-semibold">{product.name}</span>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mt-6">
                {modelPreviews.map((model, index) => (
                  <Reveal key={model.id} delay={Math.min((index % 6) * 75, 400)} className="h-full">
                    <ProductCard product={model} onQuickView={openQuickView} />
                  </Reveal>
                ))}
              </div>

              {hasMoreModels && (
                <div className="mt-6 flex flex-col items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={handleLoadMoreModels}
                    disabled={loadingMoreModels}
                    className="bg-card"
                  >
                    {loadingMoreModels && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Ver más modelos
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {models.length} modelos cargados — seguimos mostrando el catálogo poco a poco.
                  </p>
                </div>
              )}
            </div>
          )}

          {step === "tela" && (
            <div>
              <h2 className="font-heading text-xl text-foreground mb-4">2. Elige la tela</h2>
              <OptionGrid
                options={visibleFabrics}
                selectedId={selections.telaId}
                onSelect={(id) => setSelections((s) => ({ ...s, telaId: id }))}
              />
            </div>
          )}

          {step === "color" && (
            <div>
              <h2 className="font-heading text-xl text-foreground mb-4">3. Elige el color</h2>
              <OptionGrid
                options={visibleColors}
                selectedId={selections.colorId}
                onSelect={(id) => setSelections((s) => ({ ...s, colorId: id }))}
                variant="swatch"
              />
            </div>
          )}

          {step === "estampado" && (
            <div>
              <h2 className="font-heading text-xl text-foreground mb-4">4. Elige el estampado</h2>
              <OptionGrid
                options={visiblePrints}
                selectedId={selections.estampadoId}
                onSelect={(id) => setSelections((s) => ({ ...s, estampadoId: id }))}
              />
            </div>
          )}

          {step === "bordado" && (
            <div>
              <h2 className="font-heading text-xl text-foreground mb-4">5. Elige el bordado</h2>
              <OptionGrid
                options={visibleEmbroideries}
                selectedId={selections.bordadoId}
                onSelect={(id) => setSelections((s) => ({ ...s, bordadoId: id }))}
              />
              {selections.bordadoId && selections.bordadoId !== "none" && (
                <EmbroideryTextInput value={embroideryText} onChange={setEmbroideryText} />
              )}
            </div>
          )}

          {step === "talla" && (
            <div>
              <h2 className="font-heading text-xl text-foreground mb-4">6. Elige la talla</h2>
              <div className="flex flex-wrap gap-2.5">
                {product?.sizes &&
                  sortSizes(product.sizes).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={cn(
                        "h-11 min-w-14 px-4 rounded-full border-2 text-sm font-medium transition-colors",
                        size === s ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:border-primary/40"
                      )}
                    >
                      {s}
                    </button>
                  ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                ¿Dudas con tu talla? Consulta la guía en el catálogo o pregunta por WhatsApp.
              </p>
            </div>
          )}

          {step === "resumen" && (
            <div>
              <h2 className="font-heading text-xl text-foreground mb-4">7. Resumen de tu diseño</h2>
              <div className="flex flex-col gap-2 text-sm">
                <p><span className="text-muted-foreground">Estilo / Modelo:</span> {product?.name}</p>
                <p>
                  <span className="text-muted-foreground">Talla:</span> {size} ·{" "}
                  <span className="text-muted-foreground">Cantidad:</span> {quantity}
                </p>
                <p><span className="text-muted-foreground">Tela:</span> {selectedFabric?.name}</p>
                <p><span className="text-muted-foreground">Color:</span> {selectedColor?.name}</p>
                <p><span className="text-muted-foreground">Estampado:</span> {selectedPrint?.name}</p>
                <p>
                  <span className="text-muted-foreground">Bordado:</span> {selectedEmbroidery?.name}
                  {embroideryText && ` — "${embroideryText}"`}
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Al solicitar la cotización nos pondremos en contacto contigo para confirmar los detalles y proponerte el precio final.
              </p>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step !== "modelo" ? (
              <Button variant="outline" onClick={goBack}>Volver</Button>
            ) : (
              <span />
            )}
            {step === "resumen" ? (
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button onClick={handleAddToCart} className="flex-1 bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Agregar al carrito
                </Button>
                <Button variant="outline" onClick={handleFinish} className="flex-1">
                  Solicitar cotización
                </Button>
              </div>
            ) : (
              <Button onClick={goNext} disabled={!canAdvance()} className="bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90">Siguiente</Button>
            )}
          </div>
        </div>

        <SelectionSummaryPanel
          productName={product?.name ?? ""}
          styleName={styleName}
          productImage={product?.image ?? ""}
          basePrice={product?.basePrice ?? 0}
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

      <ProductQuickViewModal
        isOpen={isOpen}
        previewProduct={previewProduct}
        fullProduct={fullProduct}
        isLoading={isLoading}
        onClose={closeQuickView}
        personalizeMode
        onPersonalize={handlePersonalizeFromPreview}
      />
    </div>
  );
}

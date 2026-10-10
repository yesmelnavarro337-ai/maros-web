"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  suggestCustomization,
  type AssistantSuggestion,
} from "../services/customization-catalog.service";

interface AiAssistantPanelProps {
  productSlug?: string;
  currentSelection?: Record<string, string>;
  onApply: (suggestion: AssistantSuggestion, embroideryText?: string | null) => void;
}

/**
 * Panel del asistente de estilo: describe en lenguaje natural el look deseado y
 * Gemini propone una combinación con las opciones reales del catálogo. No genera
 * imágenes; el preview del producto se mantiene intacto.
 */
export function AiAssistantPanel({ productSlug, currentSelection, onApply }: AiAssistantPanelProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState<string | null>(null);

  async function handleSuggest() {
    if (!message.trim()) {
      toast.error("Cuéntanos qué estilo buscas para poder sugerirte una combinación.");
      return;
    }

    setLoading(true);
    try {
      const result = await suggestCustomization({
        message: message.trim(),
        productSlug,
        currentSelection,
      });

      if (!result) {
        toast.error("El asistente no está disponible en este momento.");
        return;
      }

      setReply(result.reply);

      const hasSuggestion =
        !!result.suggestion.telaId ||
        !!result.suggestion.colorId ||
        !!result.suggestion.estampadoId ||
        !!result.suggestion.bordadoId;

      if (!hasSuggestion && !result.embroideryText) {
        toast.info("No encontramos una combinación nueva. Prueba describiendo el estilo de otra forma.");
        return;
      }

      onApply(result.suggestion, result.embroideryText);
      toast.success("Sugerencia aplicada a tu diseño.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-6 rounded-xl border border-primary/30 bg-primary/5 p-4">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Asistente de estilo</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Describe el estilo que buscas y te sugerimos una combinación con las opciones disponibles.
      </p>

      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ej: algo elegante en tonos tierra, para regalar"
        rows={2}
        maxLength={300}
        className="bg-card resize-none"
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            void handleSuggest();
          }
        }}
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={handleSuggest}
          disabled={loading}
          className="bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Sugerir combinación
        </Button>
        {reply && <p className="text-xs text-muted-foreground italic max-w-md">{reply}</p>}
      </div>
    </div>
  );
}

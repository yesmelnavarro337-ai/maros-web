import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

interface EmbroideryTextInputProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Campo para el texto/idea del bordado. Además del texto estándar, el cliente
 * puede describir una idea más avanzada (diseño, iniciales, nombres…). Se avisa
 * que una idea personalizada puede implicar un costo mayor al bordado estándar,
 * valor que se confirma al cotizar.
 */
export function EmbroideryTextInput({ value, onChange }: EmbroideryTextInputProps) {
  return (
    <div className="mt-4 max-w-md">
      <Label className="mb-1.5 block text-sm">¿Qué quieres bordar?</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ej. M.L., María López o tu idea personalizada"
        maxLength={60}
      />
      <p className="text-xs text-muted-foreground mt-1">Máximo 60 caracteres.</p>

      <div className="mt-2.5 flex items-start gap-1.5 rounded-lg border border-amber-200/70 bg-amber-50 px-2.5 py-2 text-[11px] leading-relaxed text-amber-800">
        <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
        <span>
          ¿Tienes una idea más avanzada (diseño, combinación de hilos, bordado en otra zona)?{" "}
          <span className="font-semibold">Escríbela y la confirmamos al cotizar:</span> puede
          tener un costo mayor al bordado estándar.
        </span>
      </div>
    </div>
  );
}
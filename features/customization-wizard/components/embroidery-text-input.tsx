import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmbroideryTextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function EmbroideryTextInput({ value, onChange }: EmbroideryTextInputProps) {
  return (
    <div className="mt-4 max-w-xs">
      <Label className="mb-1.5 block text-sm">¿Qué quieres bordar?</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ej. M.L. o María López"
        maxLength={30}
      />
      <p className="text-xs text-muted-foreground mt-1">Máximo 30 caracteres.</p>
    </div>
  );
}
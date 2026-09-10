import { Shirt, Sparkles, Truck, Heart } from "lucide-react";

interface ProductFeaturesStripProps {
  deliveryTime: string;
}

export function ProductFeaturesStrip({ deliveryTime }: ProductFeaturesStripProps) {
  const features = [
    { icon: Shirt, label: "Tela satín premium", subtitle: "Suave y fresca" },
    { icon: Sparkles, label: "Personalizable", subtitle: "A tu gusto" },
    { icon: Truck, label: "Envío rápido", subtitle: deliveryTime },
    { icon: Heart, label: "Hecho con amor", subtitle: "Calidad garantizada" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-6 border-t border-border">
      {features.map((f, i) => {
        const Icon = f.icon;
        return (
          <div key={i} className="flex items-center gap-2.5">
            <div className="rounded-full bg-secondary p-2 shrink-0">
              <Icon className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">{f.label}</p>
              <p className="text-[10px] text-muted-foreground">{f.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
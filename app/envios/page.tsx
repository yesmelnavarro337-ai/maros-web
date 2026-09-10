import { Truck, Clock, MapPin } from "lucide-react";

export default function EnviosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-xs text-muted-foreground mb-3">
        Inicio / <span className="text-foreground">Envíos y entregas</span>
      </nav>
      <h1 className="font-heading text-3xl text-foreground mb-6">Envíos y entregas</h1>

      <div className="flex flex-col gap-6">
        <div className="flex gap-3">
          <Truck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Envíos a todo Colombia</p>
            <p className="text-sm text-muted-foreground mt-1">
              Trabajamos con transportadoras aliadas para hacer llegar tu pedido a cualquier
              ciudad del país.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Tiempos de entrega</p>
            <p className="text-sm text-muted-foreground mt-1">
              El tiempo estimado varía según el producto y su nivel de personalización — lo
              verás detallado en cada ficha de producto, y te confirmamos el tiempo exacto al
              coordinar tu cotización.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Pago al recibir</p>
            <p className="text-sm text-muted-foreground mt-1">
              Confirmamos tu pedido por WhatsApp antes de despacharlo, para que tengas total
              claridad sobre lo que vas a recibir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
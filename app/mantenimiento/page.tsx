import Image from "next/image";

export default function MantenimientoPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Image src="/logo.png" alt="Maro's Pijamas" width={72} height={72} className="rounded-full mx-auto mb-6" />
        <h1 className="font-heading text-3xl text-foreground mb-3">Estamos mejorando para ti</h1>
        <p className="text-muted-foreground">
          Nuestro sitio está en mantenimiento temporal. Vuelve pronto — mientras tanto,
          escríbenos directo por WhatsApp si necesitas ayuda.
        </p>
      </div>
    </main>
  );
}
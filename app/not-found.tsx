import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Image src="/logo.png" alt="Maro's Pijamas" width={64} height={64} className="rounded-full mx-auto mb-6" />
        <h1 className="font-heading text-4xl text-foreground mb-2">404</h1>
        <p className="text-lg text-foreground mb-2">No encontramos esta página</p>
        <p className="text-muted-foreground mb-6">
          Puede que el enlace esté roto, o que el producto/artículo ya no esté disponible.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">Volver al inicio</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/catalogo">Ver catálogo</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
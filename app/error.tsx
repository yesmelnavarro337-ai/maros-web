"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error de renderizado en maros-web:", error);
  }, [error]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Image src="/logo.png" alt="Maro's Pijamas" width={64} height={64} className="rounded-full mx-auto mb-6 opacity-60" />
        <div className="rounded-full bg-destructive/10 p-3 w-fit mx-auto mb-4">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <h1 className="font-heading text-2xl text-foreground mb-2">Algo salió mal</h1>
        <p className="text-muted-foreground mb-6">
          No pudimos cargar esta página. Puede ser un problema temporal — intenta de nuevo en un momento.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset}>Reintentar</Button>
          <Button asChild variant="outline">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
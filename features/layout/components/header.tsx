"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { mainNavLinks } from "../config/navigation";
import { buildWhatsAppHref } from "@/features/settings/services/settings.service";
import type { PublicSettings } from "@/features/settings/types";

export function Header({ settings }: { settings: PublicSettings }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const whatsappHref = buildWhatsAppHref(settings.whatsappNumber, "¡Hola! Me interesa hacer un pedido de pijamas personalizadas.");

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src={settings.logoUrl || "/logo.png"}
              alt={settings.siteName}
              width={36}
              height={36}
              className="rounded-full"
            />
            <div className="leading-tight hidden sm:block">
              <p className="font-heading text-base text-foreground">MARO&apos;S</p>
              <p className="text-[9px] tracking-widest text-muted-foreground -mt-0.5">PIJAMAS</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {mainNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm transition-colors",
                    isActive ? "text-primary font-medium" : "text-foreground hover:text-primary"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="WhatsApp" asChild>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Carrito">
              <ShoppingBag className="h-5 w-5" />
            </Button>
            <Button asChild className="hidden md:inline-flex">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4 mr-2" />
                Cotizar por WhatsApp
              </a>
            </Button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle className="font-heading text-left">MARO&apos;S PIJAMAS</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-4 mt-4">
                  {mainNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "rounded-md px-3 py-2.5 text-sm transition-colors",
                        pathname === link.href
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-secondary"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Button asChild className="mt-3">
                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Cotizar por WhatsApp
                    </a>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}

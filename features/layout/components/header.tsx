"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, ShoppingBag, Search, Heart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/hooks/use-mounted";
import { mainNavLinks } from "../config/navigation";
import { useCart } from "@/features/cart/cart-context";
import { useWishlist } from "@/features/wishlist/wishlist-context";
import { buildWhatsAppHref } from "@/features/settings/services/settings.service";
import type { PublicSettings } from "@/features/settings/types";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

export function Header({ settings }: { settings: PublicSettings }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mounted = useMounted();
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const whatsappHref = buildWhatsAppHref(
    settings.whatsappNumber,
    "¡Hola! Me interesa hacer un pedido de pijamas personalizadas.",
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        isScrolled
          ? "bg-background/85 backdrop-blur-lg border-b border-border/80 shadow-sm"
          : "bg-background/70 backdrop-blur-md border-b border-border/30 shadow-none"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <Image
            src={cloudinaryUrl(settings.logoUrl || "/logo.png")}
            alt={settings.siteName}
            width={36}
            height={36}
            className="rounded-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="leading-tight hidden sm:block">
            <p className="font-heading text-base text-foreground transition-colors group-hover:text-primary">
              MARO&apos;S
            </p>
            <p className="text-[9px] tracking-widest text-muted-foreground -mt-0.5">
              PIJAMAS
            </p>
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
                  "text-sm font-medium transition-all duration-200 relative py-1",
                  isActive
                    ? "text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
                    : "text-foreground/90 hover:text-primary hover:scale-[1.02]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="inline-flex text-foreground"
            aria-label="Buscar"
            asChild
          >
            <Link href="/catalogo">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="inline-flex relative text-foreground"
            aria-label="Favoritos"
            asChild
          >
            <Link href="/favoritos">
              <Heart className="h-5 w-5" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-medium flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex text-foreground"
            aria-label="WhatsApp"
            asChild
          >
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="inline-flex relative text-foreground"
            aria-label="Carrito"
            asChild
          >
            <Link href="/carrito">
              <ShoppingBag className="h-5 w-5" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-medium flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>
          <Button asChild className="hidden md:inline-flex bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4 mr-2" />
              Cotizar por WhatsApp
            </a>
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Abrir menú"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-heading text-left">
                  MARO&apos;S PIJAMAS
                </SheetTitle>
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
                        : "text-foreground hover:bg-secondary",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button asChild className="mt-3 bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
  );
}

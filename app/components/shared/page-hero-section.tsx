"use client";

import { useEffect, useState } from "react";

interface PageHeroSectionProps {
  header: any;
  fallback?: {
    title: string;
    subtitle: string;
  };
}

export function PageHeroSection({ header, fallback }: PageHeroSectionProps) {
  const [showHeader, setShowHeader] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timeout = setTimeout(() => {
      setShowHeader(true);
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  if (!isMounted) {
    return fallback ? (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-heading text-foreground">{fallback.title}</h1>
        <p className="text-muted-foreground mt-2">{fallback.subtitle}</p>
      </div>
    ) : null;
  }

  // Efecto de blur basado en la posición de scroll
  const handleScroll = () => {
    const headerHeight = document.querySelector(".hero-header")?.clientHeight || 0;
    if (window.scrollY > headerHeight / 2) {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="hero-header min-h-[400px] w-full relative overflow-hidden bg-background">
      {/* Fondo con efecto de blur */}
      <div
        className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center bg-no-repeat"
        style={{
          filter: showHeader ? "blur(8px)" : "blur(0px)",
          transition: "filter 0.3s ease-in-out",
        }}
      />
      
      {/* Contenido transparente */}
      <div className="relative z-10 min-h-full flex flex-col items-center justify-center px-6 pt-20">
        {showHeader ? (
          <div className="backdrop-blur-xl backdrop-bg/50 border-b border-border w-full max-w-2xl text-center px-4">
            {header?.title && <h1 className="text-4xl font-heading text-foreground mb-2">{header.title}</h1>}
            {header?.subtitle && <p className="text-lg text-muted-foreground mb-6">{header.subtitle}</p>}
            {header?.action && <>{header.action}</>}
          </div>
        ) : (
          <div className="text-center">
            {fallback?.title && <h1 className="text-3xl font-heading text-foreground mb-2">{fallback.title}</h1>}
            {fallback?.subtitle && <p className="text-muted-foreground mb-6">{fallback.subtitle}</p>}
          </div>
        )}
      </div>
    </header>
  );
}
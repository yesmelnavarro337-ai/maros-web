export interface NavLink {
  label: string;
  href: string;
}

export const mainNavLinks: NavLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Personaliza", href: "/personaliza" },
  { label: "Colecciones", href: "/colecciones" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Blog", href: "/blog" },
  { label: "Contacto", href: "/contacto" },
];

export const footerHelpLinks: NavLink[] = [
  { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
  { label: "Envíos y entregas", href: "/envios" },
  { label: "Cambios y devoluciones", href: "/devoluciones" },
  { label: "Términos y condiciones", href: "/terminos" },
  { label: "Políticas de privacidad", href: "/privacidad" },
];
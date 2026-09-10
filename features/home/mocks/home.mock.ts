import type { ProductPreview } from "@/types/product";
export interface CategoryQuickLink {
  id: string;
  label: string;
  image: string;
  href: string;
}

export const mockCategoryLinks: CategoryQuickLink[] = [
  { id: "c1", label: "Mujer", image: "", href: "/catalogo?categoria=mujer" },
  { id: "c2", label: "Hombre", image: "", href: "/catalogo?categoria=hombre" },
  { id: "c3", label: "Parejas", image: "", href: "/catalogo?categoria=parejas" },
  { id: "c4", label: "Familia", image: "", href: "/catalogo?categoria=familia" },
  { id: "c5", label: "Niños", image: "", href: "/catalogo?categoria=ninos" },
  { id: "c6", label: "Batas", image: "", href: "/catalogo?categoria=batas" },
  { id: "c7", label: "Empresarial", image: "", href: "/catalogo?categoria=empresarial" },
];

export const mockFeaturedProducts: ProductPreview[] = [
  { id: "p1", slug: "pijama-satin-beige", name: "Pijama Satín Beige", price: 129000, image: "", rating: 4.8, reviewCount: 24 },
  { id: "p2", slug: "pijama-algodon-floral", name: "Pijama Algodón Floral", price: 119000, image: "", rating: 4.6, reviewCount: 18 },
  { id: "p3", slug: "bata-plush-rosa", name: "Bata Plush Rosa", price: 109000, image: "", rating: 4.9, reviewCount: 32 },
  { id: "p4", slug: "pijama-corazones", name: "Pijama Corazones", price: 129000, image: "", rating: 4.7, reviewCount: 21 },
];
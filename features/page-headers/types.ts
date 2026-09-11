export type PageKey = "collections" | "blog" | "gallery";

export interface PageHeader {
  pageKey: PageKey;
  title: string;
  subtitle: string;
  backgroundImage?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  textColor: string;
  overlayOpacity: number;
}
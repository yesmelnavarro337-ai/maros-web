export type PageKey = "collections" | "blog" | "gallery" | "about" | "historia";

export interface HeaderMedia {
  url: string;
  mediaType: "image" | "video";
  order: number;
}

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
  media: HeaderMedia[];
}
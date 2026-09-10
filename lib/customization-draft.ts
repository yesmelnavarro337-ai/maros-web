import type { CustomizationDraft } from "@/features/customization-wizard/types";

const KEY = "maros-customization-draft";

export function saveCustomizationDraft(draft: CustomizationDraft): void {
  sessionStorage.setItem(KEY, JSON.stringify(draft));
}

export function readCustomizationDraft(): CustomizationDraft | null {
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CustomizationDraft;
  } catch {
    return null;
  }
}

export function clearCustomizationDraft(): void {
  sessionStorage.removeItem(KEY);
}
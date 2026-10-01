import type { ProductDetailCategory } from "../types";

/** Set of sizes considered "plus size" with potential surcharge. */
const LARGE_SIZES = new Set(["XL", "2XL", "XXL", "3XL", "XXXL", "4XL", "XXXXL", "5XL"]);

/** Returns true if the size is considered a large/plus size (> L). */
export function isLargeSize(size: string): boolean {
  if (!size) return false;
  const s = size.trim().toUpperCase();
  return LARGE_SIZES.has(s) || (s.length >= 2 && s.includes("XL"));
}

/**
 * Computes the size surcharge based on the selected variant price vs. base price.
 * Returns 0 if the variant price is <= base price or unavailable.
 */
export function computeSizeSurcharge(
  variantPrice: number | null | undefined,
  basePrice: number
): number {
  if (variantPrice == null) return 0;
  const diff = variantPrice - basePrice;
  return diff > 0 ? diff : 0;
}

/**
 * Computes the category surcharge for a specific category.
 * Uses the product-specific category price, falling back to the category's default price.
 * Returns 0 if no surcharge applies.
 */
export function computeCategorySurcharge(
  category: ProductDetailCategory | undefined,
  basePrice: number
): number {
  if (!category) return 0;
  const categoryPrice = category.price ?? category.defaultPrice;
  if (categoryPrice == null) return 0;
  const diff = categoryPrice - basePrice;
  return diff > 0 ? diff : 0;
}

/**
 * Finds the active category from the product's category list based on the URL slug.
 * Returns undefined if no slug is provided or no match is found.
 */
export function findActiveCategory(
  categories: ProductDetailCategory[],
  filterCategorySlug?: string
): ProductDetailCategory | undefined {
  if (!filterCategorySlug) return undefined;
  const slugLower = filterCategorySlug.toLowerCase();
  return categories.find(
    (c) =>
      c.slug?.toLowerCase() === slugLower ||
      c.id?.toLowerCase() === slugLower
  );
}

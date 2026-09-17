import { serverApiFetch } from "@/lib/api/server-fetch";
import { readingTimeMinutes } from "../utils/reading-time";
import type { BlogPostDetail, BlogPostPreview } from "../types";

interface ApiBlogPost {
  title: string;
  slug: string;
  category: string;
  coverImageUrl?: string | null;
  content: string;
  publishDate: string;
}

function buildExcerpt(content: string, maxLength = 140): string {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength).trimEnd() + "...";
}

function adaptDetail(p: ApiBlogPost): BlogPostDetail {
  return {
    slug: p.slug,
    title: p.title,
    category: p.category,
    coverImage: p.coverImageUrl ?? undefined,
    excerpt: buildExcerpt(p.content),
    publishDate: p.publishDate.slice(0, 10),
    content: p.content,
    readingTimeMinutes: readingTimeMinutes(p.content),
  };
}

// Cache timeout en segundos (por defecto 60)
const CACHE_TIMEOUT = 60;

async function getAllPosts(revalidate: number = CACHE_TIMEOUT): Promise<ApiBlogPost[]> {
  const posts = await serverApiFetch<ApiBlogPost[]>("blog", { revalidateSeconds: revalidate });
  return posts;
}

export async function getBlogCategories(revalidate: number = CACHE_TIMEOUT): Promise<string[]> {
  const posts = await getAllPosts(revalidate);
  return Array.from(new Set(posts.map((p) => p.category))).sort();
}

export async function getBlogPosts(category?: string, revalidate: number = CACHE_TIMEOUT): Promise<BlogPostPreview[]> {
  const posts = await getAllPosts(revalidate);
  const filtered = category ? posts.filter((p) => p.category === category) : posts;
  return filtered.map(adaptDetail);
}

export async function getBlogPostBySlug(slug: string, revalidate: number = CACHE_TIMEOUT): Promise<BlogPostDetail | undefined> {
  const posts = await getAllPosts(revalidate);
  const match = posts.find((p) => p.slug === slug);
  return match ? adaptDetail(match) : undefined;
}

export async function getRecommendedPosts(currentSlug: string, revalidate: number = CACHE_TIMEOUT): Promise<BlogPostPreview[]> {
  const posts = await getAllPosts(revalidate);
  const current = posts.find((p) => p.slug === currentSlug);
  const others = posts.filter((p) => p.slug !== currentSlug);

  if (!current) return others.slice(0, 3).map(adaptDetail);

  const sameCategory = others.filter((p) => p.category === current.category);
  const filled = sameCategory.length >= 3
    ? sameCategory
    : [...sameCategory, ...others.filter((p) => p.category !== current.category)];

  return filled.slice(0, 3).map(adaptDetail);
}
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

async function getAllPosts(): Promise<BlogPostDetail[]> {
  const posts = await serverApiFetch<ApiBlogPost[]>("blog");
  return posts.map(adaptDetail).sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1));
}

export async function getBlogCategories(): Promise<string[]> {
  const posts = await getAllPosts();
  return Array.from(new Set(posts.map((p) => p.category))).sort();
}

export async function getBlogPosts(category?: string): Promise<BlogPostPreview[]> {
  const posts = await getAllPosts();
  return category ? posts.filter((p) => p.category === category) : posts;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostDetail | undefined> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug);
}

export async function getRecommendedPosts(currentSlug: string): Promise<BlogPostPreview[]> {
  const posts = await getAllPosts();
  const current = posts.find((p) => p.slug === currentSlug);
  const others = posts.filter((p) => p.slug !== currentSlug);

  if (!current) return others.slice(0, 3);

  const sameCategory = others.filter((p) => p.category === current.category);
  const filled = sameCategory.length >= 3
    ? sameCategory
    : [...sameCategory, ...others.filter((p) => p.category !== current.category)];

  return filled.slice(0, 3);
}
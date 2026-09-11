export interface BlogPostPreview {
  slug: string;
  title: string;
  category: string;
  coverImage?: string;
  excerpt: string;
  publishDate: string;
  readingTimeMinutes: number;
}

export interface BlogPostDetail extends BlogPostPreview {
  content: string;
}
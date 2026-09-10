import { notFound } from "next/navigation";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getBlogPostBySlug } from "@/features/blog/services/blog.service";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) return {};

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-xs text-muted-foreground mb-4">
        Inicio / <a href="/blog" className="hover:text-foreground">Blog</a> / <span className="text-foreground">{post.title}</span>
      </nav>

      <Badge variant="secondary" className="mb-3">{post.category}</Badge>
      <h1 className="font-heading text-3xl sm:text-4xl text-foreground leading-tight">{post.title}</h1>
      <p className="text-sm text-muted-foreground mt-2">{formatDate(post.publishDate)}</p>

      <div className="relative aspect-[16/9] rounded-2xl bg-secondary overflow-hidden my-6">
        {post.coverImage ? (
          <Image src={post.coverImage} alt={post.title} fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

      <p className="text-foreground leading-relaxed whitespace-pre-line">{post.content}</p>
    </article>
  );
}

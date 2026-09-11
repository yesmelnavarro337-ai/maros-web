import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, ImageOff, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BlogContent } from "@/features/blog/components/blog-content";
import { BlogPostCard } from "@/features/blog/components/blog-post-card";
import {
  getBlogPostBySlug,
  getRecommendedPosts,
} from "@/features/blog/services/blog.service";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

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

  const [post, recommended] = await Promise.all([
    getBlogPostBySlug(slug),
    getRecommendedPosts(slug),
  ]);
  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-xs text-muted-foreground mb-4">
        Inicio / <Link href="/blog" className="hover:text-foreground">Blog</Link> / <span className="text-foreground">{post.title}</span>
      </nav>

      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Inicio", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title, href: `/blog/${post.slug}` },
        ])}
      />

      <Badge variant="secondary" className="mb-3">{post.category}</Badge>
      <h1 className="font-heading text-3xl sm:text-4xl text-foreground leading-tight">{post.title}</h1>

      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" />
          Por el equipo de Maro&apos;s
        </span>
        <span>{formatDate(post.publishDate)}</span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {post.readingTimeMinutes} min de lectura
        </span>
      </div>

      <div className="relative aspect-[16/9] rounded-2xl bg-secondary overflow-hidden my-6">
        {post.coverImage ? (
          <Image src={cloudinaryUrl(post.coverImage)} alt={post.title} fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

      <BlogContent content={post.content} />

      {recommended.length > 0 && (
        <section className="border-t border-border mt-12 pt-8 pb-4">
          <h3 className="font-heading text-2xl text-foreground mb-6">Artículos recomendados</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-8">
            {recommended.map((p) => <BlogPostCard key={p.slug} post={p} />)}
          </div>
        </section>
      )}
    </article>
  );
}
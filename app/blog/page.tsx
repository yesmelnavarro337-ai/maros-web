import { BlogCategoryTabs } from "@/features/blog/components/blog-category-tabs";
import { BlogPostCard } from "@/features/blog/components/blog-post-card";
import { getBlogCategories, getBlogPosts } from "@/features/blog/services/blog.service";

export const metadata = {
  title: "Blog",
  description: "Consejos, ideas y todo sobre el mundo de las pijamas personalizadas.",
};

interface BlogPageProps {
  searchParams: Promise<{ categoria?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { categoria } = await searchParams;

  const [categories, posts] = await Promise.all([
    getBlogCategories(),
    getBlogPosts(categoria),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-xs text-muted-foreground mb-3">
        Inicio / <span className="text-foreground">Blog</span>
      </nav>
      <h1 className="font-heading text-3xl text-foreground">Blog</h1>
      <p className="text-muted-foreground mt-1 mb-6">Consejos, ideas y todo sobre el mundo de las pijamas.</p>

      <BlogCategoryTabs categories={categories} active={categoria} />

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-16">Sin artículos en esta categoría todavía.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-8 mt-8">
          {posts.map((post) => <BlogPostCard key={post.slug} post={post} />)}
        </div>
      )}
    </div>
  );
}
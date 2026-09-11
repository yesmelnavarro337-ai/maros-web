import { PageHeroSection } from "@/components/shared/page-hero-section";
import { BlogCategoryTabs } from "@/features/blog/components/blog-category-tabs";
import { BlogPostCard } from "@/features/blog/components/blog-post-card";
import { getBlogCategories, getBlogPosts } from "@/features/blog/services/blog.service";
import { getPageHeader } from "@/features/page-headers/services/page-headers.service";

export const metadata = {
  title: "Blog",
  description: "Consejos, inspiración y todo sobre pijamas personalizadas.",
};

interface BlogPageProps {
  searchParams: Promise<{ categoria?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { categoria } = await searchParams;

  const [categories, posts, header] = await Promise.all([
    getBlogCategories(),
    getBlogPosts(categoria),
    getPageHeader("blog"),
  ]);

  return (
    <>
      <PageHeroSection
        header={header}
        fallback={{
          title: "Blog",
          subtitle: "Consejos, inspiración y todo sobre pijamas personalizadas.",
        }}
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <BlogCategoryTabs categories={categories} active={categoria} />

        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-16">
            Sin artículos en esta categoría todavía.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {posts.map((post) => <BlogPostCard key={post.slug} post={post} />)}
          </div>
        )}
      </div>
    </>
  );
}
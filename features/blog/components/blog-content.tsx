import { RichText } from "@/components/shared/rich-text";

/**
 * Renders the main body of a blog post.
 *
 * The content arrives as an HTML string from the admin panel's rich-text
 * editor, so we use the shared `RichText` component to parse and render it
 * with proper typographic hierarchy.
 */
export function BlogContent({ content }: { content: string }) {
  return <RichText html={content} className="rich-text-blog" />;
}
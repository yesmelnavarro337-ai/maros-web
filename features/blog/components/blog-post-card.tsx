import Link from "next/link";
import Image from "next/image";
import { Clock, ImageOff, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BlogPostPreview } from "../types";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

export function BlogPostCard({ post }: { post: BlogPostPreview }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block transform-gpu transition-all duration-300 hover:-translate-y-2 hover:shadow-xl active:-translate-y-1 active:scale-[0.98] active:shadow-md bg-card p-3.5 rounded-2xl border border-border/50 hover:border-primary/40 select-none h-full flex flex-col justify-between"
    >
      <div>
        <div className="relative aspect-[16/10] rounded-xl bg-secondary overflow-hidden shadow-2xs">
          {post.coverImage ? (
            <Image
              src={cloudinaryUrl(post.coverImage)}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover group-hover:scale-108 group-active:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
        <p className="font-heading text-base text-foreground mt-3 leading-snug group-hover:text-primary transition-colors duration-200">
          {post.title}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-border/40 flex-wrap">
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="text-[10px] transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground"
          >
            {post.category}
          </Badge>
          <span className="text-xs text-muted-foreground">{formatDate(post.publishDate)}</span>
        </div>
        <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium group-hover:text-primary transition-colors">
          <Clock className="h-3 w-3 group-hover:rotate-12 transition-transform duration-300" />
          {post.readingTimeMinutes} min
        </span>
      </div>
    </Link>
  );
}

import Link from "next/link";
import Image from "next/image";
import { Clock, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BlogPostPreview } from "../types";
import { cloudinaryUrl } from "@/lib/images/cloudinary";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

export function BlogPostCard({ post }: { post: BlogPostPreview }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="relative aspect-[16/10] rounded-xl bg-secondary overflow-hidden">
        {post.coverImage ? (
          <Image
            src={cloudinaryUrl(post.coverImage)}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
      </div>
      <p className="font-heading text-base text-foreground mt-3 leading-snug">{post.title}</p>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <Badge variant="secondary" className="text-[10px]">{post.category}</Badge>
        <span className="text-xs text-muted-foreground">{formatDate(post.publishDate)}</span>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {post.readingTimeMinutes} min
        </span>
      </div>
    </Link>
  );
}

import { Star } from "lucide-react";

export function StarRatingDisplay({ rating, size = "sm" }: { rating: number; size?: "sm" | "xs" }) {
  const starSize = size === "xs" ? "h-3 w-3" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${starSize} ${i <= Math.round(rating) ? "fill-[#A38A3E] text-[#A38A3E]" : "fill-none text-muted-foreground"}`}
        />
      ))}
    </div>
  );
}
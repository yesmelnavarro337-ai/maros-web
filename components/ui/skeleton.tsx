import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("rounded-md bg-muted/60 shimmer-effect", className)}
      {...props}
    />
  );
}

export { Skeleton }

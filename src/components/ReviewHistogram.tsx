"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Review } from "@/lib/types";

type Props = {
  reviews: Review[];
  averageRating: number;
  className?: string;
  onStarClick?: (rating: number | null) => void;
  activeRating?: number | null;
};

export default function ReviewHistogram({
  reviews,
  averageRating,
  className,
  onStarClick,
  activeRating,
}: Props) {
  const total = reviews.length;
  const buckets: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const r of reviews) {
    if (r.rating >= 1 && r.rating <= 5) buckets[r.rating]++;
  }

  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-stretch md:gap-8", className)}>
      {/* Average */}
      <div className="flex flex-col items-center justify-center md:w-44">
        <p className="text-5xl font-extrabold text-primary">
          {averageRating.toFixed(1)}
        </p>
        <div className="mt-2 flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="size-5 fill-gold text-gold"
              strokeWidth={1.5}
            />
          ))}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {total} تقييم عالمي
        </p>
      </div>

      {/* Histogram */}
      <div className="flex-1 space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = buckets[star];
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const isActive = activeRating === star;
          return (
            <button
              key={star}
              type="button"
              disabled={!onStarClick}
              onClick={() =>
                onStarClick?.(isActive ? null : star)
              }
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs transition",
                onStarClick && "hover:bg-muted",
                isActive && "bg-primary/10"
              )}
            >
              <span className="flex w-12 shrink-0 items-center gap-1 font-bold text-foreground">
                {star}{" "}
                <Star className="size-3 fill-gold text-gold" />
              </span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gold-gradient transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-10 shrink-0 text-end text-xs font-semibold text-muted-foreground">
                {pct}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

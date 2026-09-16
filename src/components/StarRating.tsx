"use client";

import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  rating: number;
  size?: number;
  className?: string;
  showValue?: boolean;
  reviewCount?: number;
};

export default function StarRating({
  rating,
  size = 16,
  className,
  showValue = false,
  reviewCount,
}: Props) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25 && rating - full < 0.75;
  const extra = rating - full >= 0.75 ? 1 : 0;
  const empty = 5 - full - (hasHalf ? 1 : 0) - extra;
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center" aria-label={`تقييم ${rating} من 5`}>
        {Array.from({ length: full + extra }).map((_, i) => (
          <Star
            key={`f${i}`}
            size={size}
            className="fill-gold text-gold"
            strokeWidth={1.5}
          />
        ))}
        {hasHalf && (
          <div className="relative" style={{ width: size, height: size }}>
            <Star
              size={size}
              className="text-gold absolute inset-0"
              strokeWidth={1.5}
            />
            <StarHalf
              size={size}
              className="fill-gold text-gold absolute inset-0"
              strokeWidth={1.5}
            />
          </div>
        )}
        {Array.from({ length: Math.max(0, empty) }).map((_, i) => (
          <Star
            key={`e${i}`}
            size={size}
            className="text-muted-foreground/40"
            strokeWidth={1.5}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-xs text-muted-foreground">
          {rating.toFixed(1)}
          {typeof reviewCount === "number" && (
            <span className="mx-1">({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  );
}

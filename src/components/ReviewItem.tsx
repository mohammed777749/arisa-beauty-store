"use client";

import { useState } from "react";
import { Star, ThumbsUp, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Review } from "@/lib/types";
import { toast } from "sonner";

type Props = {
  review: Review;
  className?: string;
};

export default function ReviewItem({ review, className }: Props) {
  const [helpful, setHelpful] = useState(review.helpful);
  const [voted, setVoted] = useState(false);

  const handleHelpful = async () => {
    if (voted) return;
    setVoted(true);
    setHelpful((h) => h + 1);
    // Optimistic; no API call needed for demo
    toast.success("شكراً لملاحظتك!");
  };

  const dateStr = new Date(review.createdAt).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article
      className={cn(
        "rounded-xl border border-border bg-card p-4 shadow-amazon",
        className
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="grid size-9 place-items-center rounded-full bg-primary-gradient text-sm font-bold text-white">
          {review.author.charAt(0)}
        </span>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-bold text-foreground">{review.author}</p>
            {review.verified && (
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600">
                <BadgeCheck className="size-3.5" />
                شراء موثّق
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground">{dateStr}</p>
        </div>
      </div>
      <div className="mb-1.5 flex items-center gap-2">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "size-3.5",
                i < review.rating
                  ? "fill-gold text-gold"
                  : "text-muted-foreground/40"
              )}
            />
          ))}
        </div>
        <p className="text-xs font-bold text-foreground">{review.title}</p>
      </div>
      <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
        {review.body}
      </p>
      <div className="flex items-center gap-3 border-t border-border/60 pt-3">
        <button
          type="button"
          onClick={handleHelpful}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition",
            voted
              ? "border-primary bg-primary/5 text-primary"
              : "border-border text-muted-foreground hover:bg-muted"
          )}
        >
          <ThumbsUp className="size-3.5" />
          مفيد ({helpful})
        </button>
        <span className="text-[11px] text-muted-foreground">|</span>
        <button
          type="button"
          className="text-[11px] text-muted-foreground hover:text-foreground hover:underline"
        >
          إبلاغ
        </button>
      </div>
    </article>
  );
}

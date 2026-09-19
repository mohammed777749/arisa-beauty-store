"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Eye, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import StarRating from "@/components/StarRating";
import {
  formatPrice,
  CURRENCY,
  parseService,
  formatDurationAr,
  type Service,
} from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  service: Service;
  index?: number;
  className?: string;
  categoryName?: string;
};

export default function ServiceCard({ service, index = 0, className, categoryName }: Props) {
  const s = parseService(service);
  const discount =
    s.oldPrice && s.oldPrice > s.price
      ? Math.round(((s.oldPrice - s.price) / s.oldPrice) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
      className={cn("group h-full", className)}
    >
      <Link
        href={`?view=service&id=${s.id}`}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-rose"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={s.image}
            alt={s.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Badges */}
          <div className="absolute right-3 top-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <Badge className="bg-destructive text-white shadow-sm">
                خصم {discount}%
              </Badge>
            )}
            {s.isFeatured && (
              <Badge className="bg-gold text-white shadow-sm">
                <Sparkles className="size-3 ml-1" /> مميز
              </Badge>
            )}
            {s.isPopular && (
              <Badge className="bg-primary text-primary-foreground shadow-sm">
                الأكثر طلباً
              </Badge>
            )}
          </div>
          {/* Duration badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-foreground shadow-sm backdrop-blur">
            <Clock className="size-3 text-primary" />
            {formatDurationAr(s.duration)}
          </div>
          {/* Quick view */}
          <div className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white/90 py-2 text-xs font-bold text-foreground shadow-sm backdrop-blur">
              <Eye className="size-3.5" /> التفاصيل
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-center justify-between">
            {categoryName ? (
              <span className="text-[11px] font-semibold uppercase tracking-wide text-gold">
                {categoryName}
              </span>
            ) : (
              <span className="text-[11px] font-semibold uppercase tracking-wide text-gold">
                خدمة تجميل
              </span>
            )}
            <StarRating rating={s.rating} size={12} showValue reviewCount={s.reviewCount} />
          </div>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug text-foreground">
            {s.name}
          </h3>
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {s.description}
          </p>

          <div className="mt-auto flex items-end justify-between pt-2">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-primary">
                  {formatPrice(s.price)}
                </span>
                <span className="text-xs font-bold text-primary">{CURRENCY}</span>
              </div>
              {s.oldPrice && s.oldPrice > s.price && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(s.oldPrice)} {CURRENCY}
                </span>
              )}
            </div>
            <span className="flex items-center gap-1 rounded-full bg-primary-gradient px-3 py-1.5 text-[11px] font-bold text-white shadow-rose">
              احجزي الآن
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="mt-2 flex items-end justify-between">
          <div className="h-6 w-16 animate-pulse rounded bg-muted" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}

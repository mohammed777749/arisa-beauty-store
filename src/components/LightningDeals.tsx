"use client";

import { useEffect, useState } from "react";
import { Zap, Clock, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { formatPrice, CURRENCY, parseProduct } from "@/lib/types";

const TARGET = new Date();
TARGET.setHours(23, 59, 59, 999); // end of today

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { hours, minutes, seconds };
}

export default function LightningDeals({ products }: { products: Product[] }) {
  const { hours, minutes, seconds } = useCountdown(TARGET);
  if (!products || products.length === 0) return null;

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <section className="container mx-auto max-w-7xl px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-2xl border border-amber-300 bg-gradient-to-l from-amber-50 to-white shadow-amazon"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 bg-amber-100/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-full bg-amber-500 text-white">
              <Zap className="size-4" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-amber-900">
                عروض اليوم
              </h2>
              <p className="text-[11px] text-amber-700">
                خصومات محدودة تنتهي اليوم!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-amber-700" />
            <span className="text-xs font-bold text-amber-900">
              ينتهي خلال:
            </span>
            <div className="flex items-center gap-1" dir="ltr">
              <span className="grid min-w-7 place-items-center rounded bg-amber-900 px-1.5 py-0.5 text-xs font-bold text-white">
                {pad(hours)}
              </span>
              <span className="font-bold text-amber-900">:</span>
              <span className="grid min-w-7 place-items-center rounded bg-amber-900 px-1.5 py-0.5 text-xs font-bold text-white">
                {pad(minutes)}
              </span>
              <span className="font-bold text-amber-900">:</span>
              <span className="grid min-w-7 place-items-center rounded bg-amber-900 px-1.5 py-0.5 text-xs font-bold text-white">
                {pad(seconds)}
              </span>
            </div>
          </div>
          <Link
            href="?view=shop&sort=price-asc"
            className="flex items-center gap-1 text-xs font-bold text-amber-900 hover:underline"
          >
            عرض الكل
            <ChevronLeft className="size-3.5" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto p-4 no-scrollbar">
          {products.map((p) => {
            const parsed = parseProduct(p);
            const discount =
              parsed.oldPrice && parsed.oldPrice > p.price
                ? Math.round(((parsed.oldPrice - p.price) / parsed.oldPrice) * 100)
                : 0;
            return (
              <Link
                key={p.id}
                href={`?view=product&id=${p.id}`}
                className="group flex w-40 shrink-0 flex-col gap-2 rounded-xl border border-border bg-card p-2 shadow-amazon transition hover:-translate-y-0.5 hover:border-amber-300 md:w-44"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="176px"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {discount > 0 && (
                    <span className="absolute right-2 top-2 rounded bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-white">
                      -{discount}%
                    </span>
                  )}
                </div>
                <p className="line-clamp-2 text-[11px] font-bold leading-snug">
                  {p.name}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-extrabold text-primary">
                    {formatPrice(p.price)}
                  </span>
                  <span className="text-[10px] font-bold text-primary">
                    {CURRENCY}
                  </span>
                  {parsed.oldPrice && (
                    <span className="text-[10px] text-muted-foreground line-through">
                      {formatPrice(parsed.oldPrice)}
                    </span>
                  )}
                </div>
                <div className="mt-1">
                  <div className="h-1.5 overflow-hidden rounded-full bg-amber-100">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{ width: `${30 + (discount % 5) * 12}%` }}
                    />
                  </div>
                  <p className="mt-0.5 text-[10px] text-amber-700">
                    تم بيع {30 + discount}% من الكمية
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

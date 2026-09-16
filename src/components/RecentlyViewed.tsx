"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { History, ChevronLeft, ChevronRight } from "lucide-react";
import { useRecentlyViewed } from "@/store/recentlyViewed";
import type { Product } from "@/lib/types";
import { formatPrice, CURRENCY } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function RecentlyViewed() {
  const items = useRecentlyViewed((s) => s.items);
  const hasHydrated = useRecentlyViewed((s) => s.hasHydrated);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasHydrated || items.length === 0) {
      setProducts([]);
      return;
    }
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/products?limit=20&ids=${items.join(",")}`,
          { cache: "no-store" }
        );
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.products ?? [];
        // Sort by recently viewed order
        const sorted = items
          .map((id) => list.find((p: Product) => p.id === id))
          .filter(Boolean) as Product[];
        if (active) setProducts(sorted);
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [items, hasHydrated]);

  if (!hasHydrated || products.length === 0) return null;

  return (
    <section className="container mx-auto max-w-7xl px-4 py-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-extrabold text-foreground">
          <History className="size-5 text-primary" />
          شوهدت مؤخراً
        </h2>
        <div className="hidden items-center gap-1 md:flex">
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-full"
            onClick={() => {
              const scroller = document.getElementById("recently-viewed-scroller");
              scroller?.scrollBy({ left: 280, behavior: "smooth" });
            }}
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-full"
            onClick={() => {
              const scroller = document.getElementById("recently-viewed-scroller");
              scroller?.scrollBy({ left: -280, behavior: "smooth" });
            }}
          >
            <ChevronLeft className="size-4" />
          </Button>
        </div>
      </div>
      <div
        id="recently-viewed-scroller"
        className="flex gap-3 overflow-x-auto pb-2 no-scrollbar"
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square w-44 shrink-0 animate-pulse rounded-xl bg-muted"
              />
            ))
          : products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
                className="w-44 shrink-0"
              >
                <Link
                  href={`?view=product&id=${p.id}`}
                  className="group flex flex-col gap-2 overflow-hidden rounded-xl border border-border bg-card p-2 shadow-amazon transition hover:-translate-y-0.5 hover:border-primary/40"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="176px"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="line-clamp-2 text-[11px] font-bold leading-snug text-foreground">
                      {p.name}
                    </p>
                    <p className="text-xs font-extrabold text-primary">
                      {formatPrice(p.price)} {CURRENCY}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
      </div>
    </section>
  );
}

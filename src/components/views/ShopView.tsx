"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import ProductGrid from "@/components/ProductGrid";
import Filters from "@/components/Filters";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";
import type { CategoryWithCount, Product } from "@/lib/types";

export default function ShopView() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") ?? "newest";
  const search = searchParams.get("search");

  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        const cats = await res.json();
        if (active) setCategories(cats);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category) params.set("category", category);
        if (sort) params.set("sort", sort);
        if (search) params.set("search", search);
        const res = await fetch(`/api/products?${params.toString()}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (active) setProducts(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [category, sort, search]);

  const activeCat = categories.find((c) => c.slug === category);
  const title = activeCat
    ? activeCat.name
    : search
    ? `نتائج البحث عن: "${search}"`
    : "كل المنتجات";

  return (
    <div className="bg-rose-gradient">
      {/* Page hero */}
      <div className="border-b border-border/60 bg-primary-gradient">
        <div className="container mx-auto max-w-7xl px-4 py-10 text-center text-white md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold backdrop-blur">
              <Sparkles className="size-3.5 text-gold" />
              {activeCat ? activeCat.nameEn : "All Products"}
            </span>
            <h1 className="mt-4 text-3xl font-extrabold md:text-4xl">{title}</h1>
            <p className="mx-auto mt-2 max-w-xl text-sm text-white/85">
              {activeCat?.description ||
                "تصفحي مجموعتنا الكاملة من منتجات التجميل الفاخرة المختارة بعناية لكِ"}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar filters */}
          <div className="lg:sticky lg:top-40 lg:h-fit">
            <Filters categories={categories} />
          </div>

          {/* Products */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {loading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  <span>
                    <span className="font-bold text-foreground">
                      {products.length}
                    </span>{" "}
                    منتج
                  </span>
                )}
              </p>
            </div>
            <ProductGrid products={products} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}

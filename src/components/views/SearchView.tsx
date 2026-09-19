"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, SearchX, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import ShopFilters from "@/components/ShopFilters";
import ShopToolbar from "@/components/ShopToolbar";
import Pagination from "@/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { CategoryWithCount, Product } from "@/lib/types";

const PER_PAGE = 12;

const ALL_SHADES = [
  "أحمر كلاسيكي",
  "وردي عاري",
  "نود بيج",
  "أحمر فونت",
  "بنفسجي داكن",
  "شفاف لامع",
  "وردي لؤلؤي",
  "خوخي",
  "أحمر خفيف",
  "أحمر",
  "وردي",
  "نود",
  "بني",
  "وردي طبيعي",
  "توتي",
  "مرجاني",
  "وردي فاتح",
  "أسود",
  "فرنسي أبيض",
  "ميتاليك ذهبي",
];

const SUGGESTIONS = ["أحمر شفاه", "عطر", "سيروم", "ماسكارا", "أرغان"];

export default function SearchView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") ?? searchParams.get("search") ?? "";
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") ?? "relevance";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const rating = searchParams.get("rating");
  const brand = searchParams.get("brand");
  const prime = searchParams.get("prime");
  const inStock = searchParams.get("inStock");
  const pageParam = Number(searchParams.get("page") ?? "1");
  const page = isNaN(pageParam) ? 1 : Math.max(1, pageParam);

  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");

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
        params.set("page", String(page));
        params.set("limit", String(PER_PAGE));
        if (q) params.set("search", q);
        if (category) params.set("category", category);
        if (sort) params.set("sort", sort);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (rating) params.set("rating", rating);
        if (brand) params.set("brand", brand);
        if (prime) params.set("prime", prime);
        if (inStock) params.set("inStock", inStock);
        const res = await fetch(`/api/products?${params.toString()}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!active) return;
        if (Array.isArray(data)) {
          setProducts(data);
          setTotal(data.length);
        } else {
          setProducts(data.products ?? []);
          setTotal(data.total ?? 0);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [q, category, sort, minPrice, maxPrice, rating, brand, prime, inStock, page]);

  const brands = useMemo(() => ["جلورية", "جلورية لوكس"], []);
  const showShades = category === "lips" || category === "nails";

  const onSortChange = (v: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", v);
    params.set("view", "search");
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-amazon-divider bg-muted/30">
        <div className="container mx-auto flex max-w-7xl items-center gap-1 px-4 py-2 text-xs text-muted-foreground">
          <Link href="?view=home" className="hover:text-primary">
            الرئيسية
          </Link>
          <ChevronLeft className="size-3" />
          <span className="font-bold text-foreground">نتائج البحث</span>
        </div>
      </div>

      {/* Search header */}
      <div className="border-b border-amazon-divider bg-gradient-to-l from-rose-50 to-background">
        <div className="container mx-auto max-w-7xl px-4 py-5">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-xl font-extrabold text-foreground md:text-2xl"
          >
            نتائج البحث عن:{" "}
            <span className="text-primary">&ldquo;{q}&rdquo;</span>
          </motion.h1>
          <p className="mt-1 text-sm text-muted-foreground">
            عُثر على <span className="font-bold text-foreground">{total}</span> نتيجة
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-5">
        <div className="grid gap-5 lg:grid-cols-[230px_1fr]">
          <div className="hidden lg:sticky lg:top-28 lg:block lg:h-fit">
            <ShopFilters
              categories={categories}
              brands={brands}
              total={total}
              view="search"
              showShades={showShades}
              shades={showShades ? ALL_SHADES : []}
            />
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between lg:hidden">
              <Button
                variant="outline"
                size="sm"
                className="rounded-md"
                onClick={() => setFiltersOpen(true)}
              >
                <SlidersHorizontal className="size-4" />
                تصفية النتائج
              </Button>
              <p className="text-xs text-muted-foreground">
                <span className="font-bold text-foreground">{total}</span> نتيجة
              </p>
            </div>

            <ShopToolbar
              total={total}
              page={page}
              limit={PER_PAGE}
              sort={sort}
              view={view}
              onSortChange={onSortChange}
              onViewChange={setView}
              className="hidden lg:flex"
            />

            <div className="mt-4">
              {loading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square w-full rounded-xl" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
                  <SearchX className="mb-3 size-12 text-muted-foreground" />
                  <p className="text-lg font-bold text-foreground">
                    لم نعثر على نتائج
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    جرّبي كلمات بحث أخرى أو تصفحي الأقسام
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    {SUGGESTIONS.map((s) => (
                      <Link
                        key={s}
                        href={`?view=search&q=${encodeURIComponent(s)}`}
                        className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium transition hover:bg-muted"
                      >
                        {s}
                      </Link>
                    ))}
                  </div>
                  <Button asChild className="mt-6 bg-cta-gold font-bold text-primary hover:brightness-105">
                    <Link href="?view=shop">تصفحي كل المنتجات</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {products.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
                </div>
              )}
            </div>

            {!loading && total > PER_PAGE && (
              <Pagination page={page} totalPages={Math.ceil(total / PER_PAGE)} />
            )}
          </div>
        </div>
      </div>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-sm">
          <SheetHeader className="border-b bg-card p-4">
            <SheetTitle className="text-sm font-extrabold">تصفية النتائج</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <ShopFilters
              categories={categories}
              brands={brands}
              total={total}
              view="search"
              showShades={showShades}
              shades={showShades ? ALL_SHADES : []}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

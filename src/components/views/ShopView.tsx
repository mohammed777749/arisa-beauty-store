"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import ProductGrid from "@/components/ProductGrid";
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

export default function ShopView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") ?? "relevance";
  const search = searchParams.get("search");
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

  // Categories
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

  // Products
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(PER_PAGE));
        if (category) params.set("category", category);
        if (sort) params.set("sort", sort);
        if (search) params.set("search", search);
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
  }, [category, sort, search, minPrice, maxPrice, rating, brand, prime, inStock, page]);

  const activeCat = categories.find((c) => c.slug === category);
  const title = activeCat ? activeCat.name : search ? `نتائج البحث عن: "${search}"` : "كل المنتجات";

  const brands = useMemo(() => {
    // Derive brand list from currently loaded categories' products (limited; better: separate API)
    // Fallback to common brands
    return ["أريسا", "أريسا لوكس"];
  }, []);

  const showShades = category === "lips" || category === "nails";

  const onSortChange = (v: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", v);
    params.set("view", "shop");
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
          <Link href="?view=shop" className="hover:text-primary">
            المتجر
          </Link>
          {activeCat && (
            <>
              <ChevronLeft className="size-3" />
              <span className="font-bold text-foreground">{activeCat.name}</span>
            </>
          )}
        </div>
      </div>

      {/* Page header */}
      <div className="border-b border-amazon-divider bg-gradient-to-l from-rose-50 to-background">
        <div className="container mx-auto max-w-7xl px-4 py-5">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-extrabold text-foreground md:text-3xl">
              {title}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              {activeCat?.description ||
                "تصفحي مجموعتنا الكاملة من منتجات التجميل الفاخرة المختارة بعناية لكِ"}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-5">
        <div className="grid gap-5 lg:grid-cols-[230px_1fr]">
          {/* Sidebar filters - desktop */}
          <div className="hidden lg:sticky lg:top-28 lg:block lg:h-fit">
            <ShopFilters
              categories={categories}
              brands={brands}
              total={total}
              showShades={showShades}
              shades={showShades ? ALL_SHADES : []}
            />
          </div>

          {/* Main */}
          <div>
            {/* Mobile filter button */}
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
                <div
                  className={
                    view === "grid"
                      ? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
                      : "flex flex-col gap-3"
                  }
                >
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      className={
                        view === "grid"
                          ? "aspect-square w-full rounded-xl"
                          : "h-28 w-full rounded-xl"
                      }
                    />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
                  <p className="text-lg font-bold text-foreground">
                    لا توجد منتجات مطابقة
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    جرّبي تعديل الفلاتر أو البحث بكلمة أخرى
                  </p>
                </div>
              ) : view === "grid" ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {products.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {products.map((p, i) => (
                    <ListRow key={p.id} product={p} index={i} />
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

      {/* Mobile filters sheet */}
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
              showShades={showShades}
              shades={showShades ? ALL_SHADES : []}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ListRow({ product, index }: { product: Product; index: number }) {
  // Use ProductCard in a horizontal layout — for simplicity we render inline
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.2) }}
    >
      <ProductCard product={product} index={index} className="h-32" />
    </motion.div>
  );
}

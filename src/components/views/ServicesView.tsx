"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Clock,
  Sparkles,
  Calendar,
  ShieldCheck,
  Heart,
  Phone,
  ChevronLeft,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ServiceCard, { ServiceCardSkeleton } from "@/components/ServiceCard";
import type { Service, ServiceCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ServicesView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const activeCategory = searchParams.get("category") ?? "all";
  const searchTerm = searchParams.get("search") ?? "";
  const sort = searchParams.get("sort") ?? "newest";

  const [searchInput, setSearchInput] = useState(searchTerm);

  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== "all") params.set("category", activeCategory);
      if (searchTerm) params.set("search", searchTerm);
      if (sort) params.set("sort", sort);
      const [svcRes, catRes] = await Promise.all([
        fetch(`/api/services?${params.toString()}`, { cache: "no-store" }),
        fetch("/api/services/categories", { cache: "no-store" }),
      ]);
      const svcData = await svcRes.json();
      const catData = await catRes.json();
      setServices(Array.isArray(svcData) ? svcData : []);
      setCategories(catData.categories ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchTerm, sort]);

  useEffect(() => {
    load();
  }, [load]);

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === "" || v === "all") params.delete(k);
      else params.set(k, v);
    }
    params.set("view", "services");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const catName = useMemo(
    () => categories.find((c) => c.slug === activeCategory)?.name ?? "كل الخدمات",
    [categories, activeCategory]
  );

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-rose-gradient">
        <div className="absolute -left-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-16 -bottom-24 size-80 rounded-full bg-gold/20 blur-3xl" />
        <div className="container relative mx-auto max-w-7xl px-4 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs font-bold text-primary shadow-soft">
              <Sparkles className="size-4 text-gold" />
              مركز أريسا للتجميل
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
              خدماتنا التجميلية
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
              تجربة عناية فاخرة على أيدي خبيرات تجميل معتمدات — من تجهيز العرايس
              إلى العناية بالبشرة والشعر والأظافر في أجواء راقية ومريحة.
            </p>
            {/* Quick stats */}
            <div className="mx-auto mt-6 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: Sparkles, label: "خدمة احترافية", value: "+18" },
                { icon: Heart, label: "عميلة سعيدة", value: "+5k" },
                { icon: Clock, label: "خبرة", value: "+10 سنوات" },
                { icon: ShieldCheck, label: "بيئة معقّمة", value: "100%" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center gap-1 rounded-2xl bg-white/70 p-3 text-center shadow-soft"
                >
                  <s.icon className="size-5 text-primary" />
                  <span className="text-base font-extrabold text-foreground">{s.value}</span>
                  <span className="text-[11px] text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="container mx-auto max-w-7xl px-4 py-4">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link href="?view=home" className="hover:text-primary">الرئيسية</Link>
          <ChevronLeft className="size-3" />
          <span className="font-bold text-foreground">خدماتنا التجميلية</span>
          {activeCategory !== "all" && (
            <>
              <ChevronLeft className="size-3" />
              <span className="text-primary">{catName}</span>
            </>
          )}
        </nav>
      </div>

      {/* Filters */}
      <section className="sticky top-[6.25rem] z-30 bg-background/95 backdrop-blur border-b border-border/60">
        <div className="container mx-auto max-w-7xl px-4 py-3">
          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <CategoryChip
              active={activeCategory === "all"}
              label="الكل"
              count={categories.reduce((s, c) => s + (c.count ?? 0), 0)}
              onClick={() => updateParams({ category: null })}
            />
            {categories.map((c) => (
              <CategoryChip
                key={c.slug}
                active={activeCategory === c.slug}
                label={c.name}
                count={c.count ?? 0}
                onClick={() => updateParams({ category: c.slug })}
              />
            ))}
          </div>
          {/* Search + sort */}
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateParams({ search: searchInput.trim() || null });
                  }
                }}
                placeholder="ابحثي عن خدمة..."
                className="pr-9"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    updateParams({ search: null });
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="مسح"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <Select
              value={sort}
              onValueChange={(v) => updateParams({ sort: v })}
            >
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="ترتيب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">الأحدث</SelectItem>
                <SelectItem value="price-asc">السعر: من الأقل للأعلى</SelectItem>
                <SelectItem value="price-desc">السعر: من الأعلى للأقل</SelectItem>
                <SelectItem value="rating">الأعلى تقييماً</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {loading ? "جارٍ التحميل..." : `${services.length} خدمة متاحة`}
          </p>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <Sparkles className="size-12 text-muted-foreground/40" />
            <div>
              <p className="text-base font-bold text-foreground">لا توجد خدمات مطابقة</p>
              <p className="text-sm text-muted-foreground">جرّبي تغيير الفلاتر أو البحث بكلمات أخرى</p>
            </div>
            <Button
              onClick={() => {
                setSearchInput("");
                router.push("?view=services", { scroll: false });
              }}
              className="bg-primary-gradient text-white shadow-rose"
            >
              عرض كل الخدمات
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((svc, i) => {
              const cat = categories.find((c) => c.slug === svc.category);
              return (
                <ServiceCard
                  key={svc.id}
                  service={svc}
                  index={i}
                  categoryName={cat?.name}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* CTA banner */}
      <section className="container mx-auto max-w-7xl px-4 py-10">
        <div className="relative overflow-hidden rounded-3xl bg-primary-gradient p-8 text-white shadow-rose md:p-12">
          <div className="absolute -left-10 -top-10 size-44 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -right-10 -bottom-10 size-52 rounded-full bg-gold/30 blur-3xl" />
          <div className="relative grid items-center gap-6 md:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold backdrop-blur">
                <Calendar className="size-4 text-gold" /> احجزي موعدك الآن
              </span>
              <h3 className="mt-4 text-2xl font-extrabold leading-tight md:text-3xl">
                تجربة جمال استثنائية بانتظارك
              </h3>
              <p className="mt-3 max-w-md text-white/90">
                فريقنا من خبيرات التجميل جاهز للاهتمام بكِ من الرأس حتى القدمين.
                احجزي موعدك مسبقاً واحصلي على استشارة مجانية.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-6 rounded-md bg-cta-gold px-7 font-bold text-primary hover:brightness-105"
              >
                <Link href="?view=home" className="flex items-center gap-2">
                  <Phone className="size-4" />
                  تواصلي معنا
                </Link>
              </Button>
            </div>
            <div className="hidden items-center justify-center md:flex">
              <div className="relative size-44 rounded-full bg-white/15 backdrop-blur-xl">
                <div className="absolute inset-0 grid place-items-center">
                  <Sparkles className="size-16 text-gold" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CategoryChip({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all",
        active
          ? "border-primary bg-primary-gradient text-white shadow-rose"
          : "border-border bg-card text-foreground hover:border-primary/40 hover:text-primary"
      )}
    >
      {label}
      {typeof count === "number" && (
        <span
          className={cn(
            "rounded-full px-1.5 text-[10px] font-bold",
            active ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

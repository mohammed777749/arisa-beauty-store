"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoryWithCount } from "@/lib/types";

type Props = {
  categories: CategoryWithCount[];
  className?: string;
};

const SORTS = [
  { value: "newest", label: "الأحدث" },
  { value: "price-asc", label: "السعر: من الأقل للأعلى" },
  { value: "price-desc", label: "السعر: من الأعلى للأقل" },
  { value: "rating", label: "الأعلى تقييماً" },
];

export default function Filters({ categories, className }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value?: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      // ensure view stays shop
      params.set("view", "shop");
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const activeCat = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "newest";
  const search = searchParams.get("search") ?? "";

  return (
    <aside
      className={cn(
        "flex flex-col gap-5 rounded-2xl border border-border/60 bg-card p-5 shadow-soft",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="size-4 text-primary" />
        <h3 className="text-sm font-extrabold uppercase tracking-wide">
          تصفية النتائج
        </h3>
      </div>

      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const q = (fd.get("q") as string) ?? "";
          updateParam("search", q || null);
        }}
        className="relative"
      >
        <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="q"
          defaultValue={search}
          placeholder="ابحثي عن منتج..."
          className="h-10 rounded-full bg-muted/50 pr-9"
        />
      </form>

      {/* Categories */}
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          الفئات
        </p>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => updateParam("category", null)}
            className={cn(
              "flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition",
              !activeCat
                ? "bg-primary text-primary-foreground shadow-rose"
                : "hover:bg-muted"
            )}
          >
            كل الفئات
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => updateParam("category", c.slug)}
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition",
                activeCat === c.slug
                  ? "bg-primary text-primary-foreground shadow-rose"
                  : "hover:bg-muted"
              )}
            >
              <span>{c.name}</span>
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px]",
                  activeCat === c.slug
                    ? "bg-white/20 text-primary-foreground"
                    : ""
                )}
              >
                {c._count?.products ?? 0}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          ترتيب حسب
        </p>
        <Select value={sort} onValueChange={(v) => updateParam("sort", v)}>
          <SelectTrigger className="h-10 w-full rounded-xl bg-muted/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORTS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear */}
      {(activeCat || search) && (
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full border-primary/40 text-primary hover:bg-primary/5"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("category");
            params.delete("search");
            params.set("view", "shop");
            router.push(`?${params.toString()}`);
          }}
        >
          <X className="size-4" />
          مسح الفلاتر
        </Button>
      )}
    </aside>
  );
}

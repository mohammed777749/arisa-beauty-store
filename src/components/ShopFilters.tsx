"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  ChevronDown,
  ChevronLeft,
  Truck,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoryWithCount } from "@/lib/types";
import RatingFilter from "@/components/RatingFilter";

type Props = {
  categories: CategoryWithCount[];
  brands: string[];
  total: number;
  className?: string;
  view?: "shop" | "search";
  showShades?: boolean;
  shades?: string[];
};

const QUICK_RANGES = [
  { label: "تحت ٥٠ ر.س", min: 0, max: 50 },
  { label: "٥٠ - ١٠٠ ر.س", min: 50, max: 100 },
  { label: "١٠٠ - ٢٠٠ ر.س", min: 100, max: 200 },
  { label: "٢٠٠ ر.س فأكثر", min: 200, max: 10000 },
];

const COLLAPSE_LABEL_CLASS = "flex w-full items-center justify-between py-2 text-xs font-extrabold uppercase tracking-wide text-foreground";

export default function ShopFilters({
  categories,
  brands,
  className,
  view = "shop",
  showShades = false,
  shades = [],
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCat = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "relevance";
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const ratingParam = searchParams.get("rating");
  const brandParam = searchParams.get("brand") ?? "";
  const prime = searchParams.get("prime");
  const inStock = searchParams.get("inStock");
  const shadeParam = searchParams.get("shade") ?? "";

  const [priceMin, setPriceMin] = useState<number>(minPriceParam ? Number(minPriceParam) : 0);
  const [priceMax, setPriceMax] = useState<number>(maxPriceParam ? Number(maxPriceParam) : 500);
  const [openSection, setOpenSection] = useState<string | null>("department");

  const updateParam = useCallback(
    (key: string, value?: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.set("view", view);
      params.delete("page");
      router.push(`?${params.toString()}`);
    },
    [router, searchParams, view]
  );

  const toggleBrand = (b: string) => {
    const arr = brandParam ? brandParam.split(",").filter(Boolean) : [];
    const exists = arr.includes(b);
    const next = exists ? arr.filter((x) => x !== b) : [...arr, b];
    updateParam("brand", next.length ? next.join(",") : null);
  };

  const toggleShade = (s: string) => {
    if (shadeParam === s) {
      updateParam("shade", null);
    } else {
      updateParam("shade", s);
    }
  };

  const applyQuickRange = (min: number, max: number) => {
    setPriceMin(min);
    setPriceMax(max);
    updateParam("minPrice", String(min));
    updateParam("maxPrice", String(max));
  };

  const applyPriceInputs = () => {
    updateParam("minPrice", priceMin ? String(priceMin) : null);
    updateParam("maxPrice", priceMax ? String(priceMax) : null);
  };

  const selectedBrands = brandParam
    ? brandParam.split(",").filter(Boolean)
    : [];

  const toggleSection = (key: string) => {
    setOpenSection(openSection === key ? null : key);
  };

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("search");
    params.delete("q");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("rating");
    params.delete("brand");
    params.delete("prime");
    params.delete("inStock");
    params.delete("shade");
    params.delete("page");
    params.set("view", view);
    router.push(`?${params.toString()}`);
  };

  const hasActiveFilters =
    activeCat ||
    minPriceParam ||
    maxPriceParam ||
    ratingParam ||
    brandParam ||
    prime ||
    inStock ||
    shadeParam;

  return (
    <aside
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-sm shadow-amazon",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-sm font-extrabold">
          <SlidersHorizontal className="size-4 text-primary" />
          تصفية النتائج
        </h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] text-primary hover:underline"
          >
            مسح الكل
          </button>
        )}
      </div>
      <Separator />

      {/* Department */}
      <section>
        <button
          type="button"
          onClick={() => toggleSection("department")}
          className={COLLAPSE_LABEL_CLASS}
        >
          القسم
          <ChevronDown
            className={cn(
              "size-4 transition",
              openSection === "department" ? "rotate-180" : ""
            )}
          />
        </button>
        {openSection === "department" && (
          <div className="flex flex-col gap-1 pb-1">
            <button
              type="button"
              onClick={() => updateParam("category", null)}
              className={cn(
                "flex items-center justify-between rounded-md px-2 py-1.5 text-xs font-semibold transition",
                !activeCat
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted"
              )}
            >
              كل الأقسام
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => updateParam("category", c.slug)}
                className={cn(
                  "flex items-center justify-between rounded-md px-2 py-1.5 text-xs font-semibold transition",
                  activeCat === c.slug
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                )}
              >
                <span>{c.name}</span>
                <span className="text-[10px] text-muted-foreground">
                  {c._count?.products ?? 0}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      <Separator />

      {/* Customer Reviews */}
      <section>
        <button
          type="button"
          onClick={() => toggleSection("rating")}
          className={COLLAPSE_LABEL_CLASS}
        >
          آراء العملاء
          <ChevronDown
            className={cn(
              "size-4 transition",
              openSection === "rating" ? "rotate-180" : ""
            )}
          />
        </button>
        {openSection === "rating" && (
          <div className="pb-1">
            <RatingFilter
              value={ratingParam ? Number(ratingParam) : null}
              onChange={(v) => updateParam("rating", v ? String(v) : null)}
            />
          </div>
        )}
      </section>

      <Separator />

      {/* Price */}
      <section>
        <button
          type="button"
          onClick={() => toggleSection("price")}
          className={COLLAPSE_LABEL_CLASS}
        >
          السعر
          <ChevronDown
            className={cn(
              "size-4 transition",
              openSection === "price" ? "rotate-180" : ""
            )}
          />
        </button>
        {openSection === "price" && (
          <div className="flex flex-col gap-3 pb-1">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={priceMin}
                min={0}
                onChange={(e) => setPriceMin(Number(e.target.value))}
                placeholder="من"
                className="h-9 rounded-md text-xs"
              />
              <span className="text-muted-foreground">—</span>
              <Input
                type="number"
                value={priceMax}
                min={0}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                placeholder="إلى"
                className="h-9 rounded-md text-xs"
              />
              <Button
                type="button"
                size="sm"
                onClick={applyPriceInputs}
                className="h-9 shrink-0 rounded-md bg-cta-gold px-3 text-xs font-bold text-primary hover:brightness-105"
              >
                تطبيق
              </Button>
            </div>
            <Slider
              value={[priceMin, priceMax]}
              min={0}
              max={500}
              step={10}
              onValueChange={(v) => {
                setPriceMin(v[0]);
                setPriceMax(v[1]);
              }}
              onValueCommit={(v) => {
                updateParam("minPrice", v[0] ? String(v[0]) : null);
                updateParam("maxPrice", v[1] ? String(v[1]) : null);
              }}
              className="my-1"
            />
            <div className="flex flex-col gap-1">
              {QUICK_RANGES.map((q) => {
                const active =
                  minPriceParam === String(q.min) &&
                  (q.max >= 10000 ? !maxPriceParam : maxPriceParam === String(q.max));
                return (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => applyQuickRange(q.min, q.max)}
                    className={cn(
                      "rounded-md px-2 py-1.5 text-right text-xs transition",
                      active
                        ? "bg-primary/10 font-bold text-primary"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    {q.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <Separator />

      {/* Brand */}
      {brands.length > 0 && (
        <section>
          <button
            type="button"
            onClick={() => toggleSection("brand")}
            className={COLLAPSE_LABEL_CLASS}
          >
            العلامة التجارية
            <ChevronDown
              className={cn(
                "size-4 transition",
                openSection === "brand" ? "rotate-180" : ""
              )}
            />
          </button>
          {openSection === "brand" && (
            <div className="flex flex-col gap-1 pb-1">
              {brands.map((b) => (
                <label
                  key={b}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-muted"
                >
                  <Checkbox
                    checked={selectedBrands.includes(b)}
                    onCheckedChange={() => toggleBrand(b)}
                  />
                  <span className="font-medium">{b}</span>
                </label>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Shades (only for lips/nails) */}
      {showShades && shades.length > 0 && (
        <>
          <Separator />
          <section>
            <button
              type="button"
              onClick={() => toggleSection("shade")}
              className={COLLAPSE_LABEL_CLASS}
            >
              الظلال
              <ChevronDown
                className={cn(
                  "size-4 transition",
                  openSection === "shade" ? "rotate-180" : ""
                )}
              />
            </button>
            {openSection === "shade" && (
              <div className="flex flex-col gap-1 pb-1">
                {shades.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleShade(s)}
                    className={cn(
                      "flex items-center justify-between rounded-md px-2 py-1.5 text-xs transition",
                      shadeParam === s
                        ? "bg-primary/10 font-bold text-primary"
                        : "hover:bg-muted"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <Separator />

      {/* Availability */}
      <section>
        <button
          type="button"
          onClick={() => toggleSection("availability")}
          className={COLLAPSE_LABEL_CLASS}
        >
          التوفر
          <ChevronDown
            className={cn(
              "size-4 transition",
              openSection === "availability" ? "rotate-180" : ""
            )}
          />
        </button>
        {openSection === "availability" && (
          <div className="flex flex-col gap-1 pb-1">
            <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-muted">
              <Checkbox
                checked={inStock === "true"}
                onCheckedChange={(v) =>
                  updateParam("inStock", v === true ? "true" : null)
                }
              />
              <span className="font-medium">متوفر فقط</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-muted">
              <Checkbox
                checked={prime === "true"}
                onCheckedChange={(v) =>
                  updateParam("prime", v === true ? "true" : null)
                }
              />
              <span className="flex items-center gap-1 font-medium">
                <Truck className="size-3.5 text-emerald-600" />
                توصيل سريع
              </span>
            </label>
          </div>
        )}
      </section>

      {hasActiveFilters && (
        <>
          <Separator />
          <div className="flex flex-wrap gap-1">
            {activeCat && (
              <Badge variant="secondary" className="text-[10px]">
                {categories.find((c) => c.slug === activeCat)?.name}
                <button
                  type="button"
                  onClick={() => updateParam("category", null)}
                  className="ms-1"
                  aria-label="إزالة"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}
            {selectedBrands.map((b) => (
              <Badge key={b} variant="secondary" className="text-[10px]">
                {b}
                <button
                  type="button"
                  onClick={() => toggleBrand(b)}
                  className="ms-1"
                  aria-label="إزالة"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
            {ratingParam && (
              <Badge variant="secondary" className="text-[10px]">
                {ratingParam}+ نجوم
                <button
                  type="button"
                  onClick={() => updateParam("rating", null)}
                  className="ms-1"
                  aria-label="إزالة"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}
          </div>
        </>
      )}
    </aside>
  );
}

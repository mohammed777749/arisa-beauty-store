"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  total: number;
  page: number;
  limit: number;
  sort: string;
  view: "grid" | "list";
  onSortChange: (v: string) => void;
  onViewChange: (v: "grid" | "list") => void;
  className?: string;
};

const SORTS = [
  { value: "relevance", label: "الأكثر صلة" },
  { value: "price-asc", label: "السعر: من الأقل للأعلى" },
  { value: "price-desc", label: "السعر: من الأعلى للأقل" },
  { value: "rating", label: "الأعلى تقييماً" },
  { value: "newest", label: "الأحدث" },
  { value: "bestselling", label: "الأكثر مبيعاً" },
];

export default function ShopToolbar({
  total,
  page,
  limit,
  sort,
  view,
  onSortChange,
  onViewChange,
  className,
}: Props) {
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-sm",
        className
      )}
    >
      <p className="text-xs text-muted-foreground">
        <span className="font-bold text-foreground">
          {start}-{end}
        </span>{" "}
        من <span className="font-bold text-foreground">{total}</span> نتيجة
      </p>
      <div className="flex items-center gap-2">
        <span className="hidden text-xs text-muted-foreground sm:inline">ترتيب حسب:</span>
        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger className="h-9 w-48 rounded-md bg-muted/50 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORTS.map((s) => (
              <SelectItem key={s.value} value={s.value} className="text-xs">
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-0.5 rounded-md border border-border bg-background p-0.5">
          <button
            type="button"
            onClick={() => onViewChange("grid")}
            className={cn(
              "grid size-7 place-items-center rounded transition",
              view === "grid"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
            aria-label="شبكة"
          >
            <LayoutGrid className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onViewChange("list")}
            className={cn(
              "grid size-7 place-items-center rounded transition",
              view === "list"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
            aria-label="قائمة"
          >
            <List className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

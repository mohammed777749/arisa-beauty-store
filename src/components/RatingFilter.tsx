"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: number | null;
  onChange: (val: number | null) => void;
  className?: string;
};

const ROWS = [
  { rating: 4, label: "4 نجوم فأكثر" },
  { rating: 3, label: "3 نجوم فأكثر" },
  { rating: 2, label: "2 نجوم فأكثر" },
  { rating: 1, label: "نجمة فأكثر" },
];

export default function RatingFilter({ value, onChange, className }: Props) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {ROWS.map((row) => {
        const active = value === row.rating;
        return (
          <button
            key={row.rating}
            type="button"
            onClick={() => onChange(active ? null : row.rating)}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition",
              active
                ? "bg-primary/10 font-bold text-primary"
                : "text-foreground hover:bg-muted"
            )}
          >
            <span className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-3.5",
                    i < row.rating
                      ? "fill-gold text-gold"
                      : "text-muted-foreground/40"
                  )}
                />
              ))}
            </span>
            <span className="text-muted-foreground">{row.label}</span>
          </button>
        );
      })}
      {value !== null && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="mt-1 self-start text-[11px] text-primary hover:underline"
        >
          مسح الفلتر
        </button>
      )}
    </div>
  );
}

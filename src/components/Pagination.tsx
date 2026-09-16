"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  page: number;
  totalPages: number;
  className?: string;
};

function buildPageRange(page: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const result: (number | "ellipsis")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  if (start > 2) result.push("ellipsis");
  for (let i = start; i <= end; i++) result.push(i);
  if (end < totalPages - 1) result.push("ellipsis");
  result.push(totalPages);
  return result;
}

export default function Pagination({ page, totalPages, className }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const go = (p: number) => {
    if (p < 1 || p > totalPages || p === page) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`?${params.toString()}`);
    // Scroll to top
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const range = buildPageRange(page, totalPages);

  return (
    <nav
      className={cn("flex items-center justify-center gap-1 py-6", className)}
      aria-label="pagination"
    >
      <button
        type="button"
        onClick={() => go(page - 1)}
        disabled={page === 1}
        className="grid size-9 place-items-center rounded-md border border-border bg-background text-foreground transition hover:bg-muted disabled:opacity-40"
        aria-label="السابق"
      >
        <ChevronRight className="size-4" />
      </button>
      {range.map((r, i) =>
        r === "ellipsis" ? (
          <span
            key={`e${i}`}
            className="grid size-9 place-items-center text-muted-foreground"
          >
            …
          </span>
        ) : (
          <button
            key={r}
            type="button"
            onClick={() => go(r)}
            className={cn(
              "grid min-w-9 size-9 place-items-center rounded-md border text-sm font-bold transition",
              r === page
                ? "border-primary bg-primary text-primary-foreground shadow-rose"
                : "border-border bg-background text-foreground hover:bg-muted"
            )}
          >
            {r}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => go(page + 1)}
        disabled={page === totalPages}
        className="grid size-9 place-items-center rounded-md border border-border bg-background text-foreground transition hover:bg-muted disabled:opacity-40"
        aria-label="التالي"
      >
        <ChevronLeft className="size-4" />
      </button>
    </nav>
  );
}

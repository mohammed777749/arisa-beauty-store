"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  className?: string;
  size?: "sm" | "md";
};

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
  size = "md",
}: Props) {
  const btn = size === "sm" ? "size-8" : "size-10";
  const inputCls = size === "sm" ? "h-8 w-12 text-sm" : "h-10 w-14";

  const clamp = (v: number) => Math.max(min, Math.min(max, v));

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border bg-background p-1",
        className
      )}
      dir="ltr"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("rounded-full", btn)}
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label="إنقاص"
      >
        <Minus className="size-4" />
      </Button>
      <Input
        type="number"
        value={value}
        onChange={(e) => {
          const n = parseInt(e.target.value || "0", 10);
          onChange(clamp(isNaN(n) ? min : n));
        }}
        className={cn(
          "border-0 bg-transparent p-0 text-center font-bold shadow-none focus-visible:ring-0",
          inputCls
        )}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("rounded-full", btn)}
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label="زيادة"
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
}

"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = {
  label: string;
  description?: string;
};

type Props = {
  steps: Step[];
  current: number; // 1-based
  className?: string;
};

export default function Stepper({ steps, current, className }: Props) {
  return (
    <ol
      className={cn(
        "flex flex-wrap items-center gap-2 md:flex-nowrap md:gap-0",
        className
      )}
    >
      {steps.map((step, i) => {
        const num = i + 1;
        const done = num < current;
        const active = num === current;
        return (
          <li
            key={step.label}
            className="flex flex-1 items-center gap-2 md:flex-initial"
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold transition",
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                    ? "bg-primary text-primary-foreground shadow-rose"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {done ? <Check className="size-4" /> : num}
              </span>
              <div className="hidden flex-col leading-tight md:flex">
                <span
                  className={cn(
                    "text-xs font-bold",
                    active || done ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="text-[10px] text-muted-foreground">
                    {step.description}
                  </span>
                )}
              </div>
            </div>
            {num < steps.length && (
              <div
                className={cn(
                  "mx-1 hidden h-0.5 w-12 lg:block",
                  done ? "bg-emerald-500" : "bg-border"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

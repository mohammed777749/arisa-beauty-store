"use client";

import { Check, Package, Truck, MapPin, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderTimelineStep } from "@/lib/types";

type Props = {
  steps: OrderTimelineStep[];
  estimatedDelivery?: string | null;
  className?: string;
};

const ICONS: Record<string, typeof Check> = {
  ordered: Check,
  processing: Package,
  shipped: Truck,
  out_for_delivery: MapPin,
  delivered: Home,
};

export default function OrderTimeline({ steps, estimatedDelivery, className }: Props) {
  const allDone = steps.length > 0 && steps.every((s) => s.done);
  const activeIdx = steps.findIndex((s) => !s.done);

  return (
    <div className={cn("flex flex-col", className)}>
      {estimatedDelivery && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm font-bold text-emerald-700">
          <Truck className="size-5" />
          التوصيل المتوقع:{" "}
          {new Date(estimatedDelivery).toLocaleDateString("ar-SA", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      )}
      <ol className="relative flex flex-col gap-0 ps-6">
        <span
          className={cn(
            "absolute bottom-2 right-[11px] top-2 w-0.5 bg-border",
            allDone && "bg-emerald-500"
          )}
        />
        {steps.map((step, i) => {
          const Icon = ICONS[step.step] ?? Check;
          const done = step.done;
          const isActive = i === activeIdx;
          return (
            <li key={step.step} className="relative pb-6 last:pb-0">
              <span
                className={cn(
                  "absolute right-0 grid size-6 place-items-center rounded-full border-2 transition",
                  done
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground"
                )}
                style={{ transform: "translateX(50%)" }}
              >
                {done ? <Check className="size-3.5" /> : <Icon className="size-3" />}
              </span>
              <div className="flex flex-col pe-2">
                <span
                  className={cn(
                    "text-sm font-bold",
                    done
                      ? "text-emerald-700"
                      : isActive
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
                {step.at ? (
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(step.at).toLocaleDateString("ar-SA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                ) : (
                  <span className="text-[11px] text-muted-foreground">
                    {done ? "مكتمل" : "بانتظار التحديث"}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

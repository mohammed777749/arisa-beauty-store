"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Package,
  Truck,
  Home,
  ShoppingBag,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderSuccessView() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const [order, setOrder] = useState<any | null>(null);

  useEffect(() => {
    if (!orderId) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/orders", { cache: "no-store" });
        const data = await res.json();
        if (!active) return;
        const found = data.find((o: any) => o.id === orderId);
        if (found) setOrder(found);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      active = false;
    };
  }, [orderId]);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 md:py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft"
      >
        {/* Hero */}
        <div className="bg-primary-gradient px-6 py-10 text-center text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-4 grid size-20 place-items-center rounded-full bg-white/20 backdrop-blur"
          >
            <CheckCircle2 className="size-12 text-white" />
          </motion.div>
          <h1 className="text-2xl font-extrabold md:text-3xl">
            تم تأكيد طلبك بنجاح!
          </h1>
          <p className="mt-2 text-sm text-white/90">
            شكراً لثقتك بجلورية. سنبدأ بمعالجة طلبك فوراً.
          </p>
          {orderId && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm backdrop-blur">
              <span className="text-white/80">رقم الطلب:</span>
              <span className="font-bold tracking-wide" dir="ltr">
                #{orderId.slice(-8).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-6 md:p-8">
          {order ? (
            <div className="mb-6 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">الاسم</p>
                  <p className="font-bold">{order.customerName}</p>
                </div>
                <div className="rounded-xl bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">المدينة</p>
                  <p className="font-bold">{order.city}</p>
                </div>
                <div className="rounded-xl bg-muted/40 p-4">
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Phone className="size-3" /> الجوال
                  </p>
                  <p className="font-bold" dir="ltr">
                    {order.customerPhone}
                  </p>
                </div>
                <div className="rounded-xl bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">الإجمالي</p>
                  <p className="font-bold text-primary">
                    {order.total} ر.س
                  </p>
                </div>
              </div>
              {order.items && (
                <div>
                  <p className="mb-2 text-sm font-bold">المنتجات:</p>
                  <ul className="divide-y rounded-xl border border-border/60">
                    {order.items.map((it: any) => (
                      <li
                        key={it.id}
                        className="flex items-center justify-between p-3 text-sm"
                      >
                        <span className="line-clamp-1">
                          {it.name}
                          {it.shade ? ` — ${it.shade}` : ""}
                        </span>
                        <span className="font-bold">
                          ×{it.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="mb-6 text-center text-sm text-muted-foreground">
              ستصلك رسالة بتفاصيل الطلب على جوالك خلال دقائق.
            </p>
          )}

          {/* Timeline */}
          <div className="mb-8">
            <p className="mb-4 text-sm font-extrabold">ما الخطوة التالية؟</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  icon: CheckCircle2,
                  title: "تأكيد الطلب",
                  desc: "تم استلام طلبك بنجاح",
                  active: true,
                },
                {
                  icon: Package,
                  title: "تجهيز",
                  desc: "نقوم بتجهيز طلبك بعناية",
                  active: false,
                },
                {
                  icon: Truck,
                  title: "الشحن",
                  desc: "التوصيل خلال ٢-٤ أيام",
                  active: false,
                },
              ].map((s) => (
                <div
                  key={s.title}
                  className={`rounded-xl border p-4 text-center transition ${
                    s.active
                      ? "border-primary bg-primary/5"
                      : "border-border bg-muted/30"
                  }`}
                >
                  <s.icon
                    className={`mx-auto size-6 ${
                      s.active ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <p className="mt-2 text-sm font-bold">{s.title}</p>
                  <p className="text-[11px] text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="flex-1 rounded-full bg-primary-gradient font-bold shadow-rose"
            >
              <Link href="?view=shop" className="flex items-center gap-2">
                <ShoppingBag className="size-4" />
                متابعة التسوق
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="flex-1 rounded-full border-primary/40 font-bold text-primary hover:bg-primary/5"
            >
              <Link href="?view=home" className="flex items-center gap-2">
                <Home className="size-4" />
                الصفحة الرئيسية
              </Link>
            </Button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Mail className="size-3.5" />
            لأي استفسار تواصلي معنا: care@glamour.sa
          </div>
        </div>
      </motion.div>
    </div>
  );
}

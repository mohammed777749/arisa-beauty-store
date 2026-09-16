"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Package,
  Truck,
  Home,
  ShoppingBag,
  Phone,
  Mail,
  ChevronLeft,
  MapPin,
  CreditCard,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  formatPrice,
  CURRENCY,
  parseOrderTimeline,
  type Order,
} from "@/lib/types";
import { useSearchParams } from "next/navigation";

export default function OrderSuccessView() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/orders?id=${orderId}`, { cache: "no-store" });
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = (await res.json()) as Order;
        if (active) setOrder(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <Skeleton className="h-72 w-full rounded-3xl" />
      </div>
    );
  }

  const timeline = parseOrderTimeline(order?.timeline);
  const orderNumber = orderId
    ? `#${orderId.slice(-8).toUpperCase()}`
    : "";

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-3xl border border-border bg-card shadow-amazon"
      >
        {/* Hero */}
        <div className="bg-cta-gold px-6 py-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-4 grid size-20 place-items-center rounded-full bg-white/30 backdrop-blur"
          >
            <CheckCircle2 className="size-12 text-white" />
          </motion.div>
          <h1 className="text-2xl font-extrabold md:text-3xl">
            تم تأكيد طلبك بنجاح!
          </h1>
          <p className="mt-2 text-sm text-white/90">
            شكراً لثقتك بجلورية. سنبدأ بمعالجة طلبك فوراً.
          </p>
          {orderNumber && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm backdrop-blur">
              <span className="text-white/80">رقم الطلب:</span>
              <span className="font-bold tracking-wide" dir="ltr">
                {orderNumber}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-6 md:p-8">
          {order && (
            <div className="mb-6 space-y-4">
              {/* Tracking */}
              {order.estimatedDelivery && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">
                  <Truck className="size-5" />
                  التوصيل المتوقع:{" "}
                  {new Date(order.estimatedDelivery).toLocaleDateString("ar-SA", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-muted/40 p-4">
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Home className="size-3" /> العميل
                  </p>
                  <p className="font-bold">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">{order.city}</p>
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
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CreditCard className="size-3" /> الدفع
                  </p>
                  <p className="font-bold">
                    {order.paymentMethod === "cod"
                      ? "الدفع عند الاستلام"
                      : order.paymentMethod === "transfer"
                      ? "تحويل بنكي"
                      : "بطاقة ائتمانية"}
                  </p>
                </div>
                <div className="rounded-xl bg-muted/40 p-4">
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3" /> العنوان
                  </p>
                  <p className="text-xs">{order.address}</p>
                </div>
              </div>

              {order.items && (
                <div>
                  <p className="mb-2 text-sm font-bold">المنتجات:</p>
                  <ul className="divide-y rounded-xl border border-border">
                    {order.items.map((it) => (
                      <li
                        key={it.id}
                        className="flex items-center justify-between p-3 text-sm"
                      >
                        <span className="line-clamp-1">
                          {it.name}
                          {it.shade ? ` — ${it.shade}` : ""}
                        </span>
                        <span className="font-bold">×{it.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between rounded-xl bg-primary/5 p-3">
                <span className="font-extrabold">الإجمالي</span>
                <span className="text-xl font-extrabold text-primary">
                  {formatPrice(order.total)} {CURRENCY}
                </span>
              </div>
            </div>
          )}

          {/* Steps */}
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
              className="flex-1 rounded-md bg-cta-gold font-bold text-primary hover:brightness-105"
            >
              <Link href="?view=shop" className="flex items-center gap-2">
                <ShoppingBag className="size-4" />
                متابعة التسوق
              </Link>
            </Button>
            {order && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="flex-1 rounded-md border-primary/40 font-bold text-primary hover:bg-primary/5"
              >
                <Link
                  href={`?view=order-detail&id=${order.id}`}
                  className="flex items-center gap-2"
                >
                  <Package className="size-4" />
                  عرض تفاصيل الطلب
                </Link>
              </Button>
            )}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-md font-bold"
            >
              <Link href="?view=home" className="flex items-center gap-2">
                <Home className="size-4" />
                الرئيسية
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

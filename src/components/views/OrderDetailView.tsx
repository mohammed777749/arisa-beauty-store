"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Truck,
  MapPin,
  CreditCard,
  RotateCcw,
  Download,
  Package,
  Check,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import OrderTimeline from "@/components/OrderTimeline";
import { useCart } from "@/store/cart";
import {
  formatPrice,
  CURRENCY,
  ORDER_STATUS,
  parseOrderTimeline,
  type Order,
} from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function OrderDetailView() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/orders?id=${id}`, { cache: "no-store" });
        if (!res.ok) {
          if (active) setNotFound(true);
          return;
        }
        const data = (await res.json()) as Order;
        if (active) setOrder(data);
      } catch (e) {
        console.error(e);
        if (active) setNotFound(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <Skeleton className="mb-4 h-6 w-1/3" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-48 w-full rounded-xl md:col-span-2" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="container mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-20 text-center">
        <Package className="size-12 text-muted-foreground" />
        <p className="text-2xl font-bold">الطلب غير موجود</p>
        <Button
          asChild
          className="rounded-md bg-cta-gold font-bold text-primary hover:brightness-105"
        >
          <Link href="?view=orders">العودة لطلباتي</Link>
        </Button>
      </div>
    );
  }

  const orderNumber = `#${order.id.slice(-8).toUpperCase()}`;
  const orderDate = new Date(order.createdAt).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const timeline = parseOrderTimeline(order.timeline);
  const statusInfo = ORDER_STATUS[order.status] ?? ORDER_STATUS.pending;
  const subtotal = order.subtotal ?? order.total;
  const shipping = order.shipping ?? 0;
  const discount = order.discount ?? 0;
  const tax = order.tax ?? 0;

  const reorder = () => {
    if (!order.items || order.items.length === 0) return;
    order.items.forEach((it) => {
      addItem({
        productId: it.productId,
        name: it.name,
        price: it.price,
        image: it.image,
        quantity: it.quantity,
        shade: it.shade ?? null,
      });
    });
    toast.success(`تمت إضافة ${order.items.length} منتجات إلى السلة`);
    openCart();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
          <Link href="?view=home" className="hover:text-primary">
            الرئيسية
          </Link>
          <ChevronLeft className="size-3" />
          <Link href="?view=orders" className="hover:text-primary">
            طلباتي
          </Link>
          <ChevronLeft className="size-3" />
          <span className="font-bold text-foreground">{orderNumber}</span>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-5 flex flex-wrap items-end justify-between gap-3 rounded-xl border border-border bg-card p-5 shadow-amazon"
        >
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-foreground">
                الطلب {orderNumber}
              </h1>
              <Badge className="bg-primary/10 text-primary">
                {statusInfo.label}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              تم الطلب في {orderDate}
            </p>
            {order.trackingNumber && (
              <p className="mt-1 text-xs text-muted-foreground">
                رقم التتبع:{" "}
                <span className="font-bold" dir="ltr">
                  {order.trackingNumber}
                </span>
                {" — "}
                <Link
                  href={`?view=order-detail&id=${order.id}`}
                  className="text-primary hover:underline"
                >
                  تتبع الطرد
                </Link>
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="rounded-md text-xs font-bold"
            >
              <Printer className="size-3.5" />
              تنزيل الإيصال
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={reorder}
              className="rounded-md bg-cta-gold text-xs font-bold text-primary hover:brightness-105"
            >
              <RotateCcw className="size-3.5" />
              اشترِ مرة أخرى
            </Button>
          </div>
        </motion.div>

        {/* Tracking */}
        {timeline.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="mb-5 rounded-xl border border-border bg-card p-5 shadow-amazon"
          >
            <h2 className="mb-4 text-base font-extrabold">تتبع الطلب</h2>
            <OrderTimeline
              steps={timeline}
              estimatedDelivery={order.estimatedDelivery}
            />
          </motion.section>
        )}

        {/* Grid: address + payment + items */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Address */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="rounded-xl border border-border bg-card p-4 shadow-amazon"
          >
            <h3 className="mb-3 flex items-center gap-1.5 text-sm font-extrabold">
              <MapPin className="size-4 text-primary" />
              عنوان الشحن
            </h3>
            <div className="text-sm">
              <p className="font-bold">{order.customerName}</p>
              <p className="text-xs text-muted-foreground" dir="ltr">
                {order.customerPhone}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {order.city} — {order.address}
              </p>
              {order.notes && (
                <p className="mt-2 rounded-md bg-muted/40 p-2 text-[11px] text-muted-foreground">
                  ملاحظات: {order.notes}
                </p>
              )}
            </div>
          </motion.section>

          {/* Payment */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="rounded-xl border border-border bg-card p-4 shadow-amazon"
          >
            <h3 className="mb-3 flex items-center gap-1.5 text-sm font-extrabold">
              <CreditCard className="size-4 text-primary" />
              طريقة الدفع
            </h3>
            <div className="text-sm">
              <p className="font-bold">
                {order.paymentMethod === "cod"
                  ? "الدفع عند الاستلام"
                  : order.paymentMethod === "transfer"
                  ? "تحويل بنكي"
                  : "بطاقة ائتمانية"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                حالة الدفع:{" "}
                <span className={cn("font-bold",
                  order.paymentStatus === "paid" ? "text-emerald-700" : "text-amber-700"
                )}>
                  {order.paymentStatus === "paid" ? "مدفوع" : "غير مدفوع"}
                </span>
              </p>
            </div>
          </motion.section>

          {/* Summary */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="rounded-xl border border-border bg-card p-4 shadow-amazon"
          >
            <h3 className="mb-3 flex items-center gap-1.5 text-sm font-extrabold">
              <Package className="size-4 text-primary" />
              ملخص الطلب
            </h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">المجموع الفرعي</span>
                <span className="font-bold">
                  {formatPrice(subtotal)} {CURRENCY}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>الخصم {order.promoCode ? `(${order.promoCode})` : ""}</span>
                  <span className="font-bold">
                    - {formatPrice(discount)} {CURRENCY}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">الشحن</span>
                <span className="font-bold">
                  {shipping === 0 ? (
                    <span className="text-emerald-700">مجاني</span>
                  ) : (
                    `${formatPrice(shipping)} ${CURRENCY}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ضريبة (١٥٪)</span>
                <span className="font-bold">
                  {formatPrice(tax)} {CURRENCY}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-sm">
                <span className="font-extrabold">الإجمالي</span>
                <span className="font-extrabold text-primary">
                  {formatPrice(order.total)} {CURRENCY}
                </span>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Items */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="mt-5 rounded-xl border border-border bg-card p-5 shadow-amazon"
        >
          <h2 className="mb-3 text-base font-extrabold">المنتجات</h2>
          <ul className="divide-y">
            {order.items?.map((it) => (
              <li
                key={it.id}
                className="flex items-center gap-3 py-3"
              >
                <Link
                  href={`?view=product&id=${it.productId}`}
                  className="relative size-16 shrink-0 overflow-hidden rounded-lg border bg-muted"
                >
                  <Image
                    src={it.image}
                    alt={it.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </Link>
                <div className="flex-1">
                  <Link
                    href={`?view=product&id=${it.productId}`}
                    className="line-clamp-2 text-sm font-bold hover:text-primary"
                  >
                    {it.name}
                  </Link>
                  {it.shade && (
                    <p className="text-[11px] text-muted-foreground">
                      الظل: {it.shade}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    الكمية: {it.quantity} × {formatPrice(it.price)} {CURRENCY}
                  </p>
                </div>
                <p className="text-sm font-extrabold text-primary">
                  {formatPrice(it.price * it.quantity)} {CURRENCY}
                </p>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Bottom CTA */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 print:hidden">
          <Button
            asChild
            variant="outline"
            className="rounded-md font-bold"
          >
            <Link href="?view=orders">العودة لطلباتي</Link>
          </Button>
          <Button
            asChild
            className="rounded-md bg-cta-gold font-bold text-primary hover:brightness-105"
          >
            <Link href="?view=shop">متابعة التسوق</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

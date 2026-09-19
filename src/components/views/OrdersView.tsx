"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Package,
  Search,
  Truck,
  RotateCcw,
  Star,
  ChevronLeft,
  ShoppingBag,
  MapPin,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/store/cart";
import {
  formatPrice,
  CURRENCY,
  ORDER_STATUS,
  type Order,
} from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const FILTERS = [
  { value: "30", label: "آخر ٣٠ يوماً", days: 30 },
  { value: "180", label: "آخر ٦ أشهر", days: 180 },
  { value: "2024", label: "٢٠٢٤", days: 0, year: 2024 },
  { value: "2023", label: "٢٠٢٣", days: 0, year: 2023 },
];

function statusBadge(status: string) {
  const info = ORDER_STATUS[status] ?? ORDER_STATUS.pending;
  const colors: Record<string, string> = {
    amber: "bg-amber-100 text-amber-800 border-amber-200",
    teal: "bg-teal-100 text-teal-800 border-teal-200",
    green: "bg-emerald-100 text-emerald-800 border-emerald-200",
    rose: "bg-rose-100 text-rose-800 border-rose-200",
  };
  return (
    <Badge className={cn("border", colors[info.color] ?? colors.amber)}>
      {info.label}
    </Badge>
  );
}

export default function OrdersView() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("180");
  const [search, setSearch] = useState("");
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/orders", { cache: "no-store" });
        const data = await res.json();
        if (active) setOrders(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const filteredOrders = useMemo(() => {
    let result = orders;
    const f = FILTERS.find((x) => x.value === filter);
    if (f?.days && f.days > 0) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - f.days);
      result = result.filter((o) => new Date(o.createdAt) >= cutoff);
    } else if (f?.year) {
      result = result.filter(
        (o) => new Date(o.createdAt).getFullYear() === f.year
      );
    }
    if (search.trim()) {
      const q = search.trim();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q.toLowerCase()) ||
          o.customerName.includes(q) ||
          o.items?.some((it) => it.name.includes(q))
      );
    }
    return result;
  }, [orders, filter, search]);

  const reorder = (order: Order) => {
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

  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
          <Link href="?view=home" className="hover:text-primary">
            الرئيسية
          </Link>
          <ChevronLeft className="size-3" />
          <span className="font-bold text-foreground">طلباتي</span>
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground md:text-3xl">
              طلباتي
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {orders.length} طلب إجمالي
            </p>
          </div>
        </div>

        {/* Filters + search */}
        <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3 shadow-amazon">
          <div className="flex flex-wrap items-center gap-1">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-bold transition",
                  filter === f.value
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative ms-auto w-full max-w-xs">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحثي في جميع الطلبات"
              className="h-9 rounded-md bg-muted/50 pr-9 text-sm"
            />
          </div>
        </div>

        {/* Orders */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
            <Package className="mb-3 size-12 text-muted-foreground" />
            <p className="text-lg font-bold text-foreground">
              {orders.length === 0
                ? "لم تقومي بأي طلبات بعد"
                : "لا توجد طلبات مطابقة"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              ابدئي التسوق واكتشفي منتجاتنا الفاخرة
            </p>
            <Button
              asChild
              className="mt-5 rounded-md bg-cta-gold font-bold text-primary hover:brightness-105"
            >
              <Link href="?view=shop">ابدئي التسوق</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, idx) => {
              const orderNumber = `#${order.id.slice(-8).toUpperCase()}`;
              const orderDate = new Date(order.createdAt).toLocaleDateString(
                "ar-SA",
                { year: "numeric", month: "long", day: "numeric" }
              );
              const itemCount = order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
              return (
                <motion.article
                  key={order.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
                  className="overflow-hidden rounded-xl border border-border bg-card shadow-amazon"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-4 py-3">
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <div>
                        <p className="text-muted-foreground">تم الطلب بتاريخ</p>
                        <p className="font-bold text-foreground">{orderDate}</p>
                      </div>
                      <div className="hidden h-8 w-px bg-border sm:block" />
                      <div>
                        <p className="text-muted-foreground">الإجمالي</p>
                        <p className="font-bold text-foreground">
                          {formatPrice(order.total)} {CURRENCY}
                        </p>
                      </div>
                      <div className="hidden h-8 w-px bg-border sm:block" />
                      <div>
                        <p className="text-muted-foreground">رقم الطلب</p>
                        <p className="font-bold text-foreground" dir="ltr">
                          {orderNumber}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {statusBadge(order.status)}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                    {/* Thumbnails */}
                    <div className="flex flex-1 items-center gap-3">
                      <div className="flex -space-x-3 space-x-reverse">
                        {(order.items ?? []).slice(0, 4).map((it) => (
                          <div
                            key={it.id}
                            className="relative size-16 overflow-hidden rounded-lg border-2 border-background bg-muted"
                          >
                            <Image
                              src={it.image}
                              alt={it.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                        ))}
                        {(order.items?.length ?? 0) > 4 && (
                          <div className="grid size-16 place-items-center rounded-lg border-2 border-background bg-muted text-xs font-bold text-muted-foreground">
                            +{(order.items?.length ?? 0) - 4}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-bold">
                          {itemCount} منتج
                        </p>
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {(order.items ?? [])
                            .slice(0, 2)
                            .map((it) => it.name)
                            .join("، ")}
                          {(order.items?.length ?? 0) > 2 ? "..." : ""}
                        </p>
                        {order.trackingNumber && (
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            رقم التتبع:{" "}
                            <span className="font-bold" dir="ltr">
                              {order.trackingNumber}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        asChild
                        size="sm"
                        className="rounded-md bg-cta-gold text-xs font-bold text-primary hover:brightness-105"
                      >
                        <Link
                          href={`?view=order-detail&id=${order.id}`}
                          className="flex items-center gap-1.5"
                        >
                          <Package className="size-3.5" />
                          عرض تفاصيل الطلب
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="rounded-md text-xs font-bold"
                      >
                        <Link
                          href={`?view=order-detail&id=${order.id}`}
                          className="flex items-center gap-1.5"
                        >
                          <Truck className="size-3.5" />
                          تتبع الطرد
                        </Link>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => reorder(order)}
                        className="rounded-md text-xs font-bold"
                      >
                        <RotateCcw className="size-3.5" />
                        اشترِ مرة أخرى
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          router.push(`?view=order-detail&id=${order.id}`);
                        }}
                        className="rounded-md text-xs font-bold text-primary hover:bg-primary/5"
                      >
                        <Star className="size-3.5" />
                        اكتبي تقييماً
                      </Button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && orders.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button
              asChild
              variant="outline"
              className="rounded-md border-primary/40 font-bold text-primary hover:bg-primary/5"
            >
              <Link href="?view=shop" className="flex items-center gap-2">
                <ShoppingBag className="size-4" />
                متابعة التسوق
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

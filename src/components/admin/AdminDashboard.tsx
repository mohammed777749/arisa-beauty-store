"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Star,
  AlertTriangle,
  ArrowLeft,
  PackageOpen,
  Crown,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, CURRENCY, ORDER_STATUS } from "@/lib/types";
import { cn } from "@/lib/utils";

type Stats = {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  totalReviews: number;
  avgRating: number;
  ordersByStatus: Record<string, number>;
  revenueByDay: { date: string; label: string; revenue: number }[];
  recentOrders: Array<{
    id: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
    items: Array<{ name: string; quantity: number }>;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    rating: number;
    reviewCount: number;
    image: string;
    category?: { name: string } | null;
  }>;
  lowStockList: Array<{
    id: string;
    name: string;
    stock: number;
    image: string;
    category?: { name: string } | null;
  }>;
};

const STATUS_DOT: Record<string, string> = {
  pending: "bg-amber-500",
  processing: "bg-amber-500",
  shipped: "bg-teal-500",
  out_for_delivery: "bg-cyan-500",
  delivered: "bg-emerald-500",
  cancelled: "bg-rose-500",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/stats", { cache: "no-store" });
        if (!res.ok) throw new Error("failed");
        const data = (await res.json()) as Stats;
        if (!cancelled) setStats(data);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-72 rounded-xl lg:col-span-2" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </div>
    );
  }

  const kpis = [
    {
      label: "إجمالي المنتجات",
      value: stats.totalProducts.toString(),
      icon: Package,
      color: "bg-rose-100 text-rose-700",
      trend: `${stats.totalCategories} فئات`,
      trendColor: "text-slate-500",
    },
    {
      label: "إجمالي الطلبات",
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      color: "bg-amber-100 text-amber-700",
      trend: `${stats.pendingOrders} قيد المعالجة`,
      trendColor: "text-amber-600",
    },
    {
      label: "إجمالي الإيرادات",
      value: `${formatPrice(stats.totalRevenue)} ${CURRENCY}`,
      icon: TrendingUp,
      color: "bg-emerald-100 text-emerald-700",
      trend: "آخر 7 أيام",
      trendColor: "text-emerald-600",
    },
    {
      label: "متوسط التقييم",
      value: stats.avgRating.toFixed(1),
      icon: Star,
      color: "bg-yellow-100 text-yellow-700",
      trend: `${stats.totalReviews} مراجعة`,
      trendColor: "text-slate-500",
    },
  ];

  const statusEntries = Object.entries(stats.ordersByStatus).filter(
    ([k]) => k !== "pending" || true
  );

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="overflow-hidden border-slate-200 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="text-sm text-slate-500">{kpi.label}</div>
                    <div className="text-2xl font-bold text-slate-900">{kpi.value}</div>
                    <div className={cn("text-xs font-medium", kpi.trendColor)}>{kpi.trend}</div>
                  </div>
                  <div className={cn("flex size-12 items-center justify-center rounded-xl", kpi.color)}>
                    <Icon className="size-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue chart + Orders by status */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-slate-200 shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-bold text-slate-900">
              الإيرادات خلال آخر 7 أيام
            </CardTitle>
            <Badge variant="secondary" className="bg-rose-100 text-rose-700">
              {CURRENCY}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.revenueByDay} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: "#64748b", fontFamily: "Tajawal, sans-serif" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#fff1f2" }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #fce7f3",
                      fontFamily: "Tajawal, sans-serif",
                      fontSize: 13,
                    }}
                    formatter={(v: number) => [`${formatPrice(v)} ${CURRENCY}`, "الإيرادات"]}
                    labelFormatter={(l) => `يوم ${l}`}
                  />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {stats.revenueByDay.map((entry, idx) => (
                      <Cell
                        key={idx}
                        fill={entry.revenue > 0 ? "#e11d48" : "#fecdd3"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Orders by status */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-slate-900">
              الطلبات حسب الحالة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {statusEntries.map(([status, count]) => {
              const meta = ORDER_STATUS[status] ?? {
                label: status,
                color: "slate",
              };
              return (
                <div
                  key={status}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={cn("size-2.5 rounded-full", STATUS_DOT[status] ?? "bg-slate-400")} />
                    <span className="text-sm font-medium text-slate-700">{meta.label}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{count}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Recent orders + Top products */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-slate-200 shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-bold text-slate-900">أحدث الطلبات</CardTitle>
            <Link href="?view=admin&tab=orders">
              <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700">
                عرض الكل
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="px-0">
            {stats.recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                <PackageOpen className="size-10 text-slate-300" />
                <p className="text-sm text-slate-500">لا توجد طلبات بعد</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="border-y border-slate-100 bg-slate-50/50 text-xs text-slate-500">
                    <tr>
                      <th className="px-4 py-2.5 font-medium">رقم الطلب</th>
                      <th className="px-4 py-2.5 font-medium">العميل</th>
                      <th className="px-4 py-2.5 font-medium">المبلغ</th>
                      <th className="px-4 py-2.5 font-medium">الحالة</th>
                      <th className="px-4 py-2.5 font-medium">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((o) => {
                      const meta = ORDER_STATUS[o.status] ?? { label: o.status, color: "slate" };
                      return (
                        <tr key={o.id} className="border-b border-slate-50 last:border-0 hover:bg-rose-50/30">
                          <td className="px-4 py-3 font-mono text-xs text-slate-700">
                            #{o.id.slice(-8).toUpperCase()}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-900">{o.customerName}</td>
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            {formatPrice(o.total)} {CURRENCY}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={o.status} />
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">
                            {new Date(o.createdAt).toLocaleDateString("ar-SA", {
                              day: "numeric",
                              month: "short",
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top products */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-bold text-slate-900">الأكثر تقييماً</CardTitle>
            <Crown className="size-5 text-amber-500" />
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.topProducts.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">لا توجد منتجات</p>
            ) : (
              stats.topProducts.map((p, idx) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="relative">
                    { }
                    <img
                      src={p.image}
                      alt={p.name}
                      className="size-11 rounded-lg object-cover"
                    />
                    <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">
                      {idx + 1}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-slate-900">{p.name}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-0.5 text-amber-500">
                        <Star className="size-3 fill-current" />
                        {p.rating.toFixed(1)}
                      </span>
                      <span>·</span>
                      <span>{p.reviewCount} مراجعة</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Low stock alert */}
      <Card className="border-amber-200 bg-amber-50/40 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-amber-600" />
            <CardTitle className="text-base font-bold text-slate-900">
              تنبيه المخزون المنخفض
            </CardTitle>
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
              {stats.lowStockProducts}
            </Badge>
          </div>
          <Link href="?view=admin&tab=products">
            <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700">
              إدارة المنتجات
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {stats.lowStockList.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
              <Package className="size-10 text-emerald-300" />
              <p className="text-sm text-slate-600">المخزون بحالة جيدة، لا توجد منتجات منخفضة</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {stats.lowStockList.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-lg border border-amber-200 bg-white p-3"
                >
                  { }
                  <img src={p.image} alt={p.name} className="size-10 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-slate-900">{p.name}</div>
                    <div className="text-xs text-slate-500">{p.category?.name ?? "—"}</div>
                  </div>
                  <Badge
                    className={cn(
                      "shrink-0",
                      p.stock === 0
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-700"
                    )}
                  >
                    {p.stock === 0 ? "نفد المخزون" : `متبقي ${p.stock}`}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-center gap-2 py-2 text-xs text-slate-400">
        <Loader2 className="size-3" />
        <span>تُحدّث البيانات تلقائياً عند فتح لوحة التحكم</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const meta = ORDER_STATUS[status] ?? { label: status, color: "slate" };
  const colorMap: Record<string, string> = {
    amber: "bg-amber-100 text-amber-700 border-amber-200",
    teal: "bg-teal-100 text-teal-700 border-teal-200",
    green: "bg-emerald-100 text-emerald-700 border-emerald-200",
    rose: "bg-rose-100 text-rose-700 border-rose-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return (
    <Badge variant="outline" className={cn("border", colorMap[meta.color] ?? colorMap.slate)}>
      {meta.label}
    </Badge>
  );
}

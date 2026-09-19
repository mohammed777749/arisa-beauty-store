"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Search,
  Eye,
  ShoppingBag,
  Truck,
  MapPin,
  CreditCard,
  CheckCircle2,
  Circle,
  Loader2,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { Order, OrderItem, OrderTimelineStep } from "@/lib/types";
import {
  formatPrice,
  CURRENCY,
  ORDER_STATUS,
  parseOrderTimeline,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "all", label: "كل الحالات" },
  { value: "pending", label: "قيد المعالجة" },
  { value: "processing", label: "قيد التجهيز" },
  { value: "shipped", label: "تم الشحن" },
  { value: "out_for_delivery", label: "خرج للتوصيل" },
  { value: "delivered", label: "تم التوصيل" },
  { value: "cancelled", label: "ملغي" },
];

const PAYMENT_LABELS: Record<string, string> = {
  cod: "الدفع عند الاستلام",
  bank_transfer: "تحويل بنكي",
  card: "بطاقة ائتمانية",
};

const PAGE_SIZE = 10;

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Order | null>(null);
  const [advancing, setAdvancing] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      const data = await res.json();
      setOrders(data);
    } catch {
      toast.error("فشل تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    let list = orders;
    if (statusFilter !== "all") {
      list = list.filter((o) => o.status === statusFilter);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.toLowerCase().includes(q) ||
          (o.trackingNumber ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const refreshSelected = useCallback(async () => {
    if (!selected) return;
    try {
      const res = await fetch(`/api/orders?id=${selected.id}`, { cache: "no-store" });
      if (res.ok) {
        const updated = await res.json();
        setSelected(updated);
      }
    } catch {
      // ignore
    }
  }, [selected]);

  const advanceTimeline = async () => {
    if (!selected) return;
    setAdvancing(true);
    try {
      const res = await fetch(`/api/orders?id=${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ advanceTimeline: true }),
      });
      if (!res.ok) throw new Error("فشل التحديث");
      const data = await res.json();
      setSelected((prev) => (prev ? { ...prev, ...data } : prev));
      toast.success("تم تقديم الخطوة بنجاح");
      // refresh list too
      load();
    } catch {
      toast.error("تعذّر تقديم الخطوة");
    } finally {
      setAdvancing(false);
    }
  };

  const updateStatus = async (status: string) => {
    if (!selected) return;
    setStatusUpdating(true);
    try {
      const res = await fetch(`/api/orders?id=${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("فشل التحديث");
      const data = await res.json();
      setSelected((prev) => (prev ? { ...prev, ...data } : prev));
      toast.success("تم تحديث حالة الطلب");
      load();
    } catch {
      toast.error("تعذّر تحديث الحالة");
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="بحث برقم الطلب، الاسم، الجوال..."
                className="pr-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="كل الحالات" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <span className="text-sm text-slate-500">{filtered.length} طلب</span>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : paged.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <ShoppingBag className="size-12 text-slate-300" />
              <div>
                <p className="font-semibold text-slate-700">لا توجد طلبات</p>
                <p className="text-sm text-slate-500">ستظهر الطلبات هنا عند إنشائها</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                    <TableHead className="text-right">رقم الطلب</TableHead>
                    <TableHead className="text-right">العميل</TableHead>
                    <TableHead className="text-right">العناصر</TableHead>
                    <TableHead className="text-right">المبلغ</TableHead>
                    <TableHead className="text-right">الدفع</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-center">إجراء</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((o) => {
                    const meta = ORDER_STATUS[o.status] ?? { label: o.status, color: "slate" };
                    const itemCount = o.items?.length ?? 0;
                    return (
                      <TableRow
                        key={o.id}
                        className="cursor-pointer hover:bg-rose-50/30"
                        onClick={() => setSelected(o)}
                      >
                        <TableCell className="font-mono text-xs text-slate-700">
                          #{o.id.slice(-8).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-slate-900">{o.customerName}</div>
                          <div className="text-xs text-slate-500">{o.customerPhone}</div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {itemCount} {itemCount === 1 ? "منتج" : "منتجات"}
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900">
                          {formatPrice(o.total)} {CURRENCY}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {PAYMENT_LABELS[o.paymentMethod ?? "cod"] ?? o.paymentMethod}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={o.status} />
                        </TableCell>
                        <TableCell className="text-xs text-slate-500">
                          {new Date(o.createdAt).toLocaleDateString("ar-SA", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelected(o);
                              }}
                              className="text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            >
                              <Eye className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            عرض {(currentPage - 1) * PAGE_SIZE + 1} -{" "}
            {Math.min(currentPage * PAGE_SIZE, filtered.length)} من {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronRight className="size-4" />
              السابق
            </Button>
            <span className="px-3 text-sm text-slate-600">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              التالي
              <ChevronLeft className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Order detail sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="left" className="w-full gap-0 p-0 sm:max-w-xl">
          <SheetHeader className="border-b border-slate-100 px-6 py-4 text-right">
            <SheetTitle className="text-right text-lg font-bold text-slate-900">
              تفاصيل الطلب #{selected?.id.slice(-8).toUpperCase()}
            </SheetTitle>
            <SheetDescription className="text-right">
              إدارة وتتبع حالة الطلب
            </SheetDescription>
          </SheetHeader>

          {selected && (
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
              {/* Status management */}
              <Card className="border-rose-200 bg-rose-50/40">
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-rose-800">
                      <Truck className="size-4" />
                      إدارة حالة الطلب
                    </h3>
                    <StatusBadge status={selected.status} />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-600">تغيير الحالة</label>
                      <Select
                        value={selected.status}
                        onValueChange={updateStatus}
                        disabled={statusUpdating}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.filter((s) => s.value !== "all").map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={advanceTimeline}
                        disabled={advancing || selected.status === "delivered" || selected.status === "cancelled"}
                        className="w-full bg-rose-600 text-white hover:bg-rose-700"
                      >
                        {advancing ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            جاري التقديم
                          </>
                        ) : (
                          <>
                            <RotateCcw className="size-4" />
                            تقديم الخطوة التالية
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Timeline order={selected} />

              {/* Customer info */}
              <section className="space-y-2">
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <MapPin className="size-4 text-rose-600" />
                  معلومات العميل والتوصيل
                </h3>
                <div className="grid gap-2 rounded-lg border border-slate-100 bg-white p-4 text-sm sm:grid-cols-2">
                  <InfoRow label="الاسم" value={selected.customerName} />
                  <InfoRow label="الجوال" value={selected.customerPhone} />
                  <InfoRow label="البريد الإلكتروني" value={selected.customerEmail || "—"} />
                  <InfoRow label="المدينة" value={selected.city} />
                  <div className="sm:col-span-2">
                    <InfoRow label="العنوان" value={selected.address} />
                  </div>
                  {selected.notes && (
                    <div className="sm:col-span-2">
                      <InfoRow label="ملاحظات" value={selected.notes} />
                    </div>
                  )}
                </div>
              </section>

              {/* Payment */}
              <section className="space-y-2">
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <CreditCard className="size-4 text-rose-600" />
                  الدفع
                </h3>
                <div className="grid gap-2 rounded-lg border border-slate-100 bg-white p-4 text-sm sm:grid-cols-2">
                  <InfoRow label="طريقة الدفع" value={PAYMENT_LABELS[selected.paymentMethod ?? "cod"] ?? selected.paymentMethod} />
                  <InfoRow label="حالة الدفع" value={selected.paymentStatus === "paid" ? "مدفوع" : "غير مدفوع"} />
                  <InfoRow label="رقم التتبع" value={selected.trackingNumber ?? "—"} />
                  <InfoRow
                    label="التوصيل المتوقع"
                    value={
                      selected.estimatedDelivery
                        ? new Date(selected.estimatedDelivery).toLocaleDateString("ar-SA")
                        : "—"
                    }
                  />
                </div>
              </section>

              {/* Items */}
              <section className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900">عناصر الطلب</h3>
                <div className="divide-y divide-slate-100 rounded-lg border border-slate-100 bg-white">
                  {(selected.items ?? []).map((it: OrderItem) => (
                    <div key={it.id} className="flex items-center gap-3 p-3">
                      { }
                      <img
                        src={it.image}
                        alt={it.name}
                        className="size-12 rounded-md border border-slate-200 object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-slate-900">{it.name}</div>
                        <div className="text-xs text-slate-500">
                          {it.quantity} × {formatPrice(it.price)} {CURRENCY}
                          {it.shade ? ` · ${it.shade}` : ""}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-slate-900">
                        {formatPrice(it.price * it.quantity)} {CURRENCY}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Totals */}
              <section className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900">ملخص الفاتورة</h3>
                <div className="space-y-1.5 rounded-lg border border-slate-100 bg-white p-4 text-sm">
                  <TotalRow label="المجموع الفرعي" value={selected.subtotal ?? 0} />
                  <TotalRow label="الشحن" value={selected.shipping ?? 0} />
                  {(selected.discount ?? 0) > 0 && (
                    <TotalRow
                      label={`الخصم${selected.promoCode ? ` (${selected.promoCode})` : ""}`}
                      value={-(selected.discount ?? 0)}
                      isDiscount
                    />
                  )}
                  {(selected.tax ?? 0) > 0 && <TotalRow label="الضريبة" value={selected.tax ?? 0} />}
                  <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
                    <span>الإجمالي</span>
                    <span>
                      {formatPrice(selected.total)} {CURRENCY}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          )}

          <div className="border-t border-slate-100 bg-slate-50 px-6 py-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                refreshSelected();
              }}
            >
              تحديث البيانات
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Timeline({ order }: { order: Order }) {
  const steps: OrderTimelineStep[] = parseOrderTimeline(order.timeline);
  if (steps.length === 0) return null;
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-bold text-slate-900">مراحل التتبع</h3>
      <div className="rounded-lg border border-slate-100 bg-white p-4">
        <ol className="relative space-y-3">
          {steps.map((s, idx) => (
            <li key={s.step} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                {s.done ? (
                  <CheckCircle2 className="size-5 text-emerald-500" />
                ) : (
                  <Circle className="size-5 text-slate-300" />
                )}
                {idx < steps.length - 1 && (
                  <span
                    className={cn(
                      "mt-1 h-6 w-0.5",
                      s.done ? "bg-emerald-300" : "bg-slate-200"
                    )}
                  />
                )}
              </div>
              <div className="flex-1 pb-1">
                <div
                  className={cn(
                    "text-sm font-medium",
                    s.done ? "text-slate-900" : "text-slate-500"
                  )}
                >
                  {s.label}
                </div>
                {s.at && (
                  <div className="text-xs text-slate-400">
                    {new Date(s.at).toLocaleString("ar-SA", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}

function TotalRow({
  label,
  value,
  isDiscount,
}: {
  label: string;
  value: number;
  isDiscount?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-slate-600">
      <span>{label}</span>
      <span className={isDiscount ? "text-emerald-600" : "text-slate-900"}>
        {isDiscount ? "-" : ""}
        {formatPrice(Math.abs(value))} {CURRENCY}
      </span>
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

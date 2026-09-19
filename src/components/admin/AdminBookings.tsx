"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Search,
  Eye,
  CalendarCheck,
  Phone,
  Mail,
  User,
  Clock,
  Calendar,
  Loader2,
  ChevronRight,
  ChevronLeft,
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
import {
  formatPrice,
  CURRENCY,
  parseService,
  formatDurationAr,
  BOOKING_STATUS,
  type ServiceBooking,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "all", label: "كل الحالات" },
  { value: "pending", label: "قيد الانتظار" },
  { value: "confirmed", label: "مؤكد" },
  { value: "completed", label: "مكتمل" },
  { value: "cancelled", label: "ملغي" },
];

const STATUS_DOT: Record<string, string> = {
  pending: "bg-amber-500",
  confirmed: "bg-teal-500",
  completed: "bg-emerald-500",
  cancelled: "bg-rose-500",
};

const PAGE_SIZE = 10;

function formatDateAr(iso: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("ar-SA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ServiceBooking | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", { cache: "no-store" });
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      toast.error("فشل تحميل الحجوزات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    let list = bookings;
    if (statusFilter !== "all") {
      list = list.filter((b) => b.status === statusFilter);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          b.customerName.toLowerCase().includes(q) ||
          b.customerPhone.toLowerCase().includes(q) ||
          (b.customerEmail ?? "").toLowerCase().includes(q) ||
          (b.service?.name ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [bookings, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const refreshSelected = useCallback(async () => {
    if (!selected) return;
    try {
      const res = await fetch(`/api/bookings?id=${selected.id}`, { cache: "no-store" });
      if (res.ok) {
        const updated = await res.json();
        setSelected(updated);
      }
    } catch {
      // ignore
    }
  }, [selected]);

  const updateStatus = async (status: string) => {
    if (!selected) return;
    setStatusUpdating(true);
    try {
      const res = await fetch(`/api/bookings?id=${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("فشل التحديث");
      const data = await res.json();
      setSelected((prev) => (prev ? { ...prev, ...data } : prev));
      toast.success("تم تحديث حالة الحجز");
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
                placeholder="بحث برقم الحجز، الاسم، الجوال..."
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
          <span className="text-sm text-slate-500">{filtered.length} حجز</span>
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
              <CalendarCheck className="size-12 text-slate-300" />
              <div>
                <p className="font-semibold text-slate-700">لا توجد حجوزات</p>
                <p className="text-sm text-slate-500">ستظهر الحجوزات هنا عند إنشائها</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                    <TableHead className="text-right">رقم الحجز</TableHead>
                    <TableHead className="text-right">الخدمة</TableHead>
                    <TableHead className="text-right">العميلة</TableHead>
                    <TableHead className="text-right">الموعد</TableHead>
                    <TableHead className="text-right">المبلغ</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-center">إجراء</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((b) => {
                    const meta = BOOKING_STATUS[b.status] ?? { label: b.status, color: "slate" };
                    return (
                      <TableRow
                        key={b.id}
                        className="cursor-pointer hover:bg-rose-50/30"
                        onClick={() => setSelected(b)}
                      >
                        <TableCell className="font-mono text-xs text-slate-700">
                          #{b.id.slice(-8).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {b.service && (
                              <img
                                src={b.service.image}
                                alt={b.service.name}
                                className="size-9 rounded-md border border-slate-200 object-cover"
                              />
                            )}
                            <div className="min-w-0">
                              <div className="truncate text-sm font-medium text-slate-900">
                                {b.service?.name ?? "—"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium text-slate-900">{b.customerName}</div>
                          <div className="text-xs text-slate-500" dir="ltr">{b.customerPhone}</div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          <div>{formatDateAr(b.preferredDate)}</div>
                          <div className="text-xs text-slate-400">الساعة {b.preferredTime}</div>
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900">
                          {formatPrice(b.totalPrice)} {CURRENCY}
                        </TableCell>
                        <TableCell>
                          <BookingStatusBadge status={b.status} />
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelected(b);
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

      {/* Booking detail sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="left" className="w-full gap-0 p-0 sm:max-w-xl">
          <SheetHeader className="border-b border-slate-100 px-6 py-4 text-right">
            <SheetTitle className="text-right text-lg font-bold text-slate-900">
              تفاصيل الحجز #{selected?.id.slice(-8).toUpperCase()}
            </SheetTitle>
            <SheetDescription className="text-right">
              إدارة وتتبع حالة الحجز
            </SheetDescription>
          </SheetHeader>

          {selected && (
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
              {/* Status management */}
              <Card className="border-rose-200 bg-rose-50/40">
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-rose-800">
                      <CalendarCheck className="size-4" />
                      إدارة حالة الحجز
                    </h3>
                    <BookingStatusBadge status={selected.status} />
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
                      <a
                        href={`tel:${selected.customerPhone}`}
                        className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 text-sm font-bold text-white transition hover:bg-emerald-700"
                      >
                        <Phone className="size-4" />
                        اتصال بالعميلة
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Service info */}
              {selected.service && (
                <section className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900">الخدمة</h3>
                  <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-white p-4">
                    <img
                      src={selected.service.image}
                      alt={selected.service.name}
                      className="size-14 rounded-md border border-slate-200 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-slate-900">{selected.service.name}</div>
                      <div className="text-xs text-slate-500">
                        المدة: {formatDurationAr(selected.service.duration)}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      {formatPrice(selected.totalPrice)} {CURRENCY}
                    </div>
                  </div>
                </section>
              )}

              {/* Customer info */}
              <section className="space-y-2">
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <User className="size-4 text-rose-600" />
                  معلومات العميل
                </h3>
                <div className="grid gap-2 rounded-lg border border-slate-100 bg-white p-4 text-sm sm:grid-cols-2">
                  <InfoRow icon={User} label="الاسم" value={selected.customerName} />
                  <InfoRow icon={Phone} label="الجوال" value={selected.customerPhone} dir="ltr" />
                  <InfoRow
                    icon={Mail}
                    label="البريد"
                    value={selected.customerEmail || "—"}
                    dir="ltr"
                  />
                  <InfoRow
                    icon={Calendar}
                    label="التاريخ"
                    value={formatDateAr(selected.preferredDate)}
                  />
                  <InfoRow icon={Clock} label="الوقت" value={`الساعة ${selected.preferredTime}`} />
                </div>
              </section>

              {/* Notes */}
              {selected.notes && (
                <section className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900">ملاحظات العميلة</h3>
                  <div className="rounded-lg border border-slate-100 bg-amber-50/30 p-4 text-sm text-slate-700">
                    {selected.notes}
                  </div>
                </section>
              )}

              {/* Totals */}
              <section className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900">ملخص الحساب</h3>
                <div className="rounded-lg border border-slate-100 bg-white p-4 text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>سعر الخدمة</span>
                    <span className="text-slate-900">{formatPrice(selected.totalPrice)} {CURRENCY}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
                    <span>الإجمالي</span>
                    <span>{formatPrice(selected.totalPrice)} {CURRENCY}</span>
                  </div>
                </div>
              </section>
            </div>
          )}

          <div className="border-t border-slate-100 bg-slate-50 px-6 py-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={refreshSelected}
            >
              تحديث البيانات
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  dir,
}: {
  icon: typeof User;
  label: string;
  value: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="flex items-center gap-1 text-xs text-slate-500">
        <Icon className="size-3.5" />
        {label}
      </span>
      <span className="font-medium text-slate-900" dir={dir}>
        {value}
      </span>
    </div>
  );
}

function BookingStatusBadge({ status }: { status: string }) {
  const meta = BOOKING_STATUS[status] ?? { label: status, color: "slate" };
  const colorMap: Record<string, string> = {
    amber: "bg-amber-100 text-amber-700 border-amber-200",
    teal: "bg-teal-100 text-teal-700 border-teal-200",
    green: "bg-emerald-100 text-emerald-700 border-emerald-200",
    rose: "bg-rose-100 text-rose-700 border-rose-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold",
        colorMap[meta.color] ?? colorMap.slate
      )}
    >
      <span className={cn("size-1.5 rounded-full", STATUS_DOT[status] ?? "bg-slate-400")} />
      {meta.label}
    </span>
  );
}

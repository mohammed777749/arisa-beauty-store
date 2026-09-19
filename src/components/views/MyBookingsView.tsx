"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Search,
  Sparkles,
  ChevronLeft,
  Phone,
  User,
  X,
  Loader2,
  CalendarX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  formatPrice,
  CURRENCY,
  parseService,
  formatDurationAr,
  BOOKING_STATUS,
  type ServiceBooking,
} from "@/lib/types";
import { useCustomerAuth } from "@/store/customer-auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function formatDateAr(iso: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("ar-SA", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

const STATUS_COLOR: Record<string, string> = {
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  teal: "bg-teal-100 text-teal-700 border-teal-200",
  green: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rose: "bg-rose-100 text-rose-700 border-rose-200",
  slate: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function MyBookingsView() {
  const router = useRouter();
  const params = useSearchParams();
  const customer = useCustomerAuth((s) => s.current);
  const hasHydrated = useCustomerAuth((s) => s.hasHydrated);

  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL("/api/bookings", window.location.origin);
      if (customer?.phone) url.searchParams.set("phone", customer.phone);
      const res = await fetch(url.toString(), { cache: "no-store" });
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [customer?.phone]);

  useEffect(() => {
    if (!hasHydrated) return;
    load();
  }, [hasHydrated, load]);

  const filtered = useMemo(() => {
    if (!search.trim()) return bookings;
    const q = search.trim().toLowerCase();
    return bookings.filter(
      (b) =>
        b.customerName.toLowerCase().includes(q) ||
        b.customerPhone.toLowerCase().includes(q) ||
        (b.customerEmail ?? "").toLowerCase().includes(q) ||
        (b.service?.name ?? "").toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
    );
  }, [bookings, search]);

  const handleSearch = async () => {
    const q = search.trim();
    if (!q) {
      load();
      return;
    }
    setLoading(true);
    try {
      // Try phone first, then email
      const isEmail = q.includes("@");
      const url = new URL("/api/bookings", window.location.origin);
      url.searchParams.set(isEmail ? "email" : "phone", q);
      const res = await fetch(url.toString(), { cache: "no-store" });
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
      if ((Array.isArray(data) ? data : []).length === 0) {
        toast.info("لا توجد حجوزات لهذه البيانات");
      }
    } catch (e) {
      console.error(e);
      toast.error("فشل البحث");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async () => {
    if (!cancellingId) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/bookings?id=${cancellingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (!res.ok) throw new Error("فشل الإلغاء");
      setBookings((prev) =>
        prev.map((b) => (b.id === cancellingId ? { ...b, status: "cancelled" } : b))
      );
      toast.success("تم إلغاء الحجز");
      setCancellingId(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تعذّر الإلغاء");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
        <Link href="?view=home" className="hover:text-primary">الرئيسية</Link>
        <ChevronLeft className="size-3" />
        <span className="font-bold text-foreground">حجوزاتي</span>
      </nav>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground md:text-3xl">حجوزاتي</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {customer
              ? `مرحباً ${customer.name.split(" ")[0]}، استعرضي حجوزاتك التالية`
              : "ابحثي عن حجوزاتك برقم الجوال أو البريد الإلكتروني"}
          </p>
        </div>
        <Button asChild className="bg-primary-gradient text-white shadow-rose">
          <Link href="?view=services">
            <Sparkles className="size-4" />
            احجزي خدمة جديدة
          </Link>
        </Button>
      </div>

      {/* Search bar (only when not logged in, or always allow override) */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="ابحثي برقم الجوال أو البريد الإلكتروني..."
            className="pr-9"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                load();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="مسح"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <Button onClick={handleSearch} className="bg-primary text-white hover:bg-primary/90">
          <Search className="size-4" />
          بحث
        </Button>
      </div>

      {/* Bookings list */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border/60 bg-card py-16 text-center">
          <CalendarX className="size-14 text-muted-foreground/40" />
          <div>
            <p className="text-lg font-bold text-foreground">لا توجد حجوزات بعد</p>
            <p className="text-sm text-muted-foreground">احجزي خدمة تجميل الآن واستمتعي بتجربة استثنائية</p>
          </div>
          <Button asChild className="bg-primary-gradient text-white shadow-rose">
            <Link href="?view=services">
              <Sparkles className="size-4" />
              احجزي خدمة الآن
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b, i) => {
            const service = b.service ? parseService(b.service) : null;
            const meta = BOOKING_STATUS[b.status] ?? { label: b.status, color: "slate" };
            const canCancel = b.status === "pending" || b.status === "confirmed";
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.4) }}
                className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft"
              >
                <div className="flex flex-col gap-4 p-4 md:flex-row md:p-5">
                  {/* Service image */}
                  {service && (
                    <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-xl bg-muted md:size-24">
                      { }
                      <img
                        src={service.image}
                        alt={service.name}
                        className="size-full object-cover"
                      />
                    </div>
                  )}
                  {/* Details */}
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        {service && (
                          <h3 className="text-base font-extrabold text-foreground line-clamp-1">
                            {service.name}
                          </h3>
                        )}
                        <p className="text-xs text-muted-foreground">
                          رقم المرجع:{" "}
                          <span dir="ltr" className="font-mono font-bold text-foreground">
                            #{b.id.slice(-8).toUpperCase()}
                          </span>
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn("border", STATUS_COLOR[meta.color] ?? STATUS_COLOR.slate)}
                      >
                        {meta.label}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                      <InfoItem icon={Calendar} label="التاريخ" value={formatDateAr(b.preferredDate)} />
                      <InfoItem icon={Clock} label="الوقت" value={`الساعة ${b.preferredTime}`} />
                      <InfoItem icon={User} label="الاسم" value={b.customerName} />
                      <InfoItem
                        icon={Phone}
                        label="الجوال"
                        value={b.customerPhone}
                        dir="ltr"
                      />
                    </div>
                    {service && (
                      <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        المدة: {formatDurationAr(service.duration)}
                        <span className="mx-1">·</span>
                        السعر: <span className="font-bold text-primary">{formatPrice(b.totalPrice)} {CURRENCY}</span>
                      </p>
                    )}
                  </div>
                  {/* Actions */}
                  <div className="flex shrink-0 flex-col gap-2 md:w-32">
                    {service && (
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="border-primary/40 text-primary hover:bg-primary/10"
                      >
                        <Link href={`?view=service&id=${service.id}`}>التفاصيل</Link>
                      </Button>
                    )}
                    {canCancel ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCancellingId(b.id)}
                        className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                      >
                        <CalendarX className="size-3.5" />
                        إلغاء
                      </Button>
                    ) : (
                      <span className="text-center text-[11px] text-muted-foreground">
                        {b.status === "completed" ? "تمت الخدمة" : "ملغي"}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Cancel confirmation */}
      <AlertDialog open={!!cancellingId} onOpenChange={(o) => !o && setCancellingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد إلغاء الحجز</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكدة من إلغاء هذا الحجز؟ يمكنك إعادة الحجز في أي وقت. يُفضّل الإلغاء قبل ٢٤ ساعة من الموعد.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>تراجع</AlertDialogCancel>
            <AlertDialogAction
              onClick={cancelBooking}
              disabled={busy}
              className="bg-rose-600 text-white hover:bg-rose-700"
            >
              {busy ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  جارٍ الإلغاء
                </>
              ) : (
                "تأكيد الإلغاء"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function InfoItem({
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
      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
        <Icon className="size-3" />
        {label}
      </span>
      <span className="font-bold text-foreground" dir={dir}>
        {value}
      </span>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Calendar,
  Clock,
  Phone,
  User,
  Sparkles,
  Home,
  ShoppingBag,
  ChevronLeft,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatPrice,
  CURRENCY,
  parseService,
  formatDurationAr,
  BOOKING_STATUS,
  type ServiceBooking,
} from "@/lib/types";

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

export default function BookingSuccessView() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");

  const [booking, setBooking] = useState<ServiceBooking | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/bookings?id=${id}`, { cache: "no-store" });
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = (await res.json()) as ServiceBooking;
      setBooking(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <Skeleton className="h-72 w-full rounded-3xl" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-20 text-center">
        <Sparkles className="mx-auto size-12 text-muted-foreground/40" />
        <h1 className="mt-4 text-2xl font-bold">الحجز غير موجود</h1>
        <Button asChild className="mt-6 bg-primary-gradient text-white shadow-rose">
          <Link href="?view=services">تصفح الخدمات</Link>
        </Button>
      </div>
    );
  }

  const ref = booking.id.slice(-8).toUpperCase();
  const service = booking.service ? parseService(booking.service) : null;
  const status = BOOKING_STATUS[booking.status] ?? { label: booking.status, color: "slate" };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 md:py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-rose"
      >
        {/* Success header */}
        <div className="relative bg-primary-gradient px-6 py-10 text-center text-white">
          <div className="absolute -left-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -right-10 -bottom-10 size-48 rounded-full bg-gold/30 blur-3xl" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative mx-auto grid size-20 place-items-center rounded-full bg-white shadow-rose"
          >
            <CheckCircle2 className="size-12 text-emerald-500" />
          </motion.div>
          <h1 className="relative mt-4 text-2xl font-extrabold md:text-3xl">
            تم حجز موعدك بنجاح!
          </h1>
          <p className="relative mt-2 text-sm text-white/90">
            سنتواصل معك قريباً لتأكيد الموعد
          </p>
          <div className="relative mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold backdrop-blur">
            رقم المرجع: <span dir="ltr" className="tracking-wider">#{ref}</span>
          </div>
        </div>

        {/* Booking details */}
        <div className="p-6 md:p-8">
          {service && (
            <div className="mb-6 flex items-center gap-4 rounded-2xl border border-border/60 bg-muted/30 p-4">
              { }
              <img
                src={service.image}
                alt={service.name}
                className="size-16 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-extrabold text-foreground">{service.name}</h2>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  {formatDurationAr(service.duration)}
                </p>
              </div>
              <div className="text-left">
                <div className="text-base font-extrabold text-primary">
                  {formatPrice(booking.totalPrice)} {CURRENCY}
                </div>
              </div>
            </div>
          )}

          {/* Info grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoCard icon={User} label="الاسم" value={booking.customerName} />
            <InfoCard icon={Phone} label="الجوال" value={booking.customerPhone} dir="ltr" />
            <InfoCard
              icon={Calendar}
              label="التاريخ"
              value={formatDateAr(booking.preferredDate)}
            />
            <InfoCard
              icon={Clock}
              label="الوقت"
              value={`الساعة ${booking.preferredTime}`}
            />
          </div>

          {booking.notes && (
            <div className="mt-3 rounded-2xl border border-border/60 bg-muted/30 p-4">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                <MessageSquare className="size-3.5" /> ملاحظات
              </p>
              <p className="text-sm text-foreground">{booking.notes}</p>
            </div>
          )}

          {/* Status */}
          <div className="mt-3 flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
            <span className="text-sm font-bold text-foreground">حالة الحجز</span>
            <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
              <span className="size-1.5 rounded-full bg-amber-500" />
              {status.label}
            </span>
          </div>

          {/* What's next */}
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-extrabold text-foreground">ماذا بعد؟</h3>
            <ol className="space-y-3">
              {[
                "سيتواصل معك فريقنا خلال ساعات قليلة لتأكيد الموعد",
                "أحضري قبل ١٠ دقائق من الموعد المحدد لاستكمال الإجراءات",
                "يمكنك إلغاء أو تعديل الموعد مجاناً قبل ٢٤ ساعة",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary-gradient text-xs font-bold text-white shadow-rose">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* CTA buttons */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button
              onClick={() => router.push("?view=my-bookings", { scroll: false })}
              className="h-12 bg-primary-gradient text-white shadow-rose"
            >
              <Calendar className="size-4" />
              حجوزاتي
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 border-primary/40 text-primary hover:bg-primary/10"
            >
              <Link href="?view=home">
                <Home className="size-4" />
                متابعة التسوق
              </Link>
            </Button>
          </div>

          {/* Browse more services */}
          <div className="mt-6 text-center">
            <Button asChild variant="ghost" size="sm" className="text-primary">
              <Link href="?view=services">
                تصفحي كل خدماتنا التجميلية
                <ChevronLeft className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function InfoCard({
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
    <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
      <p className="mb-1 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </p>
      <p className="text-sm font-bold text-foreground" dir={dir}>
        {value}
      </p>
    </div>
  );
}

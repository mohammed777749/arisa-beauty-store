"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Clock,
  Calendar,
  ChevronLeft,
  User,
  Phone,
  Mail,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatPrice,
  CURRENCY,
  parseService,
  formatDurationAr,
  type Service,
} from "@/lib/types";
import { useCustomerAuth } from "@/store/customer-auth";
import { toast } from "sonner";

const TIME_SLOTS = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

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

export default function BookingView() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const customer = useCustomerAuth((s) => s.current);
  const hasHydrated = useCustomerAuth((s) => s.hasHydrated);

  const load = useCallback(async () => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setNotFound(false);
    try {
      const res = await fetch(`/api/services/${id}`, { cache: "no-store" });
      if (!res.ok) {
        setNotFound(true);
        return;
      }
      const svc = (await res.json()) as Service;
      setService(svc);
    } catch (e) {
      console.error(e);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  // Prefill from customer auth
  useEffect(() => {
    if (hasHydrated && customer && service) {
      if (!name) setName(customer.name);
      if (!phone) setPhone(customer.phone);
      if (!email && customer.email) setEmail(customer.email);
    }
  }, [hasHydrated, customer, service, name, phone, email]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <Skeleton className="mb-4 h-5 w-64" />
        <div className="grid gap-8 lg:grid-cols-3">
          <Skeleton className="lg:col-span-2 h-96 rounded-3xl" />
          <Skeleton className="h-96 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (notFound || !service) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-20 text-center">
        <Sparkles className="mx-auto size-12 text-muted-foreground/40" />
        <h1 className="mt-4 text-2xl font-bold">الخدمة غير موجودة</h1>
        <Button asChild className="mt-6 bg-primary-gradient text-white shadow-rose">
          <Link href="?view=services">العودة للخدمات</Link>
        </Button>
      </div>
    );
  }

  const s = parseService(service);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("الاسم الكامل مطلوب");
    if (!phone.trim() || phone.trim().length < 8) return toast.error("رقم جوال صحيح مطلوب");
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return toast.error("البريد الإلكتروني غير صحيح");
    }
    if (!date) return toast.error("التاريخ المفضل مطلوب");
    if (!time) return toast.error("الوقت المفضل مطلوب");

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: s.id,
          customerName: name.trim(),
          customerPhone: phone.trim(),
          customerEmail: email.trim() || null,
          preferredDate: date,
          preferredTime: time,
          notes: notes.trim() || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "فشل إنشاء الحجز");
      }
      const booking = await res.json();
      toast.success("تم حجز موعدك بنجاح!");
      router.push(`?view=booking-success&id=${booking.id}`, { scroll: false });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تعذّر إنشاء الحجز");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-5 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        <Link href="?view=home" className="hover:text-primary">الرئيسية</Link>
        <ChevronLeft className="size-3" />
        <Link href="?view=services" className="hover:text-primary">الخدمات</Link>
        <ChevronLeft className="size-3" />
        <Link href={`?view=service&id=${s.id}`} className="hover:text-primary line-clamp-1">
          {s.name}
        </Link>
        <ChevronLeft className="size-3" />
        <span className="font-bold text-foreground">الحجز</span>
      </nav>

      <div className="mb-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
          <Calendar className="size-4" />
          احجزي موعدك
        </span>
        <h1 className="mt-3 text-2xl font-extrabold text-foreground md:text-3xl">
          تأكيد حجز الخدمة
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          املئي البيانات أدناه وسنتواصل معك لتأكيد الموعد خلال ساعات قليلة
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-5 lg:col-span-2"
        >
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft md:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-foreground">
              <User className="size-5 text-primary" />
              معلومات التواصل
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">الاسم الكامل *</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: سارة العتيبي"
                    className="pr-9"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">رقم الجوال *</Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05xxxxxxxx"
                    className="pr-9 text-right"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="email">البريد الإلكتروني (اختياري)</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pr-9 text-right"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft md:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-foreground">
              <Calendar className="size-5 text-primary" />
              الموعد المفضل
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="date">التاريخ المفضل *</Label>
                <div className="relative">
                  <Calendar className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    min={tomorrowISO()}
                    onChange={(e) => setDate(e.target.value)}
                    className="pr-9"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="time">الوقت المفضل *</Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger id="time">
                    <SelectValue placeholder="اختاري الوقت" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {date && (
              <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="size-3.5 text-primary" />
                الموعد المحدد: <span className="font-bold text-foreground">{formatDateAr(date)}</span>
                {time && <span className="text-primary"> · الساعة {time}</span>}
              </p>
            )}

            <div className="mt-4 space-y-1.5">
              <Label htmlFor="notes">ملاحظات (اختياري)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي تفاصيل إضافية تودين إخبارنا بها..."
                rows={3}
              />
            </div>
          </div>

          {/* Submit (mobile) */}
          <Button
            type="submit"
            disabled={submitting}
            className="h-12 w-full bg-cta-gold text-base font-extrabold text-primary shadow-rose hover:brightness-105 disabled:opacity-50 lg:hidden"
          >
            {submitting ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                جارٍ التأكيد...
              </>
            ) : (
              <>
                <CheckCircle2 className="size-5" />
                تأكيد الحجز
              </>
            )}
          </Button>
        </motion.form>

        {/* Summary */}
        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="sticky top-24 space-y-4">
            {/* Service card */}
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-rose">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  src={s.image}
                  alt={s.name}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
                <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-foreground shadow-sm backdrop-blur">
                  <Clock className="size-3 text-primary" />
                  {formatDurationAr(s.duration)}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-base font-extrabold text-foreground">{s.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {s.description}
                </p>
              </div>
            </div>

            {/* Order summary */}
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
              <h3 className="mb-3 text-sm font-extrabold text-foreground">ملخص الحجز</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>سعر الخدمة</span>
                  <span className="font-medium text-foreground">
                    {formatPrice(s.price)} {CURRENCY}
                  </span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>الشحن</span>
                  <span className="font-medium text-emerald-600">مجاناً</span>
                </div>
                {date && (
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>الموعد</span>
                    <span className="font-medium text-foreground text-xs">{formatDateAr(date)}</span>
                  </div>
                )}
                {time && (
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>الوقت</span>
                    <span className="font-medium text-foreground">{time}</span>
                  </div>
                )}
                <Separator className="my-3" />
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-foreground">الإجمالي</span>
                  <span className="text-xl font-extrabold text-primary">
                    {formatPrice(s.price)} {CURRENCY}
                  </span>
                </div>
              </div>
              <Button
                type="button"
                onClick={() => {
                  const form = document.querySelector("form");
                  if (form) {
                    if (typeof form.requestSubmit === "function") {
                      form.requestSubmit();
                    } else {
                      form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
                    }
                  }
                }}
                disabled={submitting}
                className="mt-4 hidden h-12 w-full bg-cta-gold text-base font-extrabold text-primary shadow-rose hover:brightness-105 disabled:opacity-50 lg:flex"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    جارٍ التأكيد...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-5" />
                    تأكيد الحجز
                  </>
                )}
              </Button>
              <div className="mt-3 space-y-1.5 text-[11px] text-muted-foreground">
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-emerald-500" />
                  تأكيد فوري للحجز
                </p>
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-emerald-500" />
                  إلغاء مجاني قبل ٢٤ ساعة من الموعد
                </p>
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-emerald-500" />
                  بياناتك آمنة ومحمية
                </p>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}

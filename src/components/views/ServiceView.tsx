"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Clock,
  Sparkles,
  Check,
  ChevronLeft,
  Star,
  ShieldCheck,
  Heart,
  Award,
  Calendar,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import StarRating from "@/components/StarRating";
import ServiceCard from "@/components/ServiceCard";
import {
  formatPrice,
  CURRENCY,
  parseService,
  formatDurationAr,
  type Service,
  type ServiceCategory,
} from "@/lib/types";
import { toast } from "sonner";

export default function ServiceView() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");

  const [service, setService] = useState<Service | null>(null);
  const [related, setRelated] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setNotFound(false);
    try {
      const [svcRes, catRes] = await Promise.all([
        fetch(`/api/services/${id}`, { cache: "no-store" }),
        fetch("/api/services/categories", { cache: "no-store" }),
      ]);
      if (!svcRes.ok) {
        if (active) setNotFound(true);
        return;
      }
      const svc = (await svcRes.json()) as Service;
      if (!active) return;
      setService(svc);
      setCategories(((await catRes.json()).categories) ?? []);
      // Related: same category, exclude self
      const relRes = await fetch(
        `/api/services?category=${encodeURIComponent(svc.category)}&limit=6`,
        { cache: "no-store" }
      );
      const relData = await relRes.json();
      if (active) {
        const list: Service[] = Array.isArray(relData) ? relData : [];
        setRelated(list.filter((r) => r.id !== svc.id).slice(0, 4));
      }
    } catch (e) {
      console.error(e);
      if (active) setNotFound(true);
    } finally {
      if (active) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <Skeleton className="mb-4 h-5 w-64" />
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !service) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-20 text-center">
        <Sparkles className="mx-auto size-12 text-muted-foreground/40" />
        <h1 className="mt-4 text-2xl font-bold">الخدمة غير موجودة</h1>
        <p className="mt-2 text-muted-foreground">
          قد تكون الخدمة غير متوفرة أو تم حذفها.
        </p>
        <Button asChild className="mt-6 bg-primary-gradient text-white shadow-rose">
          <Link href="?view=services">العودة للخدمات</Link>
        </Button>
      </div>
    );
  }

  const s = parseService(service);
  const cat = categories.find((c) => c.slug === s.category);
  const discount =
    s.oldPrice && s.oldPrice > s.price
      ? Math.round(((s.oldPrice - s.price) / s.oldPrice) * 100)
      : 0;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-5 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        <Link href="?view=home" className="hover:text-primary">الرئيسية</Link>
        <ChevronLeft className="size-3" />
        <Link href="?view=services" className="hover:text-primary">الخدمات</Link>
        <ChevronLeft className="size-3" />
        {cat && (
          <>
            <Link
              href={`?view=services&category=${cat.slug}`}
              className="hover:text-primary"
            >
              {cat.name}
            </Link>
            <ChevronLeft className="size-3" />
          </>
        )}
        <span className="font-bold text-foreground line-clamp-1">{s.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-border/60 bg-muted shadow-rose">
            <Image
              src={s.image}
              alt={s.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute right-4 top-4 flex flex-col gap-2">
              {discount > 0 && (
                <Badge className="bg-destructive text-white shadow-sm">
                  خصم {discount}%
                </Badge>
              )}
              {s.isFeatured && (
                <Badge className="bg-gold text-white shadow-sm">
                  <Sparkles className="ml-1 size-3" /> خدمة مميزة
                </Badge>
              )}
              {s.isPopular && (
                <Badge className="bg-primary text-primary-foreground shadow-sm">
                  الأكثر طلباً
                </Badge>
              )}
            </div>
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col gap-5"
        >
          {cat && (
            <Link
              href={`?view=services&category=${cat.slug}`}
              className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary"
            >
              <Sparkles className="size-3" />
              {cat.name}
            </Link>
          )}
          <h1 className="text-2xl font-extrabold leading-tight text-foreground md:text-3xl">
            {s.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <StarRating rating={s.rating} size={18} showValue reviewCount={s.reviewCount} />
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="size-4 text-primary" />
              المدة: <span className="font-bold text-foreground">{formatDurationAr(s.duration)}</span>
            </span>
          </div>

          {/* Price */}
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-muted-foreground">سعر الخدمة</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-primary">
                    {formatPrice(s.price)}
                  </span>
                  <span className="text-sm font-bold text-primary">{CURRENCY}</span>
                  {s.oldPrice && s.oldPrice > s.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(s.oldPrice)} {CURRENCY}
                    </span>
                  )}
                </div>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                <Clock className="size-3" />
                {formatDurationAr(s.duration)}
              </span>
            </div>
            <Button
              onClick={() =>
                router.push(`?view=booking&id=${s.id}`, { scroll: false })
              }
              className="mt-4 h-12 w-full rounded-full bg-cta-gold text-base font-extrabold text-primary shadow-rose hover:brightness-105"
            >
              <Calendar className="size-5" />
              احجزي موعدك الآن
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              تأكيد فوري · إلغاء مجاني قبل ٢٤ ساعة
            </p>
          </div>

          {/* Description */}
          <div>
            <h2 className="mb-2 text-base font-extrabold text-foreground">
              عن الخدمة
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {s.description}
            </p>
          </div>

          {/* What included */}
          {s.whatIncluded.length > 0 && (
            <div>
              <h2 className="mb-3 text-base font-extrabold text-foreground">
                ما تتضمنه الخدمة
              </h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {s.whatIncluded.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 rounded-xl border border-border/60 bg-card p-3 text-sm text-foreground"
                  >
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                      <Check className="size-3" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </div>

      {/* Perks row */}
      <section className="mt-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: Award, title: "خبرة احترافية", desc: "خبيرات تجميل معتمدات" },
            { icon: ShieldCheck, title: "منتجات أصلية", desc: "من ماركات عالمية فاخرة" },
            { icon: Heart, title: "بيئة معقّمة", desc: "تعقيم كامل بعد كل عميلة" },
            { icon: Calendar, title: "حجز سهل", desc: "أونلاين خلال دقيقة" },
          ].map((p) => (
            <div
              key={p.title}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-card p-5 text-center shadow-soft"
            >
              <span className="grid size-12 place-items-center rounded-full bg-primary-gradient text-white shadow-rose">
                <p.icon className="size-5" />
              </span>
              <h3 className="text-sm font-extrabold text-foreground">{p.title}</h3>
              <p className="text-xs text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related services */}
      {related.length > 0 && (
        <section className="mt-12">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gold">خدمات ذات صلة</p>
              <h2 className="mt-1 text-xl font-extrabold text-foreground">قد يعجبكِ أيضاً</h2>
            </div>
            <Button asChild variant="ghost" className="text-primary hover:bg-primary/10">
              <Link href={`?view=services${cat ? `&category=${cat.slug}` : ""}`}>
                عرض الكل
                <ChevronLeft className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r, i) => (
              <ServiceCard
                key={r.id}
                service={r}
                index={i}
                categoryName={cat?.name}
              />
            ))}
          </div>
        </section>
      )}

      {/* Mobile booking CTA */}
      <div className="sticky bottom-0 left-0 right-0 z-20 mt-8 border-t border-border/60 bg-background/95 p-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[11px] text-muted-foreground">السعر</span>
            <span className="text-base font-extrabold text-primary">
              {formatPrice(s.price)} {CURRENCY}
            </span>
          </div>
          <Button
            onClick={() =>
              router.push(`?view=booking&id=${s.id}`, { scroll: false })
            }
            className="flex-1 bg-cta-gold font-bold text-primary hover:brightness-105"
          >
            <Calendar className="size-4" />
            احجزي الآن
          </Button>
        </div>
      </div>
    </div>
  );
}

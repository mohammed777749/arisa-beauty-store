"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Truck,
  ShieldCheck,
  RefreshCw,
  CreditCard,
  Sparkles,
  ArrowLeft,
  Gift,
  Heart,
} from "lucide-react";
import HeroSection from "@/components/HeroSection";
import CategoryCard from "@/components/CategoryCard";
import ProductGrid from "@/components/ProductGrid";
import SectionHeader from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import type { CategoryWithCount, Product } from "@/lib/types";

export default function HomeView() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const [catRes, featRes, bestRes, newRes] = await Promise.all([
          fetch("/api/categories", { cache: "no-store" }),
          fetch("/api/products?featured=true&limit=8", { cache: "no-store" }),
          fetch("/api/products?bestseller=true&limit=8", {
            cache: "no-store",
          }),
          fetch("/api/products?new=true&limit=8", { cache: "no-store" }),
        ]);
        const [cats, f, b, n] = await Promise.all([
          catRes.json(),
          featRes.json(),
          bestRes.json(),
          newRes.json(),
        ]);
        if (!active) return;
        setCategories(cats);
        setFeatured(f);
        setBestsellers(b);
        setNewArrivals(n);
      } catch (e) {
        console.error("Home fetch error:", e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-col">
      <HeroSection />

      {/* Categories */}
      <section className="container mx-auto max-w-7xl px-4 py-16">
        <SectionHeader
          eyebrow="تسوقي حسب الفئة"
          title="اكتشفي فئاتنا المميزة"
          subtitle="من المكياج إلى العطور — كل ما تحتاجينه لإطلالة متكاملة في مكان واحد"
          viewAllHref="?view=shop"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-3xl bg-muted"
                />
              ))
            : categories.map((c, i) => (
                <CategoryCard key={c.id} category={c} index={i} />
              ))}
        </div>
      </section>

      {/* Featured */}
      <section className="bg-rose-gradient py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeader
            eyebrow="مختارات جلورية"
            title="منتجات مميزة"
            subtitle="أبرز منتجاتنا التي اختارها فريق الجمال لدينا خصيصاً لكِ"
            viewAllHref="?view=shop"
          />
          <ProductGrid products={featured} loading={loading} />
        </div>
      </section>

      {/* Promo banner */}
      <section className="container mx-auto max-w-7xl px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-primary-gradient p-8 text-white shadow-rose md:p-14"
        >
          <div className="absolute -left-10 -top-10 size-44 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -right-10 -bottom-10 size-52 rounded-full bg-gold/30 blur-3xl" />
          <div className="relative grid items-center gap-6 md:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold backdrop-blur">
                <Gift className="size-4 text-gold" />
                عرض هذا الأسبوع
              </span>
              <h3 className="mt-4 text-3xl font-extrabold leading-tight md:text-4xl">
                خصم ٢٥٪ على جميع منتجات العطور
              </h3>
              <p className="mt-3 max-w-md text-white/90">
                دليلك إلى الروائح الفاخرة — استمتعي بخصم خاص على عطور الورد
                والمسك والعود. استخدمي الكود <span className="font-bold text-gold">GLAM25</span>
              </p>
              <Button
                asChild
                size="lg"
                className="mt-6 rounded-full bg-white px-7 font-bold text-primary shadow-rose hover:bg-white/90"
              >
                <Link
                  href="?view=shop&category=perfume"
                  className="flex items-center gap-2"
                >
                  تسوقي العطور
                  <ArrowLeft className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="hidden items-center justify-center md:flex">
              <div className="relative size-56 rounded-full bg-white/15 backdrop-blur-xl">
                <div className="absolute inset-0 grid place-items-center">
                  <Sparkles className="size-20 text-gold" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Bestsellers */}
      <section className="container mx-auto max-w-7xl px-4 py-16">
        <SectionHeader
          eyebrow="الأكثر طلباً"
          title="الأكثر مبيعاً"
          subtitle="المنتجات التي أحبتها عميلاتنا — جربيها واكتشفي السبب"
          viewAllHref="?view=shop"
        />
        <ProductGrid products={bestsellers} loading={loading} />
      </section>

      {/* New arrivals */}
      <section className="bg-rose-gradient py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeader
            eyebrow="وصل حديثاً"
            title="أحدث المنتجات"
            subtitle="كن أول من يجرب أحدث وصولات جلورية"
            viewAllHref="?view=shop"
          />
          <ProductGrid products={newArrivals} loading={loading} />
        </div>
      </section>

      {/* Brand values */}
      <section className="container mx-auto max-w-7xl px-4 py-16">
        <SectionHeader
          eyebrow="لماذا جلورية؟"
          title="تجربة تسوق استثنائية"
          subtitle="نحرص على راحتك في كل خطوة"
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            {
              icon: Truck,
              title: "شحن مجاني",
              desc: "للطلبات فوق ٢٠٠ ر.س داخل المملكة",
            },
            {
              icon: ShieldCheck,
              title: "ضمان الجودة",
              desc: "منتجات أصلية ١٠٠٪ من ماركات موثوقة",
            },
            {
              icon: CreditCard,
              title: "دفع آمن",
              desc: "بطاقة، مدى، آبل باي أو الدفع عند الاستلام",
            },
            {
              icon: RefreshCw,
              title: "إرجاع سهل",
              desc: "استبدال أو استرجاع خلال ١٤ يوماً",
            },
          ].map((v) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card p-6 text-center shadow-soft"
            >
              <span className="grid size-14 place-items-center rounded-full bg-primary-gradient text-white shadow-rose">
                <v.icon className="size-6" />
              </span>
              <h3 className="text-base font-extrabold text-foreground">
                {v.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {v.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-rose-gradient py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeader
            eyebrow="آراء عميلاتنا"
            title="ماذا قالت عنّا عميلاتنا"
            subtitle="تجارب حقيقية من نساء اخترن جلورية"
          />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                name: "نورة العتيبي",
                city: "الرياض",
                text: "منتجات أصلية وتغليف فاخر. وصل الطلب بسرعة وكريم الأساس رائع جداً!",
              },
              {
                name: "سارة المالكي",
                city: "جدة",
                text: "العطور فخمة وثابتة. عطر الورد الدمشقي أصبح المفضل لدي، أنصح به بشدة.",
              },
              {
                name: "ريم الشمري",
                city: "الدمام",
                text: "خدمة عملاء ممتازة وسرعة في الرد. جودة المنتجات تفوق التوقعات.",
              },
            ].map((t) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-6 shadow-soft"
              >
                <div className="flex gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Sparkles key={i} className="size-4 fill-gold" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-primary-gradient text-white">
                    <Heart className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

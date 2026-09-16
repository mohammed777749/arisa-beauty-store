"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative">
      <div className="relative h-[60vh] min-h-[460px] w-full overflow-hidden md:h-[78vh] md:min-h-[560px]">
        <Image
          src="/images/hero.jpg"
          alt="جلورية - متجر التجميل الفاخر"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="container relative mx-auto flex h-full max-w-7xl items-center px-4">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-xl text-white"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold backdrop-blur-md">
              <Sparkles className="size-3.5 text-gold" />
              مجموعة ٢٠٢٦ الجديدة
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight drop-shadow-md sm:text-5xl md:text-6xl md:leading-tight">
              جمالكِ يبدأ
              <br />
              <span className="bg-gradient-to-l from-rose-200 via-white to-amber-200 bg-clip-text text-transparent">
                من هنا
              </span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/90 drop-shadow sm:text-lg">
              اكتشفي عالم جلورية من المكياج الفاخر والعطور الساحرة والعناية
              المتكاملة. منتجات أصلية مختارة بعناية لتبرز جمالك الطبيعي.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-primary-gradient px-8 text-base font-bold shadow-rose hover:scale-105"
              >
                <Link href="?view=shop" className="flex items-center gap-2">
                  تسوقي الآن
                  <ArrowLeft className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/40 bg-white/10 px-7 text-base font-bold text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
              >
                <Link href="?view=shop&category=perfume">العطور الفاخرة</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-8 flex items-center gap-6 text-white/90">
              <div>
                <p className="text-2xl font-extrabold text-gold">+٢٥٠</p>
                <p className="text-xs text-white/80">منتج فاخر</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div>
                <p className="text-2xl font-extrabold text-gold">+٤٠ ألف</p>
                <p className="text-xs text-white/80">عميلة سعيدة</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-extrabold text-gold">٤.٩</span>
                  <Star className="size-4 fill-gold text-gold" />
                </div>
                <p className="text-xs text-white/80">متوسط التقييم</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating promo strip */}
      <div className="container mx-auto -mt-8 max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-soft md:grid-cols-4"
        >
          {[
            { t: "خصومات تصل إلى ٥٠٪", s: "على منتجات مختارة" },
            { t: "شحن سريع خلال ٢٤ ساعة", s: "لكل مدن المملكة" },
            { t: "منتجات أصلية ١٠٠٪", s: "ضمان الجودة" },
            { t: "دفع عند الاستلام", s: "ادفعي بكل أمان" },
          ].map((item) => (
            <div
              key={item.t}
              className="flex items-center gap-2 rounded-xl bg-muted/50 p-3"
            >
              <Sparkles className="size-4 shrink-0 text-gold" />
              <div>
                <p className="text-xs font-bold text-foreground">{item.t}</p>
                <p className="text-[11px] text-muted-foreground">{item.s}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

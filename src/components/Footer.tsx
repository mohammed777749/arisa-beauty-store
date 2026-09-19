"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Shield,
  RefreshCw,
  MessageCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BRAND, phoneLink, whatsappLink } from "@/lib/brand";

const valueProps = [
  { icon: Truck, title: "شحن مجاني", desc: "للطلبات فوق ٢٠٠ ر.س" },
  { icon: Shield, title: "دفع آمن", desc: "حماية كاملة لمعلوماتك" },
  { icon: RefreshCw, title: "إرجاع سهل", desc: "خلال ١٤ يوم" },
  { icon: CreditCard, title: "دفع عند الاستلام", desc: "ادفعي عند وصول طلبك" },
];

const columns = [
  {
    title: "تسوقي",
    links: [
      { label: "المكياج", href: "?view=shop&category=makeup" },
      { label: "الشفاه", href: "?view=shop&category=lips" },
      { label: "العناية بالبشرة", href: "?view=shop&category=skincare" },
      { label: "العطور", href: "?view=shop&category=perfume" },
      { label: "الشعر", href: "?view=shop&category=hair" },
      { label: "الأظافر", href: "?view=shop&category=nails" },
    ],
  },
  {
    title: "خدماتنا التجميلية",
    links: [
      { label: "تجهيز العرايس", href: "?view=services&category=bridal" },
      { label: "تكبير الشفاة", href: "?view=services&category=lips" },
      { label: "العناية بالبشرة", href: "?view=services&category=skincare" },
      { label: "المكياج الاحترافي", href: "?view=services&category=makeup" },
      { label: "إزالة الشعر بالليزر", href: "?view=services&category=laser" },
      { label: "حمام مغربي ومساج", href: "?view=services&category=spa" },
    ],
  },
  {
    title: "خدمة العملاء",
    links: [
      { label: "تواصلي معنا", href: "?view=home" },
      { label: "الشحن والتوصيل", href: "?view=home" },
      { label: "الإرجاع والاستبدال", href: "?view=home" },
      { label: "الأسئلة الشائعة", href: "?view=home" },
      { label: "تتبع الطلب", href: "?view=home" },
    ],
  },
  {
    title: `عن ${BRAND.nameAr}`,
    links: [
      { label: "من نحن", href: "?view=home" },
      { label: "سياسة الخصوصية", href: "?view=home" },
      { label: "الشروط والأحكام", href: "?view=home" },
      { label: "المدونة", href: "?view=home" },
      { label: "وظائف", href: "?view=home" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-gradient-to-b from-muted/40 to-muted/70">
      {/* Value props */}
      <div className="border-b border-border/60 bg-background/60">
        <div className="container mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 md:grid-cols-4">
          {valueProps.map((v) => (
            <div
              key={v.title}
              className="flex items-center gap-3 rounded-2xl bg-background/70 p-3 shadow-soft"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-gradient text-white shadow-rose">
                <v.icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-extrabold text-foreground">
                  {v.title}
                </p>
                <p className="text-xs text-muted-foreground">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand + newsletter */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="?view=home" className="flex items-center gap-2">
              <Image
                src={BRAND.logo}
                alt={BRAND.nameAr}
                width={44}
                height={44}
                className="size-11 rounded-full object-cover shadow-rose"
              />
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-extrabold text-primary">
                  {BRAND.nameAr}
                </span>
                <span className="text-[10px] font-medium tracking-widest text-gold">
                  {BRAND.taglineEn}
                </span>
              </div>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {BRAND.nameAr} — وجهتكِ الأولى للتجميل الفاخر في المملكة العربية
              السعودية. منتجات أصلية وخدمات تجميل احترافية على أيدي خبيرات
              معتمدات، لتعيشي تجربة جمال استثنائية.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("تم الاشتراك في النشرة البريدية بنجاح");
                (e.currentTarget.querySelector("input") as HTMLInputElement).value = "";
              }}
              className="mt-6"
            >
              <label className="mb-2 block text-sm font-bold">
                اشتركي في نشرتنا البريدية
              </label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  required
                  placeholder="بريدك الإلكتروني"
                  className="h-11 rounded-full bg-background"
                />
                <Button
                  type="submit"
                  className="h-11 shrink-0 rounded-full bg-primary-gradient px-5 font-bold shadow-rose"
                >
                  اشتراك
                </Button>
              </div>
            </form>

            {/* Contact */}
            <ul className="mt-6 space-y-2 text-sm">
              <li>
                <a
                  href={phoneLink()}
                  className="flex items-center gap-2 text-muted-foreground transition hover:text-primary"
                  dir="ltr"
                >
                  <Phone className="size-4 shrink-0 text-primary" />
                  {BRAND.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground transition hover:text-[#25D366]"
                >
                  <MessageCircle className="size-4 shrink-0 text-[#25D366]" />
                  <span>تواصلي عبر واتساب</span>
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="size-4 shrink-0 text-primary" />
                <span>{BRAND.email}</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4 shrink-0 text-primary" />
                <span>الرياض، المملكة العربية السعودية</span>
              </li>
            </ul>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-extrabold uppercase tracking-wide text-foreground">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social + payments */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 md:flex-row">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-muted-foreground">
              تابعينا:
            </span>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="grid size-9 place-items-center rounded-full bg-[#25D366] text-white transition hover:scale-110"
            >
              <MessageCircle className="size-4" />
            </a>
            {[
              { Icon: Instagram, label: "Instagram", href: BRAND.instagram },
              { Icon: Twitter, label: "Twitter", href: BRAND.twitter },
              { Icon: Facebook, label: "Facebook", href: BRAND.facebook },
              { Icon: Youtube, label: "Youtube", href: BRAND.youtube },
            ].map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid size-9 place-items-center rounded-full bg-muted text-foreground transition hover:bg-primary hover:text-primary-foreground"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground">
              طرق الدفع:
            </span>
            {["VISA", "MC", "MADA", "APPLE", "STC"].map((p) => (
              <span
                key={p}
                className="rounded-md border border-border/60 bg-background px-2 py-1 text-[10px] font-bold text-muted-foreground"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border/60 bg-background/60">
        <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-center text-xs text-muted-foreground md:flex-row md:text-right">
          <p>© {new Date().getFullYear()} {BRAND.nameAr} — {BRAND.taglineAr}. جميع الحقوق محفوظة.</p>
          <p>
            صُنع بحب في المملكة العربية السعودية —{" "}
            <span className="text-gold">{BRAND.taglineEn}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

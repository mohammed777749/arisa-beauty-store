"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  Sparkles,
  Phone,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "الرئيسية", href: "?view=home" },
  { label: "المكياج", href: "?view=shop&category=makeup" },
  { label: "الشفاه", href: "?view=shop&category=lips" },
  { label: "الشعر", href: "?view=shop&category=hair" },
  { label: "الأظافر", href: "?view=shop&category=nails" },
  { label: "العطور", href: "?view=shop&category=perfume" },
  { label: "العناية بالبشرة", href: "?view=shop&category=skincare" },
];

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const cartCount = useCart((s) => s.getTotalItems());
  const openCart = useCart((s) => s.openCart);
  const hasHydrated = useCart((s) => s.hasHydrated);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const currentView = searchParams.get("view") ?? "home";
  const currentCat = searchParams.get("category");

  const isActive = (href: string) => {
    const url = new URL(href, "http://x");
    const v = url.searchParams.get("view");
    const c = url.searchParams.get("category");
    if (v === "home") return currentView === "home";
    return currentView === v && currentCat === c;
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("view", "shop");
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    router.push(`?${params.toString()}`);
    setMobileOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl transition-shadow",
        scrolled && "shadow-soft"
      )}
    >
      {/* Top utility bar */}
      <div className="hidden bg-primary-gradient text-primary-foreground md:block">
        <div className="container mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs">
          <p className="flex items-center gap-2 font-medium">
            <Sparkles className="size-3.5" />
            شحن مجاني للطلبات فوق ٢٠٠ ر.س — توصيل سريع لكل مدن المملكة
          </p>
          <div className="flex items-center gap-4">
            <a
              href="tel:+966920000000"
              className="flex items-center gap-1 transition hover:opacity-80"
              dir="ltr"
            >
              <Phone className="size-3.5" /> +966 92 000 0000
            </a>
            <span className="opacity-60">|</span>
            <span>تابعينا على إنستغرام وتيك توك</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-3 md:h-20">
          {/* Mobile menu button */}
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-foreground transition hover:bg-muted md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="القائمة"
          >
            <Menu className="size-5" />
          </button>

          {/* Logo */}
          <Link href="?view=home" className="flex shrink-0 items-center gap-2">
            <span className="grid size-10 place-items-center rounded-full bg-primary-gradient text-white shadow-rose md:size-11">
              <Sparkles className="size-5" />
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-extrabold text-primary md:text-2xl">
                جلورية
              </span>
              <span className="text-[10px] font-medium tracking-widest text-gold md:text-[11px]">
                GLAMOUR BEAUTY
              </span>
            </div>
          </Link>

          {/* Search bar - desktop */}
          <form
            onSubmit={submitSearch}
            className="relative mx-4 hidden flex-1 max-w-xl md:block"
          >
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="ابحثي عن منتج، ماركة، أو فئة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 rounded-full border-border/70 bg-muted/60 pr-10 text-sm shadow-none focus-visible:bg-background focus-visible:ring-primary/30"
            />
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full text-foreground transition hover:bg-muted"
              aria-label="المفضلة"
              onClick={() => router.push("?view=shop")}
            >
              <Heart className="size-5" />
            </button>
            <button
              type="button"
              onClick={openCart}
              className="relative grid size-10 place-items-center rounded-full text-foreground transition hover:bg-muted"
              aria-label="السلة"
            >
              <ShoppingCart className="size-5" />
              {hasHydrated && cartCount > 0 && (
                <span className="absolute -left-0.5 -top-0.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden border-t border-border/40 md:block">
          <ul className="flex items-center justify-center gap-1 py-2.5">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground shadow-rose"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile menu sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-full p-0 sm:max-w-sm">
          <SheetHeader className="bg-primary-gradient p-5 text-primary-foreground">
            <SheetTitle className="flex items-center justify-between text-lg font-extrabold text-white">
              القائمة
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="إغلاق"
                className="grid size-8 place-items-center rounded-full bg-white/15"
              >
                <X className="size-4" />
              </button>
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 p-5">
            <form onSubmit={submitSearch} className="relative">
              <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="ابحثي..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 rounded-full bg-muted/60 pr-10"
              />
            </form>
            <nav className="flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm font-bold transition-colors",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}

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
  MapPin,
  ChevronDown,
  User,
  Package,
  ListChecks,
  Truck,
  ChevronLeft,
  Gift,
  Zap,
  HelpCircle,
  Phone,
  Crown,
  LayoutGrid,
  Sun,
  Moon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "عروض اليوم", href: "?view=shop&sort=price-asc", icon: Zap },
  { label: "الأكثر مبيعاً", href: "?view=shop&sort=bestselling", icon: Crown },
  { label: "جديدنا", href: "?view=shop&sort=newest", icon: Sparkles },
  { label: "بطاقات الهدايا", href: "?view=home", icon: Gift },
  { label: "تتبع طلبك", href: "?view=orders", icon: Truck },
  { label: "تواصلي معنا", href: "?view=home", icon: HelpCircle },
];

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaNavOpen, setMegaNavOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("q") ?? searchParams.get("search") ?? ""
  );
  const [searchCategory, setSearchCategory] = useState(
    searchParams.get("category") ?? "all"
  );

  const cartCount = useCart((s) => s.getTotalItems());
  const openCart = useCart((s) => s.openCart);
  const hasHydrated = useCart((s) => s.hasHydrated);
  const wishlistCount = useWishlist((s) => s.items.length);
  const wishlistHydrated = useWishlist((s) => s.hasHydrated);
  const { resolvedTheme, setTheme } = useTheme();
  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  useEffect(() => {
    const onScroll = () => {
      // simple scroll-aware no-op (kept for future use)
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const currentView = searchParams.get("view") ?? "home";
  const currentCat = searchParams.get("category");

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("view", "search");
    if (searchTerm.trim()) params.set("q", searchTerm.trim());
    if (searchCategory && searchCategory !== "all")
      params.set("category", searchCategory);
    router.push(`?${params.toString()}`);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amazon-divider bg-background">
      {/* ===== Top utility bar ===== */}
      <div className="bg-mega-nav text-white">
        <div className="container mx-auto flex h-14 max-w-7xl items-center gap-3 px-3 text-sm">
          {/* Mobile menu button */}
          <button
            type="button"
            className="grid size-9 shrink-0 place-items-center rounded-md transition hover:bg-white/10 md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="القائمة"
          >
            <Menu className="size-5" />
          </button>

          {/* Mobile cart */}
          <button
            type="button"
            onClick={openCart}
            className="relative grid size-9 shrink-0 place-items-center rounded-md transition hover:bg-white/10 md:hidden"
            aria-label="السلة"
          >
            <ShoppingCart className="size-5" />
            {hasHydrated && cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-cta-orange px-1 text-[10px] font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {/* Logo (RTL: appears on the right) */}
          <Link
            href="?view=home"
            className="flex shrink-0 items-center gap-2 rounded-md px-1.5 py-1 transition hover:bg-white/10"
          >
            <span className="grid size-9 place-items-center rounded-md bg-cta-gold text-primary shadow-amazon">
              <Sparkles className="size-5" />
            </span>
            <div className="hidden flex-col leading-none sm:flex">
              <span className="text-lg font-extrabold text-white">جلورية</span>
              <span className="text-[9px] font-medium tracking-widest text-gold">
                GLAMOUR BEAUTY
              </span>
            </div>
          </Link>

          {/* Deliver to */}
          <button
            type="button"
            className="hidden items-center gap-1.5 rounded-md px-2 py-1.5 text-right transition hover:bg-white/10 lg:flex"
            onClick={() => router.push("?view=orders")}
          >
            <MapPin className="size-4 shrink-0 text-white/70" />
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] text-white/70">التوصيل إلى</span>
              <span className="text-xs font-bold text-white">الرياض</span>
            </div>
          </button>

          {/* Search bar */}
          <form
            onSubmit={submitSearch}
            className="relative flex flex-1 items-center overflow-hidden rounded-md bg-white shadow-amazon"
            style={{ maxWidth: "100%" }}
          >
            <div className="hidden shrink-0 items-center gap-1 border-l border-amazon-divider bg-muted/40 px-2 py-2 text-xs font-bold text-foreground hover:bg-muted sm:flex">
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="cursor-pointer bg-transparent pr-1 text-xs font-bold outline-none"
                aria-label="قسم البحث"
              >
                <option value="all">كل الأقسام</option>
                <option value="makeup">المكياج</option>
                <option value="lips">الشفاه</option>
                <option value="hair">الشعر</option>
                <option value="nails">الأظافر</option>
                <option value="perfume">العطور</option>
                <option value="skincare">العناية بالبشرة</option>
              </select>
              <ChevronDown className="size-3 text-muted-foreground" />
            </div>
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground sm:right-auto sm:left-3" />
            <Input
              type="search"
              placeholder="ابحثي في جلورية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 rounded-none border-0 bg-transparent pr-9 text-sm shadow-none focus-visible:ring-0 sm:pr-3"
            />
            <button
              type="submit"
              aria-label="بحث"
              className="grid h-10 w-11 shrink-0 place-items-center bg-cta-gold text-primary transition hover:brightness-105"
            >
              <Search className="size-5" />
            </button>
          </form>

          {/* Account dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="hidden shrink-0 items-center gap-1 rounded-md px-2 py-1.5 text-right transition hover:bg-white/10 md:flex"
              >
                <User className="size-5 shrink-0 text-white/80" />
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] text-white/70">مرحباً، تسجيل الدخول</span>
                  <span className="flex items-center gap-0.5 text-xs font-bold text-white">
                    حسابي والقوائم
                    <ChevronDown className="size-3" />
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 rounded-xl border-border bg-popover p-2 text-right"
            >
              <DropdownMenuLabel className="text-sm font-extrabold text-foreground">
                حسابي
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="?view=home" className="cursor-pointer justify-end gap-2 rounded-lg text-sm">
                  تسجيل الدخول
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="?view=orders" className="cursor-pointer justify-end gap-2 rounded-lg text-sm">
                  <Package className="size-4" /> طلباتي
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="?view=wishlist" className="cursor-pointer justify-end gap-2 rounded-lg text-sm">
                  <Heart className="size-4" /> قائمة الأمنيات
                  {wishlistHydrated && wishlistCount > 0 && (
                    <span className="rounded-full bg-primary/10 px-1.5 text-[10px] font-bold text-primary">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="?view=home" className="cursor-pointer justify-end gap-2 rounded-lg text-sm">
                  <MapPin className="size-4" /> عناويني
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="?view=home" className="cursor-pointer justify-end gap-2 rounded-lg text-sm">
                  <ListChecks className="size-4" /> طرق الدفع
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Returns & orders */}
          <button
            type="button"
            onClick={() => router.push("?view=orders")}
            className="hidden shrink-0 flex-col items-end rounded-md px-2 py-1.5 leading-tight transition hover:bg-white/10 lg:flex"
          >
            <span className="text-[11px] text-white/70">المرتجعات</span>
            <span className="text-xs font-bold text-white">والطلبات</span>
          </button>

          {/* Dark mode toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            suppressHydrationWarning
            className="hidden size-9 shrink-0 place-items-center rounded-md transition hover:bg-white/10 md:grid"
            aria-label="تبديل الوضع الليلي"
            title="تبديل الوضع الليلي/النهاري"
          >
            <Sun className="size-5 hidden dark:block" />
            <Moon className="size-5 block dark:hidden" />
          </button>

          {/* Wishlist */}
          <button
            type="button"
            onClick={() => router.push("?view=wishlist")}
            className="relative hidden shrink-0 grid size-9 place-items-center rounded-md transition hover:bg-white/10 md:grid"
            aria-label="قائمة الأمنيات"
          >
            <Heart className="size-5" />
            {wishlistHydrated && wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-cta-orange px-1 text-[10px] font-bold text-white">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            type="button"
            onClick={openCart}
            className="relative flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 transition hover:bg-white/10"
            aria-label="السلة"
          >
            <div className="relative">
              <span className="grid size-8 place-items-center">
                <ShoppingCart className="size-6" />
              </span>
              {hasHydrated && cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-cta-orange px-1 text-[11px] font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </div>
            <span className="hidden text-xs font-bold text-white lg:inline">السلة</span>
          </button>
        </div>
      </div>

      {/* ===== Second nav bar (mega-nav) ===== */}
      <div className="bg-mega-nav border-t border-white/10 text-white">
        <div className="container mx-auto flex h-10 max-w-7xl items-center gap-1 px-3 text-xs">
          {/* All menu (hamburger) */}
          <Sheet open={megaNavOpen} onOpenChange={setMegaNavOpen}>
            <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-sm">
              <SheetHeader className="bg-mega-nav p-5 text-white">
                <SheetTitle className="flex items-center justify-between text-lg font-extrabold text-white">
                  <span className="flex items-center gap-2">
                    <LayoutGrid className="size-5" />
                    تسوقي حسب القسم
                  </span>
                  <button
                    type="button"
                    onClick={() => setMegaNavOpen(false)}
                    aria-label="إغلاق"
                    className="grid size-8 place-items-center rounded-full bg-white/15"
                  >
                    <X className="size-4" />
                  </button>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 p-4">
                <Link
                  href="?view=shop"
                  onClick={() => setMegaNavOpen(false)}
                  className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-bold hover:bg-muted"
                >
                  كل المنتجات
                  <ChevronLeft className="size-4 text-muted-foreground" />
                </Link>
                {[
                  { slug: "makeup", name: "المكياج" },
                  { slug: "lips", name: "الشفاه" },
                  { slug: "hair", name: "الشعر" },
                  { slug: "nails", name: "الأظافر" },
                  { slug: "perfume", name: "العطور" },
                  { slug: "skincare", name: "العناية بالبشرة" },
                ].map((c) => (
                  <Link
                    key={c.slug}
                    href={`?view=shop&category=${c.slug}`}
                    onClick={() => setMegaNavOpen(false)}
                    className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium hover:bg-muted"
                  >
                    {c.name}
                    <ChevronLeft className="size-4 text-muted-foreground" />
                  </Link>
                ))}
                <div className="my-2 h-px bg-border" />
                <Link
                  href="?view=shop&sort=price-asc"
                  onClick={() => setMegaNavOpen(false)}
                  className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-bold hover:bg-muted"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="size-4 text-amber-500" />
                    عروض اليوم
                  </span>
                  <ChevronLeft className="size-4 text-muted-foreground" />
                </Link>
                <Link
                  href="?view=shop&sort=bestselling"
                  onClick={() => setMegaNavOpen(false)}
                  className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-bold hover:bg-muted"
                >
                  <span className="flex items-center gap-2">
                    <Crown className="size-4 text-amber-500" />
                    الأكثر مبيعاً
                  </span>
                  <ChevronLeft className="size-4 text-muted-foreground" />
                </Link>
                <Link
                  href="?view=shop&sort=newest"
                  onClick={() => setMegaNavOpen(false)}
                  className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-bold hover:bg-muted"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="size-4 text-gold" />
                    المنتجات الجديدة
                  </span>
                  <ChevronLeft className="size-4 text-muted-foreground" />
                </Link>
                <Link
                  href="?view=orders"
                  onClick={() => setMegaNavOpen(false)}
                  className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium hover:bg-muted"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="size-4 text-muted-foreground" />
                    خدمة العملاء
                  </span>
                  <ChevronLeft className="size-4 text-muted-foreground" />
                </Link>
              </div>
            </SheetContent>
            <button
              type="button"
              onClick={() => setMegaNavOpen(true)}
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 font-bold transition hover:bg-white/10"
            >
              <Menu className="size-4" />
              الكل
            </button>
          </Sheet>

          {/* Quick links */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {NAV_LINKS.map((item) => {
              const isActive =
                currentView ===
                new URL(item.href, "http://x").searchParams.get("view");
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition hover:bg-white/10",
                    isActive && "bg-white/10"
                  )}
                >
                  <item.icon className="size-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Prime badge */}
          <div className="ms-auto flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-bold">
            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-1 text-emerald-200">
              <Truck className="size-3.5" />
              توصيل سريع
            </span>
          </div>
        </div>
      </div>

      {/* Mobile menu sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-sm">
          <SheetHeader className="bg-mega-nav p-5 text-white">
            <SheetTitle className="flex items-center justify-between text-lg font-extrabold text-white">
              <span className="flex items-center gap-2">
                <Sparkles className="size-5 text-gold" />
                جلورية
              </span>
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
          <div className="flex flex-col gap-3 p-5">
            {/* Mobile search */}
            <form onSubmit={submitSearch} className="flex items-stretch gap-1.5">
              <Input
                type="search"
                placeholder="ابحثي..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 rounded-md bg-muted/60 text-sm"
              />
              <Button
                type="submit"
                className="h-10 shrink-0 rounded-md bg-cta-gold px-3 font-bold text-primary hover:brightness-105"
                aria-label="بحث"
              >
                <Search className="size-4" />
              </Button>
            </form>

            {/* Account quick links */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="?view=orders"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-xs font-bold"
              >
                <Package className="size-4 text-primary" /> طلباتي
              </Link>
              <Link
                href="?view=wishlist"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-xs font-bold"
              >
                <Heart className="size-4 text-primary" /> الأمنيات
                {wishlistHydrated && wishlistCount > 0 && (
                  <span className="ms-auto rounded-full bg-primary/10 px-1.5 text-[10px] font-bold text-primary">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </div>

            <div className="my-1 h-px bg-border" />

            {/* Categories */}
            <p className="px-1 text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
              الأقسام
            </p>
            <nav className="flex flex-col gap-0.5">
              {[
                { slug: null, name: "كل المنتجات" },
                { slug: "makeup", name: "المكياج" },
                { slug: "lips", name: "الشفاه" },
                { slug: "hair", name: "الشعر" },
                { slug: "nails", name: "الأظافر" },
                { slug: "perfume", name: "العطور" },
                { slug: "skincare", name: "العناية بالبشرة" },
              ].map((c) => (
                <Link
                  key={c.slug ?? "all"}
                  href={c.slug ? `?view=shop&category=${c.slug}` : "?view=shop"}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold",
                    currentCat === c.slug ||
                      (!currentCat && c.slug === null)
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  )}
                >
                  {c.name}
                  <ChevronLeft className="size-4 text-muted-foreground" />
                </Link>
              ))}
            </nav>

            <div className="my-1 h-px bg-border" />

            {/* Help */}
            <div className="flex items-center justify-center gap-2 rounded-lg bg-muted/50 p-3 text-[11px] text-muted-foreground">
              <Phone className="size-3.5 text-primary" />
              خدمة العملاء: <span dir="ltr" className="font-bold">+966 92 000 0000</span>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}

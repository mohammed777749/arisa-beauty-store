"use client";

import { useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  MessageSquare,
  Store,
  Menu,
  Plus,
  Bell,
  Search,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminCategories from "@/components/admin/AdminCategories";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminReviews from "@/components/admin/AdminReviews";

type Tab = "dashboard" | "products" | "categories" | "orders" | "reviews";

const NAV_ITEMS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "لوحة المعلومات", icon: LayoutDashboard },
  { id: "products", label: "المنتجات", icon: Package },
  { id: "categories", label: "الفئات", icon: Tags },
  { id: "orders", label: "الطلبات", icon: ShoppingBag },
  { id: "reviews", label: "المراجعات", icon: MessageSquare },
];

const TAB_TITLES: Record<Tab, { title: string; subtitle: string }> = {
  dashboard: { title: "لوحة المعلومات", subtitle: "نظرة عامة على أداء المتجر" },
  products: { title: "إدارة المنتجات", subtitle: "إضافة وتعديل وحذف منتجات المتجر" },
  categories: { title: "إدارة الفئات", subtitle: "تنظيم منتجاتك ضمن فئات" },
  orders: { title: "إدارة الطلبات", subtitle: "متابعة الطلبات وتحديث حالتها" },
  reviews: { title: "إدارة المراجعات", subtitle: "مراجعة ومراقبة تقييمات العملاء" },
};

function SidebarContent({
  activeTab,
  onNavigate,
  onGoStore,
}: {
  activeTab: Tab;
  onNavigate: (t: Tab) => void;
  onGoStore: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-rose-950 text-slate-100">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 shadow-lg shadow-rose-900/50">
          <Sparkles className="size-6 text-white" />
        </div>
        <div>
          <div className="text-lg font-bold leading-tight text-white">جلورية</div>
          <div className="text-xs text-rose-300">لوحة التحكم</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const active = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-white/10 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              {active && (
                <motion.span
                  layoutId="admin-active-bar"
                  className="absolute inset-y-1.5 right-0 w-1 rounded-full bg-rose-500"
                />
              )}
              <Icon
                className={cn(
                  "size-5 shrink-0",
                  active ? "text-rose-400" : "text-slate-400 group-hover:text-rose-300"
                )}
              />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="my-3 border-t border-white/10" />

        <button
          onClick={onGoStore}
          className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-white/5 hover:text-white"
        >
          <Store className="size-5 shrink-0 text-slate-400 group-hover:text-rose-300" />
          <span>العودة للمتجر</span>
        </button>
      </nav>

      {/* Admin user card */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
          <Avatar className="size-10 border-2 border-rose-500/50">
            <AvatarFallback className="bg-gradient-to-br from-rose-500 to-rose-700 text-sm font-bold text-white">
              م
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-white">مدير المتجر</div>
            <div className="truncate text-xs text-slate-400">admin@glamourie.sa</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminView() {
  const params = useSearchParams();
  const router = useRouter();
  const tabParam = (params.get("tab") as Tab) || "dashboard";
  const tab: Tab = NAV_ITEMS.some((n) => n.id === tabParam) ? tabParam : "dashboard";

  const [mobileOpen, setMobileOpen] = useState(false);

  const goTab = useCallback(
    (t: Tab) => {
      router.push(`?view=admin&tab=${t}`, { scroll: false });
      setMobileOpen(false);
    },
    [router]
  );

  const goStore = useCallback(() => {
    router.push("?view=home");
  }, [router]);

  const currentTitle = TAB_TITLES[tab];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50" dir="rtl">
      {/* Desktop sidebar */}
      <aside className="hidden w-[260px] shrink-0 lg:block">
        <SidebarContent activeTab={tab} onNavigate={goTab} onGoStore={goStore} />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-[280px] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>القائمة</SheetTitle>
          </SheetHeader>
          <SidebarContent activeTab={tab} onNavigate={goTab} onGoStore={goStore} />
        </SheetContent>
      </Sheet>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="فتح القائمة"
          >
            <Menu className="size-5" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-bold text-slate-900 sm:text-lg">
              {currentTitle.title}
            </h1>
            <p className="hidden truncate text-xs text-slate-500 sm:block">
              {currentTitle.subtitle}
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 md:flex">
            <Search className="size-4 text-slate-400" />
            <input
              placeholder="بحث سريع..."
              className="w-32 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 lg:w-48"
            />
          </div>

          <button
            className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="الإشعارات"
          >
            <Bell className="size-5" />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-rose-500" />
          </button>

          {tab !== "products" && tab !== "categories" && (
            <Button
              onClick={() => goTab("products")}
              className="hidden bg-rose-600 text-white hover:bg-rose-700 sm:flex"
            >
              <Plus className="size-4" />
              <span>إضافة منتج</span>
            </Button>
          )}
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="p-4 lg:p-6"
            >
              {tab === "dashboard" && <AdminDashboard />}
              {tab === "products" && <AdminProducts />}
              {tab === "categories" && <AdminCategories />}
              {tab === "orders" && <AdminOrders />}
              {tab === "reviews" && <AdminReviews />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

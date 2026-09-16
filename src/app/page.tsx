"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import HomeView from "@/components/views/HomeView";
import ShopView from "@/components/views/ShopView";
import ProductView from "@/components/views/ProductView";
import CartView from "@/components/views/CartView";
import CheckoutView from "@/components/views/CheckoutView";
import OrderSuccessView from "@/components/views/OrderSuccessView";

function PageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const view = params.get("view") ?? "home";

  // Scroll to top whenever the view changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [view, params.get("id"), params.get("category")]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <CartDrawer onCheckout={() => router.push("?view=checkout")} />
      <main className="flex-1">
        {view === "home" && <HomeView />}
        {view === "shop" && <ShopView />}
        {view === "product" && <ProductView />}
        {view === "cart" && <CartView />}
        {view === "checkout" && <CheckoutView />}
        {view === "order-success" && <OrderSuccessView />}
        {![
          "home",
          "shop",
          "product",
          "cart",
          "checkout",
          "order-success",
        ].includes(view) && <HomeView />}
      </main>
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        </div>
      }
    >
      <PageInner />
    </Suspense>
  );
}

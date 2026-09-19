"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import HomeView from "@/components/views/HomeView";
import ShopView from "@/components/views/ShopView";
import SearchView from "@/components/views/SearchView";
import ProductView from "@/components/views/ProductView";
import CartView from "@/components/views/CartView";
import CheckoutView from "@/components/views/CheckoutView";
import OrdersView from "@/components/views/OrdersView";
import OrderDetailView from "@/components/views/OrderDetailView";
import WishlistView from "@/components/views/WishlistView";
import OrderSuccessView from "@/components/views/OrderSuccessView";
import ServicesView from "@/components/views/ServicesView";
import ServiceView from "@/components/views/ServiceView";
import BookingView from "@/components/views/BookingView";
import BookingSuccessView from "@/components/views/BookingSuccessView";
import MyBookingsView from "@/components/views/MyBookingsView";
import AdminView from "@/components/views/AdminView";
import AuthView from "@/components/views/AuthView";

const KNOWN_VIEWS = [
  "home",
  "shop",
  "search",
  "product",
  "cart",
  "checkout",
  "orders",
  "order-detail",
  "wishlist",
  "order-success",
  "services",
  "service",
  "booking",
  "booking-success",
  "my-bookings",
  "admin",
  "auth",
];

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

  // Admin view renders alone (no public chrome — its own full-screen layout)
  if (view === "admin") {
    return <AdminView />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <CartDrawer onCheckout={() => router.push("?view=checkout")} />
      <main className="flex-1">
        {view === "home" && <HomeView />}
        {view === "shop" && <ShopView />}
        {view === "search" && <SearchView />}
        {view === "product" && <ProductView />}
        {view === "cart" && <CartView />}
        {view === "checkout" && <CheckoutView />}
        {view === "orders" && <OrdersView />}
        {view === "order-detail" && <OrderDetailView />}
        {view === "wishlist" && <WishlistView />}
        {view === "order-success" && <OrderSuccessView />}
        {view === "services" && <ServicesView />}
        {view === "service" && <ServiceView />}
        {view === "booking" && <BookingView />}
        {view === "booking-success" && <BookingSuccessView />}
        {view === "my-bookings" && <MyBookingsView />}
        {view === "auth" && <AuthView />}
        {!KNOWN_VIEWS.includes(view) && <HomeView />}
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

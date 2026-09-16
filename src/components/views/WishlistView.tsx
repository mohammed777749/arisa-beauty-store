"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StarRating from "@/components/StarRating";
import { useWishlist } from "@/store/wishlist";
import { useCart } from "@/store/cart";
import {
  formatPrice,
  CURRENCY,
  parseProduct,
  type Product,
} from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function WishlistView() {
  const items = useWishlist((s) => s.items);
  const remove = useWishlist((s) => s.remove);
  const hasHydrated = useWishlist((s) => s.hasHydrated);
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasHydrated || items.length === 0) {
      setProducts([]);
      return;
    }
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?limit=50`, { cache: "no-store" });
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.products ?? [];
        const filtered = items
          .map((id) => list.find((p: Product) => p.id === id))
          .filter(Boolean) as Product[];
        if (active) setProducts(filtered);
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [items, hasHydrated]);

  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
          <Link href="?view=home" className="hover:text-primary">
            الرئيسية
          </Link>
          <ChevronLeft className="size-3" />
          <span className="font-bold text-foreground">قائمة الأمنيات</span>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-extrabold text-foreground md:text-3xl">
              <Heart className="size-7 fill-primary text-primary" />
              قائمة الأمنيات
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {hasHydrated ? `${items.length} منتج محفوظ` : "جارٍ التحميل..."}
            </p>
          </div>
        </div>

        {!hasHydrated ? (
          <Skeleton className="h-64 w-full rounded-xl" />
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
            <Heart className="mb-3 size-12 text-muted-foreground" />
            <p className="text-lg font-bold text-foreground">قائمتك فارغة</p>
            <p className="mt-1 text-sm text-muted-foreground">
              ابدئي بإضافة منتجاتك المفضلة بالضغط على القلب
            </p>
            <Button
              asChild
              className="mt-5 rounded-md bg-cta-gold font-bold text-primary hover:brightness-105"
            >
              <Link href="?view=shop">اكتشفي المنتجات</Link>
            </Button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p, i) => {
              const parsed = parseProduct(p);
              const discount =
                parsed.oldPrice && parsed.oldPrice > p.price
                  ? Math.round(((parsed.oldPrice - p.price) / parsed.oldPrice) * 100)
                  : 0;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.3) }}
                  className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-amazon"
                >
                  <Link
                    href={`?view=product&id=${p.id}`}
                    className="group relative aspect-square overflow-hidden bg-muted"
                  >
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {discount > 0 && (
                      <span className="absolute right-2 top-2 rounded bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-white">
                        -{discount}%
                      </span>
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col gap-1.5 p-3">
                    <p className="text-[11px] font-bold text-gold">{p.brand}</p>
                    <Link
                      href={`?view=product&id=${p.id}`}
                      className="line-clamp-2 text-xs font-bold leading-snug text-foreground hover:text-primary"
                    >
                      {p.name}
                    </Link>
                    <StarRating rating={p.rating} size={12} showValue />
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-extrabold text-primary">
                        {formatPrice(p.price)}
                      </span>
                      <span className="text-[10px] font-bold text-primary">{CURRENCY}</span>
                      {parsed.oldPrice && (
                        <span className="text-[10px] text-muted-foreground line-through">
                          {formatPrice(parsed.oldPrice)}
                        </span>
                      )}
                    </div>
                    <div className="mt-auto flex items-center gap-1.5 pt-1.5">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          addItem({
                            productId: p.id,
                            name: p.name,
                            price: p.price,
                            image: p.image,
                            shade: parsed.shades?.[0] ?? null,
                          });
                          toast.success("تمت الإضافة إلى السلة", {
                            description: p.name,
                          });
                          openCart();
                        }}
                        className="flex-1 rounded-md bg-cta-gold text-xs font-bold text-primary hover:brightness-105"
                      >
                        <ShoppingCart className="size-3.5" />
                        أضيفي للسلة
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="size-8 shrink-0 rounded-md border-destructive/30 text-destructive hover:bg-destructive/5"
                        onClick={() => {
                          remove(p.id);
                          toast.info("تمت الإزالة من القائمة");
                        }}
                        aria-label="حذف"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

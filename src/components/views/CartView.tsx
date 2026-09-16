"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Tag,
  ShieldCheck,
  Truck,
  Heart,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/store/cart";
import {
  formatPrice,
  CURRENCY,
  getPromoDiscount,
  type Product,
} from "@/lib/types";
import { toast } from "sonner";
import RelatedCarousel from "@/components/RelatedCarousel";
import { motion, AnimatePresence } from "framer-motion";

const FREE_SHIPPING_THRESHOLD = 200;

export default function CartView() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const savedItems = useCart((s) => s.savedItems);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const clearCart = useCart((s) => s.clearCart);
  const saveForLater = useCart((s) => s.saveForLater);
  const moveToCart = useCart((s) => s.moveToCart);
  const removeSaved = useCart((s) => s.removeSaved);
  const hasHydrated = useCart((s) => s.hasHydrated);

  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [lastRemoved, setLastRemoved] = useState<
    | { item: ReturnType<typeof useCart.getState>["items"][number]; ts: number }
    | null
  >(null);

  const subtotal = useCart((s) => s.getTotalPrice());
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 25;
  const total = Math.max(0, subtotal - discount) + shipping;

  // Free shipping progress
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  // Recommendations
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/products?featured=true&limit=8", {
          cache: "no-store",
        });
        const data = await res.json();
        if (!active) return;
        setRecommendations(Array.isArray(data) ? data : data.products ?? []);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    const pct = getPromoDiscount(code);
    if (pct !== null) {
      setDiscount(Math.round(subtotal * pct));
      setAppliedCode(code);
      toast.success("تم تطبيق الكود بنجاح", {
        description: `خصم ${Math.round(pct * 100)}٪ على إجمالي السلة`,
      });
    } else {
      setDiscount(0);
      setAppliedCode(null);
      toast.error("كود الخصم غير صحيح");
    }
  };

  const handleRemove = (productId: string, shade?: string | null) => {
    const item = items.find((i) => i.productId === productId && (i.shade ?? null) === (shade ?? null));
    if (item) {
      setLastRemoved({ item, ts: Date.now() });
      removeItem(productId, shade);
      toast("تمت الإزالة من السلة", {
        action: {
          label: "تراجع",
          onClick: () => {
            useCart.getState().addItem(item);
            setLastRemoved(null);
          },
        },
      });
    }
  };

  if (!hasHydrated) {
    return <div className="container mx-auto max-w-7xl px-4 py-10" />;
  }

  if (items.length === 0) {
    return (
      <div className="bg-background">
        <div className="container mx-auto max-w-7xl px-4 py-10">
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-10 text-center shadow-amazon">
            <div className="grid size-20 place-items-center rounded-full bg-muted text-muted-foreground">
              <ShoppingBag className="size-9" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">سلتك فارغة</h1>
              <p className="mt-1 text-muted-foreground">
                لم تضيفي أي منتجات بعد. اكتشفي مجموعتنا الفاخرة وابدئي التسوق.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="rounded-md bg-cta-gold px-7 font-bold text-primary hover:brightness-105"
            >
              <Link href="?view=shop" className="flex items-center gap-2">
                ابدئي التسوق
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
          </div>

          {recommendations.length > 0 && (
            <div className="mt-10">
              <RelatedCarousel
                products={recommendations}
                title="منتجات ننصح بها"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
        {/* Header */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground md:text-3xl">
              سلة التسوق
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              لديك {items.length} منتج في السلة
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              clearCart();
              toast.info("تم تفريغ السلة");
            }}
            className="text-destructive hover:bg-destructive/5 hover:text-destructive"
          >
            <Trash2 className="size-4" />
            تفريغ السلة
          </Button>
        </div>

        {/* Free shipping progress */}
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          {remaining > 0 ? (
            <p className="text-sm font-bold text-emerald-800">
              أضيفي منتجات بقيمة{" "}
              <span className="text-primary">
                {formatPrice(remaining)} {CURRENCY}
              </span>{" "}
              للحصول على شحن مجاني! 🚚
            </p>
          ) : (
            <p className="text-sm font-bold text-emerald-700">
              🎉 مبروك! طلبك مؤهل للشحن المجاني
            </p>
          )}
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-emerald-100">
            <motion.div
              className="h-full rounded-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          {/* Items */}
          <div className="space-y-3">
            {items.map((it) => (
              <div
                key={`${it.productId}-${it.shade ?? ""}`}
                className="flex gap-3 rounded-xl border border-border bg-card p-3 shadow-amazon"
              >
                <Link
                  href={`?view=product&id=${it.productId}`}
                  className="relative size-24 shrink-0 overflow-hidden rounded-lg border bg-muted"
                >
                  <Image
                    src={it.image}
                    alt={it.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`?view=product&id=${it.productId}`}
                      className="line-clamp-2 text-sm font-bold leading-snug text-foreground hover:text-primary"
                    >
                      {it.name}
                    </Link>
                    <div className="text-end">
                      <p className="text-base font-extrabold text-primary">
                        {formatPrice(it.price * it.quantity)} {CURRENCY}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatPrice(it.price)} {CURRENCY} / قطعة
                      </p>
                    </div>
                  </div>
                  {it.shade && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      الظل: <span className="font-semibold">{it.shade}</span>
                    </p>
                  )}
                  <p className="mt-0.5 flex items-center gap-1 text-xs font-bold text-emerald-700">
                    <Check size={12} />
                    متوفر
                  </p>
                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
                    <div
                      className="inline-flex items-center rounded-md border bg-background"
                      dir="ltr"
                    >
                      <button
                        type="button"
                        className="grid size-8 place-items-center rounded-r-md text-muted-foreground transition hover:bg-muted"
                        onClick={() =>
                          updateQuantity(it.productId, it.quantity - 1, it.shade)
                        }
                        aria-label="إنقاص"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">
                        {it.quantity}
                      </span>
                      <button
                        type="button"
                        className="grid size-8 place-items-center rounded-l-md text-muted-foreground transition hover:bg-muted"
                        onClick={() =>
                          updateQuantity(it.productId, it.quantity + 1, it.shade)
                        }
                        aria-label="زيادة"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => saveForLater(it.productId, it.shade)}
                      className="flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold transition hover:bg-muted"
                    >
                      <Save className="size-3.5" />
                      حفظ لاحقاً
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(it.productId, it.shade)}
                      className="flex items-center gap-1 rounded-md border border-transparent px-2 py-1.5 text-xs font-semibold text-destructive transition hover:bg-destructive/5"
                    >
                      <Trash2 className="size-3.5" />
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <Button
              asChild
              variant="outline"
              className="mt-2 w-full rounded-md border-primary/40 font-bold text-primary hover:bg-primary/5"
            >
              <Link href="?view=shop" className="flex items-center justify-center gap-2">
                متابعة التسوق
                <ArrowLeft className="size-4" />
              </Link>
            </Button>

            {/* Save for later */}
            {savedItems.length > 0 && (
              <div className="mt-6">
                <h2 className="mb-3 text-lg font-extrabold">
                  حفظ لاحقاً ({savedItems.length})
                </h2>
                <div className="space-y-3">
                  {savedItems.map((it) => (
                    <div
                      key={`${it.productId}-${it.shade ?? ""}`}
                      className="flex gap-3 rounded-xl border border-border bg-muted/30 p-3"
                    >
                      <Link
                        href={`?view=product&id=${it.productId}`}
                        className="relative size-20 shrink-0 overflow-hidden rounded-lg border bg-muted"
                      >
                        <Image
                          src={it.image}
                          alt={it.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <Link
                          href={`?view=product&id=${it.productId}`}
                          className="line-clamp-2 text-sm font-bold hover:text-primary"
                        >
                          {it.name}
                        </Link>
                        {it.shade && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            الظل: {it.shade}
                          </p>
                        )}
                        <p className="mt-0.5 text-sm font-extrabold text-primary">
                          {formatPrice(it.price)} {CURRENCY}
                        </p>
                        <div className="mt-auto flex items-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => moveToCart(it.productId, it.shade)}
                            className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold transition hover:bg-muted"
                          >
                            نقل إلى السلة
                          </button>
                          <button
                            type="button"
                            onClick={() => removeSaved(it.productId, it.shade)}
                            className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-semibold text-destructive transition hover:bg-destructive/5"
                          >
                            <Trash2 className="size-3.5" />
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-xl border border-border bg-card p-5 shadow-amazon">
              <h3 className="mb-4 text-lg font-extrabold">
                المجموع الفرعي ({items.reduce((s, i) => s + i.quantity, 0)} قطعة):{" "}
                <span className="text-primary">{formatPrice(subtotal)} {CURRENCY}</span>
              </h3>

              {/* Promo */}
              <div className="mb-4">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                  <Tag className="size-3.5" />
                  كود الخصم
                </p>
                <div className="flex gap-2">
                  <Input
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    placeholder="مثال: GLAM25"
                    className="h-10 rounded-md bg-muted/50 uppercase"
                  />
                  <Button
                    type="button"
                    onClick={applyPromo}
                    className="h-10 shrink-0 rounded-md bg-primary px-4 font-bold shadow-rose"
                  >
                    تطبيق
                  </Button>
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  جرّبي: <span className="font-bold text-primary">GLAM25</span> أو{" "}
                  <span className="font-bold text-primary">WELCOME10</span>
                </p>
              </div>

              <Separator className="my-3" />

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span className="font-bold">
                    {formatPrice(subtotal)} {CURRENCY}
                  </span>
                </div>
                {discount > 0 && appliedCode && (
                  <div className="flex items-center justify-between text-emerald-700">
                    <span>الخصم ({appliedCode})</span>
                    <span className="font-bold">
                      - {formatPrice(discount)} {CURRENCY}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">الشحن</span>
                  <span className="font-bold">
                    {shipping === 0 ? (
                      <span className="text-emerald-700">مجاني</span>
                    ) : (
                      `${formatPrice(shipping)} ${CURRENCY}`
                    )}
                  </span>
                </div>
              </div>

              <Separator className="my-3" />

              <div className="flex items-center justify-between">
                <span className="font-extrabold">الإجمالي</span>
                <span className="text-2xl font-extrabold text-primary">
                  {formatPrice(total)} {CURRENCY}
                </span>
              </div>

              <Button
                size="lg"
                onClick={() => {
                  // Stash promo + discount for checkout to read
                  if (appliedCode) {
                    try {
                      sessionStorage.setItem(
                        "glamour-promo",
                        JSON.stringify({ code: appliedCode, discount })
                      );
                    } catch {
                      // ignore
                    }
                  } else {
                    try {
                      sessionStorage.removeItem("glamour-promo");
                    } catch {
                      // ignore
                    }
                  }
                  router.push("?view=checkout");
                }}
                className="mt-4 w-full rounded-md bg-cta-gold text-base font-bold text-primary shadow-amazon hover:brightness-105"
              >
                متابعة الدفع
                <ArrowLeft className="size-4" />
              </Button>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="flex items-center justify-center gap-1.5 rounded-md bg-muted/40 p-2 text-[11px] text-muted-foreground">
                  <ShieldCheck className="size-3.5 text-primary" />
                  دفع آمن
                </div>
                <div className="flex items-center justify-center gap-1.5 rounded-md bg-muted/40 p-2 text-[11px] text-muted-foreground">
                  <Truck className="size-3.5 text-primary" />
                  شحن سريع
                </div>
              </div>
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                احصلي على شحن مجاني مع{" "}
                <span className="font-bold text-emerald-700">توصيل سريع</span>
              </p>
            </div>
          </aside>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-10">
            <RelatedCarousel products={recommendations} title="منتجات ننصح بها" />
          </div>
        )}
      </div>
    </div>
  );
}

function Check({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

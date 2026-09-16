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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/store/cart";
import { formatPrice, CURRENCY } from "@/lib/types";
import { toast } from "sonner";

export default function CartView() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const clearCart = useCart((s) => s.clearCart);
  const hasHydrated = useCart((s) => s.hasHydrated);

  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);

  const subtotal = useCart((s) => s.getTotalPrice());
  const shipping = subtotal >= 200 || subtotal === 0 ? 0 : 25;
  const total = Math.max(0, subtotal - discount) + shipping;

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (code === "GLAM25") {
      setDiscount(Math.round(subtotal * 0.25));
      toast.success("تم تطبيق الكود بنجاح", {
        description: "خصم ٢٥٪ على إجمالي السلة",
      });
    } else if (code === "WELCOME10") {
      setDiscount(Math.round(subtotal * 0.1));
      toast.success("تم تطبيق الكود بنجاح", {
        description: "خصم ١٠٪ ترحيبي",
      });
    } else {
      setDiscount(0);
      toast.error("كود الخصم غير صحيح");
    }
  };

  if (!hasHydrated) {
    return <div className="container mx-auto max-w-7xl px-4 py-10" />;
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-20 text-center">
        <div className="grid size-24 place-items-center rounded-full bg-muted text-muted-foreground">
          <ShoppingBag className="size-10" />
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
          className="rounded-full bg-primary-gradient px-7 font-bold shadow-rose"
        >
          <Link href="?view=shop" className="flex items-center gap-2">
            ابدئي التسوق
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
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

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <div className="space-y-3">
          {items.map((it) => (
            <div
              key={`${it.productId}-${it.shade ?? ""}`}
              className="flex gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-soft"
            >
              <Link
                href={`?view=product&id=${it.productId}`}
                className="relative size-24 shrink-0 overflow-hidden rounded-xl border bg-muted"
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
                  <button
                    type="button"
                    onClick={() => removeItem(it.productId, it.shade)}
                    className="text-muted-foreground transition hover:text-destructive"
                    aria-label="حذف"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                {it.shade && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    الظل: <span className="font-semibold">{it.shade}</span>
                  </p>
                )}
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div
                    className="inline-flex items-center rounded-full border bg-background"
                    dir="ltr"
                  >
                    <button
                      type="button"
                      className="grid size-9 place-items-center rounded-r-full text-muted-foreground transition hover:bg-muted"
                      onClick={() =>
                        updateQuantity(it.productId, it.quantity - 1, it.shade)
                      }
                      aria-label="إنقاص"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold">
                      {it.quantity}
                    </span>
                    <button
                      type="button"
                      className="grid size-9 place-items-center rounded-l-full text-muted-foreground transition hover:bg-muted"
                      onClick={() =>
                        updateQuantity(it.productId, it.quantity + 1, it.shade)
                      }
                      aria-label="زيادة"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <div className="text-end">
                    <p className="text-base font-extrabold text-primary">
                      {formatPrice(it.price * it.quantity)} {CURRENCY}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(it.price)} {CURRENCY} / قطعة
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Button
            asChild
            variant="outline"
            className="mt-2 w-full rounded-full border-primary/40 font-bold text-primary hover:bg-primary/5"
          >
            <Link href="?view=shop" className="flex items-center justify-center gap-2">
              متابعة التسوق
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-40 lg:h-fit">
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
            <h3 className="mb-4 text-lg font-extrabold">ملخص الطلب</h3>

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
                  className="h-10 rounded-full bg-muted/50 uppercase"
                />
                <Button
                  type="button"
                  onClick={applyPromo}
                  className="h-10 shrink-0 rounded-full bg-primary-gradient px-4 font-bold shadow-rose"
                >
                  تطبيق
                </Button>
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                جرّبي: <span className="font-bold text-primary">GLAM25</span> أو{" "}
                <span className="font-bold text-primary">WELCOME10</span>
              </p>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">المجموع الفرعي</span>
                <span className="font-bold">
                  {formatPrice(subtotal)} {CURRENCY}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-green-700">
                  <span>الخصم</span>
                  <span className="font-bold">
                    - {formatPrice(discount)} {CURRENCY}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">الشحن</span>
                <span className="font-bold">
                  {shipping === 0 ? (
                    <span className="text-green-700">مجاني</span>
                  ) : (
                    `${formatPrice(shipping)} ${CURRENCY}`
                  )}
                </span>
              </div>
              {subtotal < 200 && subtotal > 0 && (
                <p className="rounded-lg bg-accent/60 p-2 text-[11px] text-accent-foreground">
                  أضيفي بقيمة {formatPrice(200 - subtotal)} {CURRENCY} للحصول على
                  شحن مجاني!
                </p>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <span className="font-extrabold">الإجمالي</span>
              <span className="text-2xl font-extrabold text-primary">
                {formatPrice(total)} {CURRENCY}
              </span>
            </div>

            <Button
              size="lg"
              onClick={() => router.push("?view=checkout")}
              className="mt-5 w-full rounded-full bg-primary-gradient text-base font-bold shadow-rose hover:scale-[1.02]"
            >
              متابعة الدفع
              <ArrowLeft className="size-4" />
            </Button>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="flex items-center justify-center gap-1.5 rounded-lg bg-muted/40 p-2 text-[11px] text-muted-foreground">
                <ShieldCheck className="size-3.5 text-primary" />
                دفع آمن
              </div>
              <div className="flex items-center justify-center gap-1.5 rounded-lg bg-muted/40 p-2 text-[11px] text-muted-foreground">
                <Truck className="size-3.5 text-primary" />
                شحن سريع
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

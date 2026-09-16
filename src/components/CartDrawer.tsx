"use client";

import { useCart } from "@/store/cart";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import {
  formatPrice,
  CURRENCY,
} from "@/lib/types";
import { useEffect } from "react";

type Props = {
  onCheckout?: () => void;
};

export default function CartDrawer({ onCheckout }: Props) {
  const items = useCart((s) => s.items);
  const isOpen = useCart((s) => s.isCartOpen);
  const closeCart = useCart((s) => s.closeCart);
  const removeItem = useCart((s) => s.removeItem);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const getTotalItems = useCart((s) => s.getTotalItems);
  const getTotalPrice = useCart((s) => s.getTotalPrice);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const subtotal = getTotalPrice();

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && closeCart()}>
      <SheetContent
        side="left"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b bg-primary-gradient p-5 text-primary-foreground">
          <SheetTitle className="flex items-center gap-2 text-lg font-extrabold text-white">
            <ShoppingBag className="size-5" />
            سلة التسوق
            <span className="rounded-full bg-white/25 px-2 py-0.5 text-xs">
              {getTotalItems()} منتج
            </span>
          </SheetTitle>
          <SheetDescription className="text-white/85">
            راجعي منتجاتك قبل إتمام الطلب
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="grid size-20 place-items-center rounded-full bg-muted text-muted-foreground">
              <ShoppingBag className="size-9" />
            </div>
            <div>
              <p className="text-lg font-bold">سلتك فارغة</p>
              <p className="mt-1 text-sm text-muted-foreground">
                أضيفي منتجات رائعة لتبدئي التسوق
              </p>
            </div>
            <Button asChild className="bg-primary-gradient shadow-rose">
              <Link
                href="?view=shop"
                onClick={closeCart}
                className="font-bold"
              >
                تصفحي المنتجات
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <ul className="divide-y">
                {items.map((it) => (
                  <li
                    key={`${it.productId}-${it.shade ?? ""}`}
                    className="flex gap-3 p-4"
                  >
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border bg-muted">
                      <Image
                        src={it.image}
                        alt={it.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="line-clamp-2 text-sm font-bold leading-snug">
                          {it.name}
                        </h4>
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
                        <p className="text-xs text-muted-foreground">
                          الظل: <span className="font-semibold">{it.shade}</span>
                        </p>
                      )}
                      <div className="mt-1 flex items-center justify-between">
                        <div
                          className="inline-flex items-center rounded-full border bg-background"
                          dir="ltr"
                        >
                          <button
                            type="button"
                            className="grid size-8 place-items-center rounded-r-full text-muted-foreground transition hover:bg-muted"
                            onClick={() =>
                              updateQuantity(
                                it.productId,
                                it.quantity - 1,
                                it.shade
                              )
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
                            className="grid size-8 place-items-center rounded-l-full text-muted-foreground transition hover:bg-muted"
                            onClick={() =>
                              updateQuantity(
                                it.productId,
                                it.quantity + 1,
                                it.shade
                              )
                            }
                            aria-label="زيادة"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <div className="text-sm font-extrabold text-primary">
                          {formatPrice(it.price * it.quantity)} {CURRENCY}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>

            <SheetFooter className="border-t bg-muted/30 p-5">
              <div className="mb-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span className="font-bold">
                    {formatPrice(subtotal)} {CURRENCY}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">الشحن</span>
                  <span className="font-bold text-green-600">يحسب عند الدفع</span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <span className="font-bold">الإجمالي</span>
                  <span className="text-xl font-extrabold text-primary">
                    {formatPrice(subtotal)} {CURRENCY}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-primary/40 font-bold text-primary hover:bg-primary/5"
                >
                  <Link href="?view=cart" onClick={closeCart}>
                    عرض السلة
                  </Link>
                </Button>
                <Button
                  className="rounded-full bg-primary-gradient font-bold shadow-rose"
                  onClick={() => {
                    closeCart();
                    onCheckout?.();
                  }}
                >
                  إتمام الشراء
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { toast } from "sonner";
import {
  formatPrice,
  CURRENCY,
  parseProduct,
  type Product,
} from "@/lib/types";

type Props = {
  products: Product[]; // 2-3 products
  className?: string;
};

export default function FrequentlyBoughtTogether({ products, className }: Props) {
  if (!products || products.length < 2) return null;
  const parsed = products.map(parseProduct);
  const totalPrice = parsed.reduce((s, p) => s + p.price, 0);

  const addAllToCart = () => {
    const addItem = useCart.getState().addItem;
    const openCart = useCart.getState().openCart;
    parsed.forEach((p) =>
      addItem({
        productId: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        shade: p.shades?.[0] ?? null,
      })
    );
    toast.success(`تمت إضافة ${parsed.length} منتجات إلى السلة`);
    openCart();
  };

  return (
    <section
      className={
        "rounded-xl border border-border bg-card p-5 shadow-amazon " +
        (className ?? "")
      }
    >
      <h2 className="mb-4 text-lg font-extrabold text-foreground">
        اشترِ معاً ووفّري
      </h2>
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Products with plus signs */}
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {parsed.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3">
              <Link
                href={`?view=product&id=${p.id}`}
                className="group flex w-32 flex-col gap-1"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="128px"
                    className="object-cover transition group-hover:scale-110"
                  />
                </div>
                <p className="line-clamp-2 text-[11px] font-bold leading-snug">
                  {p.name}
                </p>
                <p className="text-xs font-extrabold text-primary">
                  {formatPrice(p.price)} {CURRENCY}
                </p>
              </Link>
              {i < parsed.length - 1 && (
                <Plus className="size-5 shrink-0 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        {/* Total + CTA */}
        <div className="flex flex-col items-start gap-2 rounded-lg bg-muted/40 p-4 md:w-56">
          <p className="text-xs text-muted-foreground">السعر الإجمالي:</p>
          <p className="text-2xl font-extrabold text-primary">
            {formatPrice(totalPrice)} {CURRENCY}
          </p>
          <Button
            type="button"
            onClick={addAllToCart}
            className="w-full rounded-md bg-cta-gold text-sm font-bold text-primary shadow-amazon hover:brightness-105"
          >
            <ShoppingCart className="size-4" />
            أضيفي الكل إلى السلة
          </Button>
        </div>
      </div>
    </section>
  );
}

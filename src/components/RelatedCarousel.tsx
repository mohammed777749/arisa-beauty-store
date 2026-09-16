"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/StarRating";
import { useCart } from "@/store/cart";
import { toast } from "sonner";
import {
  formatPrice,
  CURRENCY,
  parseProduct,
  type Product,
} from "@/lib/types";

type Props = {
  products: Product[];
  title: string;
  className?: string;
};

export default function RelatedCarousel({ products, title, className }: Props) {
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);

  if (!products || products.length === 0) return null;

  const scroll = (dir: "next" | "prev") => {
    const el = document.getElementById(
      `related-scroller-${title.replace(/\s/g, "")}`
    );
    if (!el) return;
    el.scrollBy({ left: dir === "next" ? -280 : 280, behavior: "smooth" });
  };

  return (
    <section className={className}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-foreground md:text-xl">
          {title}
        </h2>
        <div className="hidden items-center gap-1 md:flex">
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-full"
            onClick={() => scroll("next")}
            aria-label="السابق"
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-full"
            onClick={() => scroll("prev")}
            aria-label="التالي"
          >
            <ChevronLeft className="size-4" />
          </Button>
        </div>
      </div>
      <div
        id={`related-scroller-${title.replace(/\s/g, "")}`}
        className="flex gap-3 overflow-x-auto pb-3 no-scrollbar"
      >
        {products.map((p, i) => {
          const parsed = parseProduct(p);
          const discount =
            parsed.oldPrice && parsed.oldPrice > parsed.price
              ? Math.round(((parsed.oldPrice - parsed.price) / parsed.oldPrice) * 100)
              : 0;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
              className="group w-48 shrink-0 md:w-52"
            >
              <Link
                href={`?view=product&id=${p.id}`}
                className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-amazon transition hover:-translate-y-0.5 hover:border-primary/40"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="200px"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {discount > 0 && (
                    <span className="absolute right-2 top-2 rounded bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-white">
                      -{discount}%
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-3">
                  <p className="line-clamp-2 text-xs font-bold leading-snug text-foreground">
                    {p.name}
                  </p>
                  <StarRating rating={p.rating} size={12} showValue />
                  <div className="mt-auto flex items-center justify-between pt-1.5">
                    <div>
                      <p className="text-sm font-extrabold text-primary">
                        {formatPrice(p.price)} {CURRENCY}
                      </p>
                      {parsed.oldPrice && parsed.oldPrice > p.price && (
                        <p className="text-[10px] text-muted-foreground line-through">
                          {formatPrice(parsed.oldPrice)} {CURRENCY}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addItem({
                          productId: p.id,
                          name: p.name,
                          price: p.price,
                          image: p.image,
                          shade: parsed.shades?.[0] ?? null,
                        });
                        toast.success("تمت الإضافة إلى السلة", { description: p.name });
                        openCart();
                      }}
                      className="grid size-8 place-items-center rounded-full bg-cta-gold text-primary shadow-amazon transition hover:brightness-105"
                      aria-label="أضف للسلة"
                    >
                      <ShoppingCart className="size-3.5" />
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

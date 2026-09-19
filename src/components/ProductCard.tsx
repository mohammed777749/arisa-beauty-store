"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Eye, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/StarRating";
import {
  formatPrice,
  CURRENCY,
  parseProduct,
  type Product,
} from "@/lib/types";
import { useCart } from "@/store/cart";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = {
  product: Product;
  index?: number;
  className?: string;
};

export default function ProductCard({ product, index = 0, className }: Props) {
  const p = parseProduct(product);
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);

  const discount =
    p.oldPrice && p.oldPrice > p.price
      ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
      : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      shade: p.shades?.[0] ?? null,
    });
    toast.success("تمت الإضافة إلى السلة", {
      description: p.name,
    });
    openCart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
      className={cn("group h-full", className)}
    >
      <Link
        href={`?view=product&id=${p.id}`}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-rose"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={p.image}
            alt={p.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Badges */}
          <div className="absolute right-3 top-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <Badge className="bg-destructive text-white shadow-sm">
                خصم {discount}%
              </Badge>
            )}
            {p.isNew && (
              <Badge className="bg-gold text-white shadow-sm">جديد</Badge>
            )}
            {p.isBestseller && (
              <Badge className="bg-primary text-primary-foreground shadow-sm">
                الأكثر مبيعاً
              </Badge>
            )}
          </div>

          {/* Wishlist */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast.info("أضيف إلى المفضلة");
            }}
            className="absolute left-3 top-3 grid size-9 place-items-center rounded-full bg-white/80 text-primary shadow-sm backdrop-blur transition hover:bg-white hover:text-primary"
            aria-label="إضافة للمفضلة"
          >
            <Heart className="size-4" />
          </button>

          {/* Quick view — أبيض دائماً مع نص داكن */}
          <div className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white py-2 text-xs font-bold text-slate-900 shadow-sm backdrop-blur">
              <Eye className="size-3.5" /> عرض سريع
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-gold">
              {p.brand}
            </span>
            <StarRating rating={p.rating} size={12} showValue reviewCount={p.reviewCount} />
          </div>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug text-foreground">
            {p.name}
          </h3>
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {p.description}
          </p>

          <div className="mt-auto flex items-end justify-between pt-2">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-primary">
                  {formatPrice(p.price)}
                </span>
                <span className="text-xs font-bold text-primary">{CURRENCY}</span>
              </div>
              {p.oldPrice && p.oldPrice > p.price && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(p.oldPrice)} {CURRENCY}
                </span>
              )}
            </div>
            <Button
              type="button"
              size="icon"
              onClick={handleAdd}
              className="size-10 rounded-full bg-primary-gradient shadow-rose hover:scale-105"
              aria-label="أضف للسلة"
            >
              <ShoppingCart className="size-4" />
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

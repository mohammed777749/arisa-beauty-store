"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Truck,
  ShieldCheck,
  RefreshCw,
  ChevronLeft,
  Check,
  Minus,
  Plus,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import StarRating from "@/components/StarRating";
import QuantitySelector from "@/components/QuantitySelector";
import ProductGrid from "@/components/ProductGrid";
import { useCart } from "@/store/cart";
import { toast } from "sonner";
import {
  formatPrice,
  CURRENCY,
  parseProduct,
  type Product,
} from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ProductView() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);
  const [shade, setShade] = useState<string | null>(null);

  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await fetch(`/api/products/${id}`, { cache: "no-store" });
        if (!res.ok) {
          if (active) setNotFound(true);
          return;
        }
        const data: Product = await res.json();
        if (!active) return;
        setProduct(data);
        const p = parseProduct(data);
        setShade(p.shades?.[0] ?? null);

        // Related: same category, different id
        const relRes = await fetch(
          `/api/products?category=${data.category?.slug ?? ""}&limit=5`,
          { cache: "no-store" }
        );
        const rels: Product[] = await relRes.json();
        if (active) setRelated(rels.filter((r) => r.id !== data.id).slice(0, 4));
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="container mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-20 text-center">
        <p className="text-2xl font-bold">المنتج غير موجود</p>
        <p className="text-muted-foreground">
          ربما تم حذف المنتج أو أن الرابط غير صحيح.
        </p>
        <Button asChild className="rounded-full bg-primary-gradient">
          <Link href="?view=shop">العودة للمتجر</Link>
        </Button>
      </div>
    );
  }

  const p = parseProduct(product);
  const discount =
    p.oldPrice && p.oldPrice > p.price
      ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
      : 0;

  const handleAdd = (buyNow = false) => {
    addItem({
      productId: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      quantity: qty,
      shade: shade,
    });
    if (buyNow) {
      router.push("?view=checkout");
    } else {
      toast.success("تمت الإضافة إلى السلة", { description: p.name });
      openCart();
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 md:py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-xs text-muted-foreground">
        <Link href="?view=home" className="hover:text-primary">
          الرئيسية
        </Link>
        <ChevronLeft className="size-3" />
        <Link
          href={`?view=shop&category=${p.category?.slug ?? ""}`}
          className="hover:text-primary"
        >
          {p.category?.name ?? "المتجر"}
        </Link>
        <ChevronLeft className="size-3" />
        <span className="line-clamp-1 text-foreground">{p.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative aspect-square overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft"
        >
          <Image
            src={p.image}
            alt={p.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          {discount > 0 && (
            <div className="absolute right-4 top-4">
              <Badge className="bg-destructive text-white shadow-sm">
                خصم {discount}%
              </Badge>
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col gap-5"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gold">
              <Sparkles className="size-3.5" />
              {p.brand}
            </span>
            <div className="flex items-center gap-2">
              <StarRating rating={p.rating} size={16} />
              <span className="text-xs text-muted-foreground">
                {p.rating.toFixed(1)} ({p.reviewCount} تقييم)
              </span>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold leading-tight text-foreground md:text-3xl">
            {p.name}
          </h1>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-primary">
              {formatPrice(p.price)} {CURRENCY}
            </span>
            {p.oldPrice && p.oldPrice > p.price && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(p.oldPrice)} {CURRENCY}
              </span>
            )}
            {discount > 0 && (
              <Badge className="bg-destructive/10 text-destructive">
                وفّري {formatPrice(p.oldPrice! - p.price)} {CURRENCY}
              </Badge>
            )}
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {p.description}
          </p>

          <Separator />

          {/* Shades */}
          {p.shades && p.shades.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-bold">
                الظل: <span className="text-primary">{shade}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {p.shades.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setShade(s)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-xs font-semibold transition",
                      shade === s
                        ? "border-primary bg-primary text-primary-foreground shadow-rose"
                        : "border-border bg-background hover:border-primary/40 hover:bg-accent"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + stock */}
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <p className="mb-2 text-sm font-bold">الكمية</p>
              <QuantitySelector value={qty} onChange={setQty} max={p.stock} />
            </div>
            <div className="flex items-center gap-2 text-sm">
              {p.stock > 0 ? (
                <>
                  <span className="grid size-5 place-items-center rounded-full bg-green-100 text-green-700">
                    <Check className="size-3" />
                  </span>
                  <span className="font-semibold text-green-700">متوفر</span>
                  <span className="text-muted-foreground">
                    ({p.stock} قطعة)
                  </span>
                </>
              ) : (
                <span className="font-semibold text-destructive">
                  غير متوفر حالياً
                </span>
              )}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              onClick={() => handleAdd(false)}
              className="flex-1 rounded-full bg-primary-gradient text-base font-bold shadow-rose hover:scale-[1.02]"
            >
              <ShoppingCart className="size-5" />
              أضيفي للسلة
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleAdd(true)}
              className="flex-1 rounded-full border-primary/40 text-base font-bold text-primary hover:bg-primary/5"
            >
              اشتري الآن
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-4"
              aria-label="المفضلة"
              onClick={() => toast.info("أضيف إلى المفضلة")}
            >
              <Heart className="size-5" />
            </Button>
          </div>

          {/* Perks */}
          <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border/60 bg-muted/40 p-4">
            {[
              { icon: Truck, label: "شحن سريع" },
              { icon: ShieldCheck, label: "أصلي ١٠٠٪" },
              { icon: RefreshCw, label: "إرجاع خلال ١٤ يوم" },
            ].map((perk) => (
              <div
                key={perk.label}
                className="flex flex-col items-center gap-1.5 text-center"
              >
                <perk.icon className="size-5 text-primary" />
                <span className="text-[11px] font-semibold text-muted-foreground">
                  {perk.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="bg-muted/60 p-1">
            <TabsTrigger value="description">الوصف</TabsTrigger>
            <TabsTrigger value="ingredients">المكونات</TabsTrigger>
            <TabsTrigger value="reviews">التقييمات</TabsTrigger>
            <TabsTrigger value="shipping">الشحن والإرجاع</TabsTrigger>
          </TabsList>
          <TabsContent
            value="description"
            className="mt-4 rounded-2xl border border-border/60 bg-card p-6 text-sm leading-relaxed text-muted-foreground"
          >
            <p className="mb-3 font-bold text-foreground">عن هذا المنتج</p>
            <p>{p.description}</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2">
                <Check className="size-4 text-primary" />
                <span>منتج أصلي ١٠٠٪ من ماركة {p.brand}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-primary" />
                <span>مناسب لجميع أنواع البشرة</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-primary" />
                <span>خالٍ من المواد الضارة والبارابين</span>
              </li>
            </ul>
          </TabsContent>
          <TabsContent
            value="ingredients"
            className="mt-4 rounded-2xl border border-border/60 bg-card p-6 text-sm leading-relaxed text-muted-foreground"
          >
            <p className="mb-3 font-bold text-foreground">المكونات الرئيسية</p>
            <ul className="list-inside list-disc space-y-1.5">
              <li>حمض الهيالورونيك لترطيب عميق</li>
              <li>فيتامين E و C لمضادات الأكسدة</li>
              <li>خلاصات طبيعية مهدئة للبشرة</li>
              <li>زيوت طبيعية مغذية (أرغان، جوجوبا)</li>
              <li>تركيبة خالية من البارابين والسلفات</li>
            </ul>
          </TabsContent>
          <TabsContent
            value="reviews"
            className="mt-4 rounded-2xl border border-border/60 bg-card p-6"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
              <div className="text-center">
                <p className="text-5xl font-extrabold text-primary">
                  {p.rating.toFixed(1)}
                </p>
                <StarRating rating={p.rating} size={20} className="mt-2 justify-center" />
                <p className="mt-1 text-xs text-muted-foreground">
                  {p.reviewCount} تقييم
                </p>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const pct =
                    star === 5
                      ? 78
                      : star === 4
                      ? 15
                      : star === 3
                      ? 5
                      : star === 2
                      ? 1
                      : 1;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="flex w-12 items-center gap-1 text-xs">
                        {star}
                        <Star className="size-3 fill-gold text-gold" />
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gold-gradient"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-10 text-left text-xs text-muted-foreground">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <Separator className="my-6" />
            <div className="space-y-4">
              {[
                {
                  name: "أمل القحطاني",
                  rating: 5,
                  date: "قبل ٣ أيام",
                  text: "منتج رائع، جودة ممتازة ونتيجة فورية. سأطلب مرة أخرى بالتأكيد!",
                },
                {
                  name: "هند الدوسري",
                  rating: 5,
                  date: "قبل أسبوع",
                  text: "أحببت التغليف الفاخر والرائحة. يفوق التوقعات.",
                },
                {
                  name: "لمى العنزي",
                  rating: 4,
                  date: "قبل أسبوعين",
                  text: "منتج جيد جداً، أنصح به. التوصيل كان سريعاً.",
                },
              ].map((r, i) => (
                <div key={i} className="rounded-xl bg-muted/40 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="grid size-9 place-items-center rounded-full bg-primary-gradient text-white">
                        {r.name.charAt(0)}
                      </span>
                      <div>
                        <p className="text-sm font-bold">{r.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {r.date}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={r.rating} size={14} />
                  </div>
                  <p className="text-sm text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent
            value="shipping"
            className="mt-4 rounded-2xl border border-border/60 bg-card p-6 text-sm leading-relaxed text-muted-foreground"
          >
            <p className="mb-3 font-bold text-foreground">سياسة الشحن</p>
            <p>
              نقوم بشحن جميع الطلبات خلال ٢٤ ساعة من تأكيدها. التوصيل داخل الرياض
              وخلال ٢-٤ أيام عمل لجميع مدن المملكة. الشحن مجاني للطلبات فوق ٢٠٠ ر.س.
            </p>
            <p className="mt-4 mb-3 font-bold text-foreground">الإرجاع والاستبدال</p>
            <p>
              يمكنك إرجاع أو استبدال المنتج خلال ١٤ يوماً من الاستلام بشرط أن يكون
              بحالته الأصلية وغير مستخدم. لطلب الإرجاع تواصلي مع خدمة العملاء.
            </p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-6 text-2xl font-extrabold text-foreground">
            منتجات ذات صلة
          </h2>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
}

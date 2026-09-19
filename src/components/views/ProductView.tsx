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
  Sparkles,
  Crown,
  Star,
  Minus,
  Plus,
  Lock,
  MapPin,
  Package,
  Store,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StarRating from "@/components/StarRating";
import ProductGallery from "@/components/ProductGallery";
import RelatedCarousel from "@/components/RelatedCarousel";
import FrequentlyBoughtTogether from "@/components/FrequentlyBoughtTogether";
import ReviewHistogram from "@/components/ReviewHistogram";
import ReviewItem from "@/components/ReviewItem";
import ReviewForm from "@/components/ReviewForm";
import RecentlyViewed from "@/components/RecentlyViewed";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useRecentlyViewed } from "@/store/recentlyViewed";
import { toast } from "sonner";
import {
  formatPrice,
  CURRENCY,
  parseProduct,
  type Product,
  type Review,
} from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ProductView() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");

  const [product, setProduct] = useState<(Product & { reviews?: Review[] }) | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [alsoBought, setAlsoBought] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);
  const [shade, setShade] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewFilter, setReviewFilter] = useState<number | null>(null);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);

  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);
  const toggleWishlist = useWishlist((s) => s.toggle);
  const inWishlist = useWishlist((s) => s.has(id ?? ""));
  const addRecentlyViewed = useRecentlyViewed((s) => s.add);

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
        const data = (await res.json()) as Product & { reviews?: Review[] };
        if (!active) return;
        setProduct(data);
        setReviews(data.reviews ?? []);
        const p = parseProduct(data);
        setShade(p.shades?.[0] ?? null);
        addRecentlyViewed(data.id);

        // Related: same category
        const relRes = await fetch(
          `/api/products?category=${data.category?.slug ?? ""}&limit=10`,
          { cache: "no-store" }
        );
        const relData = await relRes.json();
        const rels: Product[] = Array.isArray(relData)
          ? relData
          : relData.products ?? [];
        if (active) {
          const filtered = rels.filter((r) => r.id !== data.id);
          setRelated(filtered.slice(0, 8));
          setAlsoBought(filtered.slice(0, 3));
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id, addRecentlyViewed]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-[1fr_1fr_320px]">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-72 w-full rounded-xl" />
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
        <Button asChild className="rounded-md bg-cta-gold font-bold text-primary">
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
  const savings =
    p.oldPrice && p.oldPrice > p.price ? p.oldPrice - p.price : 0;

  const filteredReviews =
    reviewFilter !== null
      ? reviews.filter((r) => r.rating >= reviewFilter!)
      : reviews;

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

  const handleWishlist = () => {
    toggleWishlist(p.id);
    toast.success(inWishlist ? "تمت الإزالة من القائمة" : "أضيف إلى قائمة الأمنيات");
  };

  return (
    <div className="bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-amazon-divider bg-muted/30">
        <div className="container mx-auto flex max-w-7xl items-center gap-1 px-4 py-2 text-xs text-muted-foreground">
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
          <span className="line-clamp-1 font-bold text-foreground">{p.name}</span>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-5">
        {/* Top: gallery + info + buy box */}
        <div className="grid gap-5 md:grid-cols-[1fr_1.2fr_320px]">
          {/* Gallery */}
          <div>
            <ProductGallery
              images={p.images}
              alt={p.name}
              discount={discount}
            />
          </div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-3"
          >
            {/* Brand link */}
            <Link
              href={`?view=shop&brand=${encodeURIComponent(p.brand)}`}
              className="text-xs font-bold text-primary hover:underline"
            >
              العلامة التجارية: {p.brand}
            </Link>

            {/* Name */}
            <h1 className="text-xl font-extrabold leading-snug text-foreground md:text-2xl">
              {p.name}
            </h1>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {p.isChoice && (
                <Badge className="bg-primary text-primary-foreground">
                  <Crown className="size-3.5" />
                  اختيار أريسا
                </Badge>
              )}
              {p.isBestseller && (
                <Badge className="bg-amber-500 text-white">
                  <Sparkles className="size-3.5" />
                  الأكثر مبيعاً
                </Badge>
              )}
              {p.isNew && (
                <Badge variant="outline" className="border-primary text-primary">
                  جديد
                </Badge>
              )}
              {p.prime && (
                <Badge className="bg-emerald-500 text-white">
                  <Truck className="size-3.5" />
                  توصيل سريع
                </Badge>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 border-b border-amazon-divider pb-3">
              <StarRating rating={p.rating} size={16} />
              <span className="text-xs text-muted-foreground">
                {p.rating.toFixed(1)}
              </span>
              <a
                href="#reviews"
                className="text-xs font-bold text-primary hover:underline"
              >
                {p.reviewCount} تقييم
              </a>
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                {discount > 0 && (
                  <span className="text-3xl font-extrabold text-destructive">-{discount}%</span>
                )}
                <span className="text-3xl font-extrabold text-foreground">
                  {formatPrice(p.price)}
                </span>
                <span className="text-base font-bold text-foreground">{CURRENCY}</span>
              </div>
              {p.oldPrice && p.oldPrice > p.price && (
                <span className="text-sm text-muted-foreground">
                  السعر السابق:{" "}
                  <span className="line-through">
                    {formatPrice(p.oldPrice)} {CURRENCY}
                  </span>
                </span>
              )}
              {savings > 0 && (
                <p className="text-sm font-bold text-emerald-700">
                  وفّري {formatPrice(savings)} {CURRENCY} ({discount}%)
                </p>
              )}
            </div>

            {/* Stock + delivery */}
            <div className="flex flex-col gap-1 text-sm">
              {p.stock > 0 ? (
                <>
                  <span className="font-bold text-emerald-700">
                    متوفر — {p.stock <= 10 ? `تبقى ${p.stock} قطع فقط` : "جاهز للشحن"}
                  </span>
                  {p.prime && (
                    <span className="flex items-center gap-1 text-emerald-700">
                      <Truck className="size-4" />
                      توصيل سريع خلال ٢٤ ساعة للرياض
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="size-4" />
                    التوصيل إلى الرياض: غداً
                  </span>
                </>
              ) : (
                <span className="font-bold text-destructive">
                  غير متوفر حالياً
                </span>
              )}
            </div>

            {/* Shades */}
            {p.shades && p.shades.length > 0 && (
              <div className="border-t border-amazon-divider pt-3">
                <p className="mb-2 text-sm font-bold">
                  الظل: <span className="text-primary">{shade ?? "—"}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.shades.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setShade(s)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                        shade === s
                          ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                          : "border-border bg-background hover:border-primary/40"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {p.description}
            </p>

            {/* Perks */}
            <div className="grid grid-cols-3 gap-2 rounded-xl border border-border bg-muted/30 p-3">
              {[
                { icon: Truck, label: "شحن مجاني فوق ٢٠٠ ر.س" },
                { icon: RefreshCw, label: "إرجاع خلال ٣٠ يوماً" },
                { icon: ShieldCheck, label: "ضمان أصلي ١٠٠٪" },
              ].map((perk) => (
                <div
                  key={perk.label}
                  className="flex flex-col items-center gap-1 text-center"
                >
                  <perk.icon className="size-5 text-primary" />
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    {perk.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Buy box */}
          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="md:sticky md:top-28 md:h-fit"
          >
            <div className="rounded-xl border border-border bg-card p-4 shadow-amazon">
              <p className="text-2xl font-extrabold text-foreground">
                {formatPrice(p.price)}{" "}
                <span className="text-base font-bold">{CURRENCY}</span>
              </p>
              {p.oldPrice && p.oldPrice > p.price && (
                <p className="text-xs text-muted-foreground line-through">
                  {formatPrice(p.oldPrice)} {CURRENCY}
                </p>
              )}

              <p className="mt-2 text-sm font-bold text-emerald-700">
                {p.stock > 0 ? "متوفر" : "غير متوفر"}
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Truck className="size-3.5" />
                شحن مجاني للطلبات فوق ٢٠٠ ر.س
              </p>

              <Separator className="my-3" />

              {/* Quantity */}
              <div className="mb-3">
                <p className="mb-1.5 text-xs font-bold">الكمية</p>
                <Select value={String(qty)} onValueChange={(v) => setQty(Number(v))}>
                  <SelectTrigger className="h-10 w-24 rounded-md text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: Math.min(10, p.stock) }).map((_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* CTAs */}
              <Button
                type="button"
                size="lg"
                onClick={() => handleAdd(false)}
                disabled={p.stock === 0}
                className="w-full rounded-md bg-cta-gold text-sm font-bold text-primary shadow-amazon hover:brightness-105 disabled:opacity-50"
              >
                <ShoppingCart className="size-4" />
                أضيفي إلى السلة
              </Button>
              <Button
                type="button"
                size="lg"
                onClick={() => handleAdd(true)}
                disabled={p.stock === 0}
                className="mt-2 w-full rounded-md bg-cta-orange text-sm font-bold text-white shadow-amazon hover:brightness-105 disabled:opacity-50"
              >
                اشتري الآن
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleWishlist}
                className="mt-2 w-full rounded-md border-primary/40 text-sm font-bold text-primary hover:bg-primary/5"
              >
                <Heart className={cn("size-4", inWishlist && "fill-primary")} />
                {inWishlist ? "في قائمة الأمنيات" : "أضيفي إلى القائمة"}
              </Button>

              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Lock className="size-3.5 text-primary" />
                معاملة آمنة — الدفع مشفّر
              </div>

              <Separator className="my-3" />

              {/* Ships from / sold by */}
              <div className="space-y-1 text-xs">
                <p className="flex items-center justify-between">
                  <span className="text-muted-foreground">الشحن من</span>
                  <span className="font-bold">أريسا</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-muted-foreground">بائع</span>
                  <span className="font-bold">أريسا</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-muted-foreground">المرتجعات</span>
                  <span className="font-bold">قابلة للاسترجاع خلال ٣٠ يوماً</span>
                </p>
              </div>
            </div>

            {/* Mini security card */}
            <div className="mt-2 flex flex-col gap-1 rounded-xl border border-border bg-muted/30 p-3 text-[11px] text-muted-foreground">
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-primary" />
                ضمان استرجاع الأموال
              </p>
              <p className="flex items-center gap-1.5">
                <Package className="size-3.5 text-primary" />
                تغليف آمن ومحكم
              </p>
              <p className="flex items-center gap-1.5">
                <Store className="size-3.5 text-primary" />
                بائع موثوق معتمد
              </p>
            </div>
          </motion.aside>
        </div>

        {/* Frequently bought together */}
        {alsoBought.length >= 2 && (
          <div className="mt-8">
            <FrequentlyBoughtTogether products={alsoBought} />
          </div>
        )}

        {/* Customers who bought this also bought */}
        {related.length > 0 && (
          <div className="mt-10">
            <RelatedCarousel
              products={related}
              title="عملاء اشتروا هذا المنتج اشتروا أيضاً"
            />
          </div>
        )}

        {/* Tabs / sections */}
        <div className="mt-10">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="bg-muted/40">
              <TabsTrigger value="description">الوصف</TabsTrigger>
              <TabsTrigger value="ingredients">المكونات</TabsTrigger>
              <TabsTrigger value="info">معلومات إضافية</TabsTrigger>
              <TabsTrigger value="reviews">
                التقييمات ({p.reviewCount})
              </TabsTrigger>
              <TabsTrigger value="shipping">الشحن والإرجاع</TabsTrigger>
            </TabsList>

            <TabsContent
              value="description"
              className="rounded-xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground"
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
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-primary" />
                  <span>بلد المنشأ: {p.origin ?? "—"}</span>
                </li>
              </ul>
            </TabsContent>

            <TabsContent
              value="ingredients"
              className="rounded-xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground"
            >
              <p className="mb-3 font-bold text-foreground">المكونات</p>
              {p.ingredients ? (
                <p className="leading-relaxed">{p.ingredients}</p>
              ) : (
                <ul className="list-inside list-disc space-y-1.5">
                  <li>حمض الهيالورونيك لترطيب عميق</li>
                  <li>فيتامين E و C لمضادات الأكسدة</li>
                  <li>خلاصات طبيعية مهدئة للبشرة</li>
                  <li>زيوت طبيعية مغذية (أرغان، جوجوبا)</li>
                  <li>تركيبة خالية من البارابين والسلفات</li>
                </ul>
              )}
            </TabsContent>

            <TabsContent
              value="info"
              className="rounded-xl border border-border bg-card p-5"
            >
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-border/60">
                    <th className="py-2 px-3 text-right font-bold text-foreground">العلامة التجارية</th>
                    <td className="py-2 px-3 text-muted-foreground">{p.brand}</td>
                  </tr>
                  <tr className="border-b border-border/60">
                    <th className="py-2 px-3 text-right font-bold text-foreground">النوع</th>
                    <td className="py-2 px-3 text-muted-foreground">{p.category?.name ?? "—"}</td>
                  </tr>
                  <tr className="border-b border-border/60">
                    <th className="py-2 px-3 text-right font-bold text-foreground">الوزن / الحجم</th>
                    <td className="py-2 px-3 text-muted-foreground">{p.weight ?? "—"}</td>
                  </tr>
                  <tr className="border-b border-border/60">
                    <th className="py-2 px-3 text-right font-bold text-foreground">بلد المنشأ</th>
                    <td className="py-2 px-3 text-muted-foreground">{p.origin ?? "—"}</td>
                  </tr>
                  <tr className="border-b border-border/60">
                    <th className="py-2 px-3 text-right font-bold text-foreground">التوفر</th>
                    <td className="py-2 px-3 text-muted-foreground">
                      {p.stock > 0 ? `${p.stock} قطعة متوفرة` : "غير متوفر"}
                    </td>
                  </tr>
                  <tr>
                    <th className="py-2 px-3 text-right font-bold text-foreground">المنشأ</th>
                    <td className="py-2 px-3 text-muted-foreground">منتج أصلي ١٠٠٪</td>
                  </tr>
                </tbody>
              </table>
            </TabsContent>

            <TabsContent
              value="reviews"
              id="reviews"
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-extrabold">آراء العملاء</h3>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-md border-primary/40 text-primary hover:bg-primary/5"
                  onClick={() => setReviewFormOpen(true)}
                >
                  اكتبي تقيماً
                </Button>
              </div>
              <ReviewHistogram
                reviews={reviews}
                averageRating={p.rating}
                onStarClick={setReviewFilter}
                activeRating={reviewFilter}
              />
              <Separator className="my-5" />
              {reviewFilter !== null && (
                <p className="mb-3 text-xs text-muted-foreground">
                  عرض التقييمات {reviewFilter} نجوم فأكثر —{" "}
                  <button
                    type="button"
                    onClick={() => setReviewFilter(null)}
                    className="text-primary hover:underline"
                  >
                    عرض الكل
                  </button>
                </p>
              )}
              <div className="grid gap-3 md:grid-cols-2">
                {filteredReviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    لا توجد تقييمات مطابقة. كوني أول من يكتب تقيماً!
                  </p>
                ) : (
                  filteredReviews.slice(0, 6).map((r) => (
                    <ReviewItem key={r.id} review={r} />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="shipping"
              className="rounded-xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground"
            >
              <p className="mb-3 font-bold text-foreground">سياسة الشحن</p>
              <p>
                نقوم بشحن جميع الطلبات خلال ٢٤ ساعة من تأكيدها. التوصيل داخل
                الرياض وخلال ٢-٤ أيام عمل لجميع مدن المملكة. الشحن مجاني للطلبات
                فوق ٢٠٠ ر.س.
              </p>
              <p className="mt-4 mb-3 font-bold text-foreground">
                الإرجاع والاستبدال
              </p>
              <p>
                يمكنك إرجاع أو استبدال المنتج خلال ٣٠ يوماً من الاستلام بشرط أن
                يكون بحالته الأصلية وغير مستخدم. لطلب الإرجاع تواصلي مع خدمة
                العملاء.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Recently viewed */}
      <RecentlyViewed />

      {/* Review form dialog */}
      <ReviewForm
        productId={p.id}
        open={reviewFormOpen}
        onOpenChange={setReviewFormOpen}
        onCreated={(review) => {
          setReviews((prev) => [review, ...prev]);
        }}
      />
    </div>
  );
}

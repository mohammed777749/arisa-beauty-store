"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Wallet,
  ArrowLeft,
  Check,
  Lock,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/store/cart";
import { formatPrice, CURRENCY } from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PAYMENT_METHODS = [
  {
    value: "cod",
    label: "الدفع عند الاستلام",
    desc: "ادفعي نقداً عند وصول الطلب",
    icon: Banknote,
  },
  {
    value: "transfer",
    label: "تحويل بنكي",
    desc: "حوّلي المبلغ وأرسلي الإيصال",
    icon: Wallet,
  },
  {
    value: "card",
    label: "بطاقة ائتمانية",
    desc: "Visa, Mastercard, مدى",
    icon: CreditCard,
  },
];

export default function CheckoutView() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clearCart = useCart((s) => s.clearCart);
  const hasHydrated = useCart((s) => s.hasHydrated);
  const subtotal = useCart((s) => s.getTotalPrice());

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    city: "",
    address: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shipping = subtotal >= 200 ? 0 : 25;
  const total = subtotal + shipping;

  // Empty cart guard (after hydration)
  if (hasHydrated && items.length === 0) {
    return (
      <div className="container mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-20 text-center">
        <div className="grid size-24 place-items-center rounded-full bg-muted text-muted-foreground">
          <ShoppingBag className="size-10" />
        </div>
        <h1 className="text-2xl font-extrabold">لا يمكن إتمام الطلب</h1>
        <p className="text-muted-foreground">سلتك فارغة. ابدئي التسوق أولاً.</p>
        <Button
          asChild
          className="rounded-full bg-primary-gradient px-7 font-bold shadow-rose"
        >
          <Link href="?view=shop">تصفحي المنتجات</Link>
        </Button>
      </div>
    );
  }

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.customerName.trim().length < 2) e.customerName = "الاسم مطلوب";
    if (form.customerPhone.trim().length < 8)
      e.customerPhone = "رقم جوال صحيح مطلوب";
    if (form.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail))
      e.customerEmail = "بريد إلكتروني غير صحيح";
    if (form.city.trim().length < 2) e.city = "المدينة مطلوبة";
    if (form.address.trim().length < 5) e.address = "العنوان مطلوب";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      toast.error("يرجى تعبئة الحقول المطلوبة بشكل صحيح");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          customerEmail: form.customerEmail || null,
          notes: form.notes || null,
          paymentMethod,
          items: items.map((it) => ({
            productId: it.productId,
            name: it.name,
            price: it.price,
            image: it.image,
            quantity: it.quantity,
            shade: it.shade ?? null,
          })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "فشل إنشاء الطلب");
      }
      const order = await res.json();
      clearCart();
      toast.success("تم تأكيد طلبك بنجاح!");
      router.push(`?view=order-success&orderId=${order.id}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "حدث خطأ غير متوقع";
      toast.error("تعذّر إتمام الطلب", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-rose-gradient">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="mb-8">
          <Button
            asChild
            variant="ghost"
            className="mb-2 rounded-full px-2 text-muted-foreground hover:bg-transparent hover:text-primary"
          >
            <Link href="?view=cart" className="flex items-center gap-1.5">
              <ArrowLeft className="size-4 rotate-180" />
              العودة للسلة
            </Link>
          </Button>
          <h1 className="text-2xl font-extrabold text-foreground md:text-3xl">
            إتمام الطلب
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            أكملي بياناتك لتأكيد طلبك وسنقوم بشحنه في أسرع وقت
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[1fr_400px]"
        >
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Customer info */}
            <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold">
                <span className="grid size-7 place-items-center rounded-full bg-primary-gradient text-xs font-bold text-white">
                  ١
                </span>
                معلومات التواصل
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="customerName">
                    الاسم الكامل <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="customerName"
                    value={form.customerName}
                    onChange={(e) => set("customerName", e.target.value)}
                    placeholder="مثال: نورة العتيبي"
                    className="mt-1.5 h-11 rounded-xl"
                  />
                  {errors.customerName && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.customerName}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="customerPhone">
                    رقم الجوال <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    dir="ltr"
                    value={form.customerPhone}
                    onChange={(e) => set("customerPhone", e.target.value)}
                    placeholder="05xxxxxxxx"
                    className="mt-1.5 h-11 rounded-xl text-right"
                  />
                  {errors.customerPhone && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.customerPhone}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="customerEmail">البريد الإلكتروني</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    dir="ltr"
                    value={form.customerEmail}
                    onChange={(e) => set("customerEmail", e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1.5 h-11 rounded-xl text-right"
                  />
                  {errors.customerEmail && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.customerEmail}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Shipping */}
            <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold">
                <span className="grid size-7 place-items-center rounded-full bg-primary-gradient text-xs font-bold text-white">
                  ٢
                </span>
                عنوان التوصيل
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="city">
                    المدينة <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    placeholder="مثال: الرياض"
                    className="mt-1.5 h-11 rounded-xl"
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.city}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address">
                    العنوان التفصيلي <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="address"
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                    placeholder="الحي، الشارع، رقم المبنى"
                    className="mt-1.5 h-11 rounded-xl"
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.address}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="notes">ملاحظات إضافية (اختياري)</Label>
                  <Textarea
                    id="notes"
                    value={form.notes}
                    onChange={(e) => set("notes", e.target.value)}
                    placeholder="أي تفاصيل تساعدنا في توصيل طلبك بشكل أفضل"
                    className="mt-1.5 min-h-20 rounded-xl"
                  />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold">
                <span className="grid size-7 place-items-center rounded-full bg-primary-gradient text-xs font-bold text-white">
                  ٣
                </span>
                طريقة الدفع
              </h2>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="grid gap-2"
              >
                {PAYMENT_METHODS.map((m) => (
                  <Label
                    key={m.value}
                    htmlFor={m.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition",
                      paymentMethod === m.value
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border hover:bg-muted/40"
                    )}
                  >
                    <RadioGroupItem
                      value={m.value}
                      id={m.value}
                      className="data-[state=checked]:border-primary"
                    />
                    <m.icon
                      className={cn(
                        "size-5",
                        paymentMethod === m.value
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-bold">{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
                <Lock className="size-4 text-primary" />
                جميع معاملاتك مشفّرة وآمنة. لا نشارك بياناتك مع أي طرف ثالث.
              </div>
            </section>
          </motion.div>

          {/* Summary sidebar */}
          <aside className="lg:sticky lg:top-40 lg:h-fit">
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
              <h3 className="mb-4 text-lg font-extrabold">ملخص الطلب</h3>

              <ul className="max-h-72 space-y-3 overflow-y-auto pe-1">
                {items.map((it) => (
                  <li
                    key={`${it.productId}-${it.shade ?? ""}`}
                    className="flex gap-3"
                  >
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border bg-muted">
                      <Image
                        src={it.image}
                        alt={it.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                      <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {it.quantity}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <p className="line-clamp-1 text-xs font-bold">
                        {it.name}
                      </p>
                      {it.shade && (
                        <p className="text-[11px] text-muted-foreground">
                          الظل: {it.shade}
                        </p>
                      )}
                      <p className="text-xs font-bold text-primary">
                        {formatPrice(it.price * it.quantity)} {CURRENCY}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span className="font-bold">
                    {formatPrice(subtotal)} {CURRENCY}
                  </span>
                </div>
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
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <span className="font-extrabold">الإجمالي</span>
                <span className="text-2xl font-extrabold text-primary">
                  {formatPrice(total)} {CURRENCY}
                </span>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="mt-5 w-full rounded-full bg-primary-gradient text-base font-bold shadow-rose hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    جارٍ تأكيد الطلب...
                  </>
                ) : (
                  <>
                    <Check className="size-5" />
                    تأكيد الطلب
                  </>
                )}
              </Button>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { icon: ShieldCheck, label: "آمن" },
                  { icon: Truck, label: "شحن سريع" },
                  { icon: Lock, label: "مشفّر" },
                ].map((b) => (
                  <div
                    key={b.label}
                    className="flex flex-col items-center gap-1 rounded-lg bg-muted/40 p-2 text-[11px] text-muted-foreground"
                  >
                    <b.icon className="size-3.5 text-primary" />
                    {b.label}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
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
  ArrowRight,
  Check,
  Lock,
  ShoppingBag,
  Plus,
  MapPin,
  Tag,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/store/cart";
import { useAddresses } from "@/store/addresses";
import { usePayments } from "@/store/payments";
import { useCustomerAuth } from "@/store/customer-auth";
import {
  formatPrice,
  CURRENCY,
  getPromoDiscount,
} from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Stepper from "@/components/Stepper";
import AddressCard, { AddressCardWithActions } from "@/components/AddressCard";
import AddressForm from "@/components/AddressForm";
import CardForm from "@/components/CardForm";

const FREE_SHIPPING_THRESHOLD = 200;
const TAX_RATE = 0.15;

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

const STEPS = [
  { label: "العنوان", description: "عنوان الشحن" },
  { label: "الدفع", description: "طريقة الدفع" },
  { label: "المراجعة", description: "تأكيد الطلب" },
];

export default function CheckoutView() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clearCart = useCart((s) => s.clearCart);
  const hasHydrated = useCart((s) => s.hasHydrated);
  const subtotal = useCart((s) => s.getTotalPrice());

  const addresses = useAddresses((s) => s.addresses);
  const addAddress = useAddresses((s) => s.addAddress);
  const defaultAddr = useAddresses((s) => s.getDefault());

  const cards = usePayments((s) => s.cards);
  const addCard = usePayments((s) => s.addCard);

  const customer = useCustomerAuth((s) => s.current);

  const [step, setStep] = useState(1);
  const [selectedAddrId, setSelectedAddrId] = useState<string>("");
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const [showCardForm, setShowCardForm] = useState(false);
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Promo from cart page
  useEffect(() => {
    if (!hasHydrated) return;
    try {
      const stored = sessionStorage.getItem("glamour-promo");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.code && parsed?.discount) {
          setPromo(parsed.code);
          setPromoApplied(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, [hasHydrated]);

  // Pre-select default address / card
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddrId) {
      const def = addresses.find((a) => a.isDefault) ?? addresses[0];
      setSelectedAddrId(def.id);
    }
  }, [addresses, selectedAddrId]);

  useEffect(() => {
    if (cards.length > 0 && !selectedCardId) {
      const def = cards.find((c) => c.isDefault) ?? cards[0];
      setSelectedCardId(def.id);
    }
  }, [cards, selectedCardId]);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 25;
  const discount = promoApplied?.discount ?? 0;
  const taxBase = Math.max(0, subtotal - discount);
  const tax = Math.round(taxBase * TAX_RATE);
  const total = taxBase + shipping + tax;

  const selectedAddress = addresses.find((a) => a.id === selectedAddrId);
  const selectedCard = cards.find((c) => c.id === selectedCardId);

  // Empty cart guard
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
          className="rounded-md bg-cta-gold px-7 font-bold text-primary hover:brightness-105"
        >
          <Link href="?view=shop">تصفحي المنتجات</Link>
        </Button>
      </div>
    );
  }

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    const pct = getPromoDiscount(code);
    if (pct !== null) {
      const d = Math.round(subtotal * pct);
      setPromoApplied({ code, discount: d });
      toast.success("تم تطبيق الكود", { description: `خصم ${Math.round(pct * 100)}٪` });
    } else {
      setPromoApplied(null);
      toast.error("كود الخصم غير صحيح");
    }
  };

  const handleStep1Next = () => {
    if (!selectedAddress) {
      toast.error("اختاري عنواناً أو أضيفي عنواناً جديداً");
      return;
    }
    setStep(2);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStep2Next = () => {
    if (paymentMethod === "card" && !selectedCard) {
      toast.error("اختاري بطاقة أو أضيفي بطاقة جديدة");
      return;
    }
    setStep(3);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("العنوان مطلوب");
      setStep(1);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        address: {
          customerName: selectedAddress.name,
          customerPhone: selectedAddress.phone,
          customerEmail: customer?.email ?? "",
          city: selectedAddress.city,
          address: `${selectedAddress.district} - ${selectedAddress.details}${
            selectedAddress.landmark ? ` (${selectedAddress.landmark})` : ""
          }`,
          notes: selectedAddress.notes ?? null,
        },
        paymentMethod,
        subtotal,
        shipping,
        discount,
        tax,
        total,
        promoCode: promoApplied?.code ?? null,
        items: items.map((it) => ({
          productId: it.productId,
          name: it.name,
          price: it.price,
          image: it.image,
          quantity: it.quantity,
          shade: it.shade ?? null,
        })),
      };
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "فشل إنشاء الطلب");
      }
      const order = await res.json();
      clearCart();
      try {
        sessionStorage.removeItem("glamour-promo");
      } catch {
        // ignore
      }
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
    <div className="bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
        {/* Back + title */}
        <div className="mb-5">
          <Button
            asChild
            variant="ghost"
            className="mb-2 rounded-md px-2 text-muted-foreground hover:bg-transparent hover:text-primary"
          >
            <Link href="?view=cart" className="flex items-center gap-1.5">
              <ArrowRight className="size-4" />
              العودة للسلة
            </Link>
          </Button>
          <h1 className="text-2xl font-extrabold text-foreground md:text-3xl">
            إتمام الطلب
          </h1>
        </div>

        {/* Stepper */}
        <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-amazon">
          <Stepper steps={STEPS} current={step} />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          {/* Steps */}
          <div className="space-y-5">
            {/* Step 1: Address */}
            {step === 1 && (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border border-border bg-card p-5 shadow-amazon"
              >
                <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold">
                  <span className="grid size-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    ١
                  </span>
                  عنوان الشحن
                </h2>

                {/* Saved addresses */}
                {addresses.length > 0 && (
                  <div className="mb-4 grid gap-3 sm:grid-cols-2">
                    {addresses.map((a) => (
                      <AddressCard
                        key={a.id}
                        address={a}
                        selected={selectedAddrId === a.id}
                        onSelect={() => setSelectedAddrId(a.id)}
                      />
                    ))}
                  </div>
                )}

                {/* Add new address */}
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => setShowAddrForm((v) => !v)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 p-3 text-sm font-bold text-primary transition hover:bg-primary/10"
                  >
                    <Plus className="size-4" />
                    {addresses.length === 0
                      ? "أضيفي عنواناً جديداً"
                      : showAddrForm
                      ? "إلغاء"
                      : "استخدام عنوان جديد"}
                  </button>
                  {showAddrForm && (
                    <div className="mt-3 rounded-xl border border-border bg-muted/20 p-4">
                      <AddressForm
                        onSubmit={(data) => {
                          const created = addAddress(data);
                          setSelectedAddrId(created.id);
                          setShowAddrForm(false);
                          toast.success("تم حفظ العنوان");
                        }}
                        onCancel={() => setShowAddrForm(false)}
                        submitLabel="حفظ ومتابعة"
                      />
                    </div>
                  )}
                </div>

                {addresses.length === 0 && !showAddrForm && (
                  <p className="rounded-md bg-muted/40 p-3 text-center text-sm text-muted-foreground">
                    لا توجد عناوين محفوظة. أضيفي عنواناً جديداً للمتابعة.
                  </p>
                )}

                <div className="mt-5 flex justify-end">
                  <Button
                    type="button"
                    onClick={handleStep1Next}
                    disabled={!selectedAddress}
                    className="rounded-md bg-cta-gold px-6 font-bold text-primary hover:brightness-105 disabled:opacity-50"
                  >
                    متابعة إلى الدفع
                    <ArrowLeft className="size-4" />
                  </Button>
                </div>
              </motion.section>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border border-border bg-card p-5 shadow-amazon"
              >
                <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold">
                  <span className="grid size-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    ٢
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

                {/* Saved cards */}
                {paymentMethod === "card" && (
                  <div className="mt-4">
                    {cards.length > 0 && (
                      <div className="mb-3 grid gap-2">
                        {cards.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setSelectedCardId(c.id)}
                            className={cn(
                              "flex items-center gap-3 rounded-xl border-2 p-3 text-right transition",
                              selectedCardId === c.id
                                ? "border-primary ring-2 ring-primary/20"
                                : "border-border hover:border-primary/40"
                            )}
                          >
                            <span className="rounded-md bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
                              {c.brand === "visa"
                                ? "VISA"
                                : c.brand === "mastercard"
                                ? "MC"
                                : c.brand === "mada"
                                ? "مدى"
                                : "AMEX"}
                            </span>
                            <div className="flex-1">
                              <p className="text-sm font-bold" dir="ltr">
                                •••• {c.last4}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                {c.name} — {c.expiry}
                              </p>
                            </div>
                            {c.isDefault && (
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                                افتراضي
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowCardForm((v) => !v)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 p-3 text-sm font-bold text-primary transition hover:bg-primary/10"
                    >
                      <Plus className="size-4" />
                      {cards.length === 0
                        ? "أضيفي بطاقة جديدة"
                        : showCardForm
                        ? "إلغاء"
                        : "إضافة بطاقة جديدة"}
                    </button>
                    {showCardForm && (
                      <div className="mt-3 rounded-xl border border-border bg-muted/20 p-4">
                        <CardForm
                          onSubmit={(data) => {
                            const created = addCard(data);
                            setSelectedCardId(created.id);
                            setShowCardForm(false);
                            toast.success("تم حفظ البطاقة");
                          }}
                          onCancel={() => setShowCardForm(false)}
                          submitLabel="حفظ البطاقة"
                        />
                      </div>
                    )}
                  </div>
                )}

                {paymentMethod === "transfer" && (
                  <div className="mt-4 rounded-xl bg-muted/30 p-4 text-sm text-muted-foreground">
                    <p className="font-bold text-foreground">تفاصيل التحويل:</p>
                    <p>البنك الأهلي السعودي — حساب رقم 1234567890</p>
                    <p>اسم الحساب: متجر جلورية للتجميل</p>
                    <p className="mt-1 text-xs">
                      يرجى إرسال إيصال التحويل على واتساب خدمة العملاء لتأكيد الطلب.
                    </p>
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <div className="mt-4 rounded-xl bg-muted/30 p-4 text-sm text-muted-foreground">
                    <p>
                      ادفعي نقداً عند استلام طلبك. رسوم خدمة بسيطة (٥ ر.س) تُضاف
                      عند الاستلام.
                    </p>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2 rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
                  <Lock className="size-4 text-primary" />
                  جميع معاملاتك مشفّرة وآمنة. لا نشارك بياناتك مع أي طرف ثالث.
                </div>

                <div className="mt-5 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="rounded-md"
                  >
                    <ArrowRight className="size-4" />
                    السابق
                  </Button>
                  <Button
                    type="button"
                    onClick={handleStep2Next}
                    disabled={paymentMethod === "card" && !selectedCard}
                    className="rounded-md bg-cta-gold px-6 font-bold text-primary hover:brightness-105 disabled:opacity-50"
                  >
                    متابعة للمراجعة
                    <ArrowLeft className="size-4" />
                  </Button>
                </div>
              </motion.section>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Review address + payment */}
                <div className="rounded-xl border border-border bg-card p-5 shadow-amazon">
                  <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold">
                    <span className="grid size-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      ٣
                    </span>
                    مراجعة الطلب
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-border bg-muted/30 p-3">
                      <p className="mb-1 flex items-center gap-1 text-xs font-bold text-muted-foreground">
                        <MapPin className="size-3.5" /> عنوان الشحن
                      </p>
                      {selectedAddress ? (
                        <div className="text-sm">
                          <p className="font-bold">{selectedAddress.name}</p>
                          <p className="text-xs text-muted-foreground" dir="ltr">
                            {selectedAddress.phone}
                          </p>
                          <p className="mt-1 text-xs">
                            {selectedAddress.city} - {selectedAddress.district} -{" "}
                            {selectedAddress.details}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-destructive">لم يتم اختيار عنوان</p>
                      )}
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="mt-2 text-[11px] text-primary hover:underline"
                      >
                        تعديل
                      </button>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/30 p-3">
                      <p className="mb-1 flex items-center gap-1 text-xs font-bold text-muted-foreground">
                        <CreditCard className="size-3.5" /> طريقة الدفع
                      </p>
                      <div className="text-sm">
                        <p className="font-bold">
                          {PAYMENT_METHODS.find((m) => m.value === paymentMethod)?.label}
                        </p>
                        {paymentMethod === "card" && selectedCard && (
                          <p className="text-xs text-muted-foreground" dir="ltr">
                            •••• {selectedCard.last4} — {selectedCard.expiry}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="mt-2 text-[11px] text-primary hover:underline"
                      >
                        تعديل
                      </button>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="rounded-xl border border-border bg-card p-5 shadow-amazon">
                  <h3 className="mb-3 text-base font-extrabold">المنتجات</h3>
                  <ul className="divide-y">
                    {items.map((it) => (
                      <li
                        key={`${it.productId}-${it.shade ?? ""}`}
                        className="flex items-center gap-3 py-3"
                      >
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-md border bg-muted">
                          <Image
                            src={it.image}
                            alt={it.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="line-clamp-1 text-sm font-bold">{it.name}</p>
                          {it.shade && (
                            <p className="text-[11px] text-muted-foreground">
                              الظل: {it.shade}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            الكمية: {it.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-extrabold text-primary">
                          {formatPrice(it.price * it.quantity)} {CURRENCY}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="rounded-md"
                  >
                    <ArrowRight className="size-4" />
                    السابق
                  </Button>
                  <Button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="rounded-md bg-cta-orange px-6 text-base font-bold text-white hover:brightness-105"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        جارٍ تأكيد الطلب...
                      </>
                    ) : (
                      <>
                        <Check className="size-5" />
                        تأكيد الطلب
                      </>
                    )}
                  </Button>
                </div>
              </motion.section>
            )}
          </div>

          {/* Order summary sidebar (persistent) */}
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-xl border border-border bg-card p-5 shadow-amazon">
              <h3 className="mb-4 text-lg font-extrabold">ملخص الطلب</h3>
              <ul className="max-h-60 space-y-2 overflow-y-auto pe-1">
                {items.map((it) => (
                  <li
                    key={`${it.productId}-${it.shade ?? ""}`}
                    className="flex gap-2"
                  >
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-md border bg-muted">
                      <Image
                        src={it.image}
                        alt={it.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                      <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {it.quantity}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <p className="line-clamp-1 text-xs font-bold">{it.name}</p>
                      <p className="text-xs font-bold text-primary">
                        {formatPrice(it.price * it.quantity)} {CURRENCY}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <Separator className="my-4" />

              {/* Promo in sidebar */}
              <div className="mb-3">
                <p className="mb-1.5 flex items-center gap-1 text-xs font-bold text-muted-foreground">
                  <Tag className="size-3.5" /> كود الخصم
                </p>
                <div className="flex gap-2">
                  <Input
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    placeholder="GLAM25"
                    className="h-9 rounded-md bg-muted/50 text-xs uppercase"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={applyPromo}
                    className="h-9 shrink-0 rounded-md bg-primary px-3 text-xs font-bold"
                  >
                    تطبيق
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span className="font-bold">
                    {formatPrice(subtotal)} {CURRENCY}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-700">
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
                      <span className="text-emerald-700">مجاني</span>
                    ) : (
                      `${formatPrice(shipping)} ${CURRENCY}`
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">ضريبة القيمة المضافة (١٥٪)</span>
                  <span className="font-bold">
                    {formatPrice(tax)} {CURRENCY}
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

              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { icon: ShieldCheck, label: "آمن" },
                  { icon: Truck, label: "شحن سريع" },
                  { icon: Lock, label: "مشفّر" },
                ].map((b) => (
                  <div
                    key={b.label}
                    className="flex flex-col items-center gap-1 rounded-md bg-muted/40 p-2 text-[11px] text-muted-foreground"
                  >
                    <b.icon className="size-3.5 text-primary" />
                    {b.label}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

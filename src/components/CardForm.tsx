"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CreditCard, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { detectBrand, type Card, type CardBrand } from "@/store/payments";

type Props = {
  initial?: Partial<Card>;
  onSubmit: (data: {
    brand: CardBrand;
    last4: string;
    name: string;
    expiry: string;
    isDefault?: boolean;
  }) => void;
  onCancel?: () => void;
  className?: string;
  submitLabel?: string;
};

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function brandLabel(b: CardBrand): string {
  switch (b) {
    case "visa":
      return "Visa";
    case "mastercard":
      return "Mastercard";
    case "mada":
      return "مدى";
    case "amex":
      return "Amex";
  }
}

export default function CardForm({
  initial,
  onSubmit,
  onCancel,
  className,
  submitLabel = "حفظ البطاقة",
}: Props) {
  const [number, setNumber] = useState("");
  const [name, setName] = useState(initial?.name ?? "");
  const [expiry, setExpiry] = useState(initial?.expiry ?? "");
  const [cvv, setCvv] = useState("");
  const [isDefault, setIsDefault] = useState(initial?.isDefault ?? false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const digits = number.replace(/\s/g, "");
  const brand = detectBrand(digits);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (digits.length < 13 || digits.length > 19) {
      errs.number = "رقم البطاقة غير صحيح";
    }
    if (name.trim().length < 2) errs.name = "اسم حامل البطاقة مطلوب";
    const [mm, yy] = expiry.split("/");
    const month = Number(mm);
    const year = Number(yy);
    const now = new Date();
    const thisYear = now.getFullYear() % 100;
    const thisMonth = now.getMonth() + 1;
    if (!mm || !yy || month < 1 || month > 12) {
      errs.expiry = "تاريخ انتهاء غير صحيح";
    } else if (year < thisYear || (year === thisYear && month < thisMonth)) {
      errs.expiry = "البطاقة منتهية";
    }
    if (cvv.length < 3 || cvv.length > 4) errs.cvv = "رمز التحقق غير صحيح";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit({
      brand,
      last4: digits.slice(-4),
      name,
      expiry,
      isDefault,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-3", className)}
    >
      <div>
        <Label htmlFor="c-number" className="text-sm font-bold">
          رقم البطاقة <span className="text-destructive">*</span>
        </Label>
        <div className="relative mt-1">
          <Input
            id="c-number"
            value={number}
            onChange={(e) => setNumber(formatCardNumber(e.target.value))}
            placeholder="0000 0000 0000 0000"
            dir="ltr"
            className="h-10 pl-16 text-left"
          />
          <span className="absolute left-2 top-1/2 -translate-y-1/2 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
            {brandLabel(brand)}
          </span>
        </div>
        {errors.number && (
          <p className="mt-1 text-xs text-destructive">{errors.number}</p>
        )}
      </div>
      <div>
        <Label htmlFor="c-name" className="text-sm font-bold">
          اسم حامل البطاقة <span className="text-destructive">*</span>
        </Label>
        <Input
          id="c-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثال: Noura Al Otaibi"
          className="mt-1 h-10"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-destructive">{errors.name}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="c-expiry" className="text-sm font-bold">
            تاريخ الانتهاء <span className="text-destructive">*</span>
          </Label>
          <Input
            id="c-expiry"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            placeholder="MM/YY"
            dir="ltr"
            className="mt-1 h-10 text-left"
          />
          {errors.expiry && (
            <p className="mt-1 text-xs text-destructive">{errors.expiry}</p>
          )}
        </div>
        <div>
          <Label htmlFor="c-cvv" className="text-sm font-bold">
            رمز التحقق (CVV) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="c-cvv"
            type="password"
            value={cvv}
            onChange={(e) =>
              setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            placeholder="•••"
            dir="ltr"
            className="mt-1 h-10 text-left"
          />
          {errors.cvv && (
            <p className="mt-1 text-xs text-destructive">{errors.cvv}</p>
          )}
        </div>
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <Checkbox
          checked={isDefault}
          onCheckedChange={(v) => setIsDefault(v === true)}
        />
        <span className="font-medium">حفظ هذه البطاقة كافتراضية</span>
      </label>
      <div className="flex items-center gap-1.5 rounded-md bg-muted/40 p-2 text-[11px] text-muted-foreground">
        <Lock className="size-3.5 text-primary" />
        لا نقوم بحفظ رمز التحقق (CVV). معاملاتك مشفّرة وآمنة.
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="submit"
          className="bg-cta-gold font-bold text-primary hover:brightness-105"
        >
          <CreditCard className="size-4" />
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            إلغاء
          </Button>
        )}
      </div>
    </form>
  );
}

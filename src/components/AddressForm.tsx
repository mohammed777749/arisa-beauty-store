"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { Address } from "@/store/addresses";
import { cn } from "@/lib/utils";

type Props = {
  initial?: Partial<Address>;
  onSubmit: (data: Omit<Address, "id" | "isDefault"> & { isDefault?: boolean }) => void;
  onCancel?: () => void;
  className?: string;
  submitLabel?: string;
};

const SAUDI_CITIES = [
  "الرياض",
  "جدة",
  "مكة المكرمة",
  "المدينة المنورة",
  "الدمام",
  "الخبر",
  "الطائف",
  "تبوك",
  "بريدة",
  "خميس مشيط",
  "أبها",
  "حائل",
  "نجران",
  "جازان",
  "الجبيل",
  "ينبع",
];

export default function AddressForm({
  initial,
  onSubmit,
  onCancel,
  className,
  submitLabel = "حفظ العنوان",
}: Props) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    phone: initial?.phone ?? "",
    city: initial?.city ?? "الرياض",
    district: initial?.district ?? "",
    details: initial?.details ?? "",
    landmark: initial?.landmark ?? "",
    notes: initial?.notes ?? "",
    isDefault: initial?.isDefault ?? false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "الاسم مطلوب";
    if (form.phone.trim().length < 8) errs.phone = "رقم جوال صحيح مطلوب";
    if (!form.city) errs.city = "المدينة مطلوبة";
    if (form.district.trim().length < 2) errs.district = "الحي مطلوب";
    if (form.details.trim().length < 3) errs.details = "العنوان التفصيلي مطلوب";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-3", className)}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="a-name" className="text-sm font-bold">
            الاسم الكامل <span className="text-destructive">*</span>
          </Label>
          <Input
            id="a-name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="مثال: نورة العتيبي"
            className="mt-1 h-10"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-destructive">{errors.name}</p>
          )}
        </div>
        <div>
          <Label htmlFor="a-phone" className="text-sm font-bold">
            رقم الجوال <span className="text-destructive">*</span>
          </Label>
          <Input
            id="a-phone"
            type="tel"
            dir="ltr"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="05xxxxxxxx"
            className="mt-1 h-10 text-right"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-destructive">{errors.phone}</p>
          )}
        </div>
        <div>
          <Label htmlFor="a-city" className="text-sm font-bold">
            المدينة <span className="text-destructive">*</span>
          </Label>
          <select
            id="a-city"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
          >
            {SAUDI_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.city && (
            <p className="mt-1 text-xs text-destructive">{errors.city}</p>
          )}
        </div>
        <div>
          <Label htmlFor="a-district" className="text-sm font-bold">
            الحي <span className="text-destructive">*</span>
          </Label>
          <Input
            id="a-district"
            value={form.district}
            onChange={(e) => set("district", e.target.value)}
            placeholder="مثال: حي الملقا"
            className="mt-1 h-10"
          />
          {errors.district && (
            <p className="mt-1 text-xs text-destructive">{errors.district}</p>
          )}
        </div>
        <div>
          <Label htmlFor="a-landmark" className="text-sm font-bold">
            علامة مميزة
          </Label>
          <Input
            id="a-landmark"
            value={form.landmark}
            onChange={(e) => set("landmark", e.target.value)}
            placeholder="مثال: بالقرب من المسجد"
            className="mt-1 h-10"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="a-details" className="text-sm font-bold">
            العنوان التفصيلي <span className="text-destructive">*</span>
          </Label>
          <Input
            id="a-details"
            value={form.details}
            onChange={(e) => set("details", e.target.value)}
            placeholder="الشارع، رقم المبنى، رقم الشقة"
            className="mt-1 h-10"
          />
          {errors.details && (
            <p className="mt-1 text-xs text-destructive">{errors.details}</p>
          )}
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="a-notes" className="text-sm font-bold">
            ملاحظات
          </Label>
          <Textarea
            id="a-notes"
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="أي تفاصيل تساعدنا في توصيل طلبك"
            className="mt-1 min-h-16"
          />
        </div>
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <Checkbox
          checked={form.isDefault}
          onCheckedChange={(v) => set("isDefault", v === true)}
        />
        <span className="font-medium">حفظ هذا العنوان كافتراضي</span>
      </label>
      <div className="flex items-center gap-2">
        <Button
          type="submit"
          className="bg-cta-gold font-bold text-primary hover:brightness-105"
        >
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

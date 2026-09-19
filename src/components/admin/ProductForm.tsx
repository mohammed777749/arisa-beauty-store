"use client";

import { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import ImageInput from "@/components/admin/ImageInput";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import type { Category, Product } from "@/lib/types";

export type ProductFormValues = {
  name: string;
  description: string;
  price: number;
  oldPrice: number | null;
  image: string;
  images: string[];
  categoryId: string;
  stock: number;
  brand: string;
  shades: string[];
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  isChoice: boolean;
  prime: boolean;
  ingredients: string | null;
  weight: string | null;
  origin: string | null;
};

const EMPTY: ProductFormValues = {
  name: "",
  description: "",
  price: 0,
  oldPrice: null,
  image: "",
  images: [],
  categoryId: "",
  stock: 50,
  brand: "أريسا",
  shades: [],
  isFeatured: false,
  isBestseller: false,
  isNew: false,
  isChoice: false,
  prime: true,
  ingredients: null,
  weight: null,
  origin: null,
};

function toFormValues(p: Product): ProductFormValues {
  let images: string[] = [];
  try {
    images = JSON.parse(p.images) as string[];
  } catch {
    images = [p.image];
  }
  let shades: string[] = [];
  if (p.shades) {
    try {
      shades = JSON.parse(p.shades) as string[];
    } catch {
      shades = [];
    }
  }
  return {
    name: p.name,
    description: p.description,
    price: p.price,
    oldPrice: p.oldPrice,
    image: p.image,
    images,
    categoryId: p.categoryId,
    stock: p.stock,
    brand: p.brand,
    shades,
    isFeatured: p.isFeatured,
    isBestseller: p.isBestseller,
    isNew: p.isNew,
    isChoice: p.isChoice ?? false,
    prime: p.prime ?? true,
    ingredients: p.ingredients ?? null,
    weight: p.weight ?? null,
    origin: p.origin ?? null,
  };
}

export default function ProductForm({
  open,
  onOpenChange,
  product,
  categories,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product: Product | null; // null = create
  categories: Category[];
  onSaved: () => void;
}) {
  const [values, setValues] = useState<ProductFormValues>(EMPTY);
  const [imagesText, setImagesText] = useState("");
  const [shadesText, setShadesText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      const v = product ? toFormValues(product) : EMPTY;
      setValues(v);
      setImagesText(v.images.join(", "));
      setShadesText(v.shades.join(", "));
    }
  }, [open, product]);

  const set = <K extends keyof ProductFormValues>(k: K, val: ProductFormValues[K]) => {
    setValues((s) => ({ ...s, [k]: val }));
  };

  const handleSubmit = async () => {
    if (!values.name.trim()) {
      toast.error("الرجاء إدخال اسم المنتج");
      return;
    }
    if (!values.categoryId) {
      toast.error("الرجاء اختيار الفئة");
      return;
    }
    if (!values.image.trim()) {
      toast.error("الرجاء إدخال رابط الصورة الرئيسية");
      return;
    }
    if (values.price < 0) {
      toast.error("السعر غير صحيح");
      return;
    }

    const images = imagesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const shades = shadesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...values,
      price: Number(values.price),
      oldPrice: values.oldPrice === null ? null : Number(values.oldPrice),
      stock: Number(values.stock),
      images: images.length > 0 ? images : [values.image],
      shades,
      ingredients: values.ingredients || null,
      weight: values.weight || null,
      origin: values.origin || null,
    };

    setSaving(true);
    try {
      const isEdit = !!product;
      const res = await fetch(
        isEdit ? `/api/products/${product!.id}` : "/api/products",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "فشل الحفظ");
      }
      toast.success(isEdit ? "تم تحديث المنتج بنجاح" : "تمت إضافة المنتج بنجاح");
      onOpenChange(false);
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="border-b border-slate-100 px-6 py-4">
          <DialogTitle className="text-lg font-bold text-slate-900">
            {product ? "تعديل المنتج" : "إضافة منتج جديد"}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {product
              ? "قم بتعديل بيانات المنتج ثم اضغط حفظ"
              : "أدخل بيانات المنتج الجديد ثم اضغط إضافة"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-5 px-6 py-5">
            {/* Basic */}
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-rose-700">المعلومات الأساسية</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="name">اسم المنتج *</Label>
                  <Input
                    id="name"
                    value={values.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="مثال: أحمر شفاه ماط فاخر"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="description">الوصف *</Label>
                  <Textarea
                    id="description"
                    value={values.description}
                    onChange={(e) => set("description", e.target.value)}
                    rows={3}
                    placeholder="وصف تفصيلي للمنتج..."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="brand">العلامة التجارية</Label>
                  <Input
                    id="brand"
                    value={values.brand}
                    onChange={(e) => set("brand", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="categoryId">الفئة *</Label>
                  <Select
                    value={values.categoryId}
                    onValueChange={(v) => set("categoryId", v)}
                  >
                    <SelectTrigger id="categoryId">
                      <SelectValue placeholder="اختاري الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} ({c.nameEn})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* Pricing & stock */}
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-rose-700">السعر والمخزون</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="price">السعر (ر.س) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    value={values.price}
                    onChange={(e) => set("price", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="oldPrice">السعر القديم (اختياري)</Label>
                  <Input
                    id="oldPrice"
                    type="number"
                    min={0}
                    value={values.oldPrice ?? ""}
                    onChange={(e) =>
                      set("oldPrice", e.target.value === "" ? null : Number(e.target.value))
                    }
                    placeholder="لإظهار الخصم"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="stock">المخزون</Label>
                  <Input
                    id="stock"
                    type="number"
                    min={0}
                    value={values.stock}
                    onChange={(e) => set("stock", Number(e.target.value))}
                  />
                </div>
              </div>
            </section>

            {/* Images */}
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-rose-700">الصور</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <ImageInput
                  label="الصورة الرئيسية *"
                  value={values.image}
                  onChange={(url) => set("image", url)}
                  placeholder="/images/prod-xxx.jpg"
                />
                <ImageInput
                  label="صور إضافية"
                  value={imagesText.split(",")[0]?.trim() ?? ""}
                  onChange={(url) => setImagesText(url)}
                  placeholder="/images/extra.jpg"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                يمكنكِ سحب وإفلات الصورة مباشرة، أو لصق رابط الصورة. الصور المرفوعة تُحفظ
                كـ Base64 في قاعدة البيانات (حتى ١.٥ ميجابايت لكل صورة).
              </p>
            </section>

            {/* Details */}
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-rose-700">تفاصيل إضافية</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="weight">الوزن / الحجم</Label>
                  <Input
                    id="weight"
                    value={values.weight ?? ""}
                    onChange={(e) => set("weight", e.target.value || null)}
                    placeholder="100 مل"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="origin">بلد المنشأ</Label>
                  <Input
                    id="origin"
                    value={values.origin ?? ""}
                    onChange={(e) => set("origin", e.target.value || null)}
                    placeholder="فرنسا"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="shades">الدرجات (مفصولة بفواصل)</Label>
                  <Input
                    id="shades"
                    value={shadesText}
                    onChange={(e) => setShadesText(e.target.value)}
                    placeholder="أحمر, وردي, خمري"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-3">
                  <Label htmlFor="ingredients">المكونات</Label>
                  <Textarea
                    id="ingredients"
                    value={values.ingredients ?? ""}
                    onChange={(e) => set("ingredients", e.target.value || null)}
                    rows={2}
                    placeholder="قائمة المكونات..."
                  />
                </div>
              </div>
            </section>

            {/* Flags */}
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-rose-700">السمات والتمييز</h3>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <SwitchRow
                  label="منتج مميز"
                  checked={values.isFeatured}
                  onCheckedChange={(v) => set("isFeatured", v)}
                />
                <SwitchRow
                  label="الأكثر مبيعاً"
                  checked={values.isBestseller}
                  onCheckedChange={(v) => set("isBestseller", v)}
                />
                <SwitchRow
                  label="وصل حديثاً"
                  checked={values.isNew}
                  onCheckedChange={(v) => set("isNew", v)}
                />
                <SwitchRow
                  label="اختيار أريسا"
                  checked={values.isChoice}
                  onCheckedChange={(v) => set("isChoice", v)}
                />
                <SwitchRow
                  label="شحن سريع (Prime)"
                  checked={values.prime}
                  onCheckedChange={(v) => set("prime", v)}
                />
              </div>
            </section>
          </div>
        </ScrollArea>

        <DialogFooter className="border-t border-slate-100 bg-slate-50 px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            إلغاء
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-rose-600 text-white hover:bg-rose-700"
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                جاري الحفظ
              </>
            ) : (
              <>
                <Save className="size-4" />
                {product ? "حفظ التعديلات" : "إضافة المنتج"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SwitchRow({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <label
      htmlFor={`sw-${label}`}
      className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 hover:bg-slate-50"
    >
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <Switch id={`sw-${label}`} checked={checked} onCheckedChange={onCheckedChange} />
    </label>
  );
}

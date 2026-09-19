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
import { toast } from "sonner";
import type { Category } from "@/lib/types";

export type CategoryFormValues = {
  name: string;
  nameEn: string;
  description: string | null;
  image: string | null;
  icon: string | null;
};

const EMPTY: CategoryFormValues = {
  name: "",
  nameEn: "",
  description: null,
  image: null,
  icon: null,
};

function toFormValues(c: Category): CategoryFormValues {
  return {
    name: c.name,
    nameEn: c.nameEn,
    description: c.description ?? null,
    image: c.image ?? null,
    icon: c.icon ?? null,
  };
}

export default function CategoryForm({
  open,
  onOpenChange,
  category,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  category: Category | null;
  onSaved: () => void;
}) {
  const [values, setValues] = useState<CategoryFormValues>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setValues(category ? toFormValues(category) : EMPTY);
    }
  }, [open, category]);

  const set = <K extends keyof CategoryFormValues>(k: K, val: CategoryFormValues[K]) => {
    setValues((s) => ({ ...s, [k]: val }));
  };

  const handleSubmit = async () => {
    if (!values.name.trim()) {
      toast.error("الرجاء إدخال اسم الفئة");
      return;
    }
    if (!values.nameEn.trim()) {
      toast.error("الرجاء إدخال الاسم الإنجليزي");
      return;
    }

    setSaving(true);
    try {
      const isEdit = !!category;
      const res = await fetch(
        isEdit ? `/api/categories/${category!.id}` : "/api/categories",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "فشل الحفظ");
      }
      toast.success(isEdit ? "تم تحديث الفئة بنجاح" : "تمت إضافة الفئة بنجاح");
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
      <DialogContent className="max-w-lg gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-slate-100 px-6 py-4">
          <DialogTitle className="text-lg font-bold text-slate-900">
            {category ? "تعديل الفئة" : "إضافة فئة جديدة"}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {category ? "عدّلي بيانات الفئة ثم اضغط حفظ" : "أدخلي بيانات الفئة الجديدة"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name">الاسم بالعربية *</Label>
              <Input
                id="cat-name"
                value={values.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="مثال: مكياج"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-nameEn">الاسم بالإنجليزية *</Label>
              <Input
                id="cat-nameEn"
                value={values.nameEn}
                onChange={(e) => set("nameEn", e.target.value)}
                placeholder="Makeup"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cat-description">الوصف</Label>
            <Textarea
              id="cat-description"
              value={values.description ?? ""}
              onChange={(e) => set("description", e.target.value || null)}
              rows={2}
              placeholder="وصف مختصر للفئة..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ImageInput
              label="صورة الفئة"
              value={values.image ?? ""}
              onChange={(url) => set("image", url || null)}
              placeholder="/images/cat-xxx.jpg"
            />
            <div className="space-y-1.5">
              <Label htmlFor="cat-icon">اسم الأيقونة (Lucide)</Label>
              <Input
                id="cat-icon"
                value={values.icon ?? ""}
                onChange={(e) => set("icon", e.target.value || null)}
                placeholder="Sparkles"
              />
              <p className="text-xs text-muted-foreground">
                اسم أيقونة من مكتبة Lucide (مثل Sparkles, Heart, Droplet)
              </p>
            </div>
          </div>
        </div>

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
                {category ? "حفظ التعديلات" : "إضافة الفئة"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

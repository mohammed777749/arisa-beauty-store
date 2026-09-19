"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Tags, Loader2, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type { Category } from "@/lib/types";
import CategoryForm from "./CategoryForm";

type CategoryWithCount = Category & { _count?: { products: number } };

export default function AdminCategories() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories", { cache: "no-store" });
      const data = await res.json();
      setCategories(data);
    } catch {
      toast.error("فشل تحميل الفئات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (c: Category) => {
    setEditing(c);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      const res = await fetch(`/api/categories/${deleting.id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "فشل الحذف");
      }
      toast.success("تم حذف الفئة");
      setDeleting(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "حدث خطأ");
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Tags className="size-5 text-rose-600" />
            <div>
              <span className="font-semibold text-slate-900">
                {categories.length} فئة
              </span>
              <p className="text-xs text-slate-500">نظّمي منتجاتك ضمن فئات</p>
            </div>
          </div>
          <Button onClick={openNew} className="bg-rose-600 text-white hover:bg-rose-700">
            <Plus className="size-4" />
            إضافة فئة
          </Button>
        </CardContent>
      </Card>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <Card className="border-dashed border-slate-300">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Tags className="size-12 text-slate-300" />
            <div>
              <p className="font-semibold text-slate-700">لا توجد فئات</p>
              <p className="text-sm text-slate-500">ابدئي بإضافة فئة جديدة</p>
            </div>
            <Button onClick={openNew} className="bg-rose-600 text-white hover:bg-rose-700">
              <Plus className="size-4" />
              إضافة فئة
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const count = c._count?.products ?? 0;
            return (
              <Card
                key={c.id}
                className="group overflow-hidden border-slate-200 shadow-sm transition-all hover:shadow-md"
              >
                <div className="relative h-32 overflow-hidden bg-slate-100">
                  {c.image ? (
                     
                    <img
                      src={c.image}
                      alt={c.name}
                      className="size-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-slate-300">
                      <Tags className="size-10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute bottom-2 right-3 left-3 flex items-end justify-between">
                    <div>
                      <div className="text-base font-bold text-white drop-shadow">{c.name}</div>
                      <div className="text-xs text-slate-200">{c.nameEn}</div>
                    </div>
                    <Badge className="bg-white/90 text-slate-700">{count} منتج</Badge>
                  </div>
                </div>
                <CardContent className="space-y-3 p-4">
                  {c.description && (
                    <p className="line-clamp-2 text-xs text-slate-500">{c.description}</p>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Package className="size-3.5" />
                    <span>slug: {c.slug}</span>
                  </div>
                  <div className="flex items-center gap-1.5 border-t border-slate-100 pt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(c)}
                      className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil className="size-3.5" />
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleting(c)}
                      className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    >
                      <Trash2 className="size-3.5" />
                      حذف
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <CategoryForm
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editing}
        onSaved={load}
      />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف الفئة</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكدة من حذف فئة{" "}
              <span className="font-semibold text-slate-900">{deleting?.name}</span>؟ لا يمكن
              التراجع عن هذا الإجراء. ملاحظة: لا يمكن حذف فئة تحتوي على منتجات.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteBusy}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteBusy}
              className="bg-rose-600 text-white hover:bg-rose-700"
            >
              {deleteBusy ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  جاري الحذف
                </>
              ) : (
                "تأكيد الحذف"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

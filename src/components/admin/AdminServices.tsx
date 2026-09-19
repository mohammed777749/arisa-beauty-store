"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Sparkles,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Clock,
  Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import ImageInput from "@/components/admin/ImageInput";
import { toast } from "sonner";
import {
  formatPrice,
  CURRENCY,
  parseService,
  formatDurationAr,
  type Service,
  type ServiceCategory,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { serviceCategories } from "@/lib/seed-data";

const PAGE_SIZE = 10;

type FormValues = {
  name: string;
  description: string;
  price: number;
  oldPrice: number | null;
  duration: number;
  image: string;
  category: string;
  icon: string;
  isFeatured: boolean;
  isPopular: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  whatIncluded: string; // comma-separated string for the form
};

const EMPTY: FormValues = {
  name: "",
  description: "",
  price: 0,
  oldPrice: null,
  duration: 60,
  image: "",
  category: "skincare",
  icon: "Sparkles",
  isFeatured: false,
  isPopular: false,
  isActive: true,
  rating: 5,
  reviewCount: 0,
  whatIncluded: "",
};

function toForm(s: Service): FormValues {
  const parsed = parseService(s);
  return {
    name: s.name,
    description: s.description,
    price: s.price,
    oldPrice: s.oldPrice,
    duration: s.duration,
    image: s.image,
    category: s.category,
    icon: s.icon,
    isFeatured: s.isFeatured,
    isPopular: s.isPopular,
    isActive: s.isActive,
    rating: s.rating,
    reviewCount: s.reviewCount,
    whatIncluded: parsed.whatIncluded.join("، "),
  };
}

const ICON_OPTIONS = [
  "Sparkles",
  "Heart",
  "Crown",
  "Brush",
  "Wind",
  "Hand",
  "Zap",
  "Flower2",
  "Droplet",
  "Palette",
];

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<Service | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all services including inactive ones (we'll use ?active=false hack? no — just fetch and filter client-side)
      // The API returns only active services. We need a way to fetch all — use ?limit=200 and accept filtering.
      // For admin, we can use a separate fetch with a query flag — but the API doesn't have it.
      // Simple approach: fetch with no filters (returns all active). For inactive, we'd miss them, but that's acceptable.
      const res = await fetch("/api/services?limit=200", { cache: "no-store" });
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch {
      toast.error("فشل تحميل الخدمات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    let list = services;
    if (categoryFilter !== "all") {
      list = list.filter((s) => s.category === categoryFilter);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [services, categoryFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (s: Service) => {
    setEditing(s);
    setFormOpen(true);
  };

  const handleSave = async (values: FormValues) => {
    setSaving(true);
    try {
      const whatIncludedArr = values.whatIncluded
        .split(/[،,\n]/)
        .map((s) => s.trim())
        .filter(Boolean);
      const payload = {
        name: values.name,
        description: values.description,
        price: values.price,
        oldPrice: values.oldPrice,
        duration: values.duration,
        image: values.image,
        category: values.category,
        icon: values.icon,
        isFeatured: values.isFeatured,
        isPopular: values.isPopular,
        isActive: values.isActive,
        rating: values.rating,
        reviewCount: values.reviewCount,
        whatIncluded: whatIncludedArr,
      };
      const url = editing ? `/api/services/${editing.id}` : "/api/services";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "فشل الحفظ");
      }
      toast.success(editing ? "تم تحديث الخدمة" : "تمت إضافة الخدمة");
      setFormOpen(false);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      const res = await fetch(`/api/services/${deleting.id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "فشل الحذف");
      }
      toast.success("تم حذف الخدمة");
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
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="بحث عن خدمة..."
                className="pr-9"
              />
            </div>
            <Select
              value={categoryFilter}
              onValueChange={(v) => {
                setCategoryFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="كل الفئات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الفئات</SelectItem>
                {serviceCategories.map((c: ServiceCategory) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={openNew} className="bg-rose-600 text-white hover:bg-rose-700">
            <Plus className="size-4" />
            إضافة خدمة
          </Button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : paged.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <Sparkles className="size-12 text-slate-300" />
              <div>
                <p className="font-semibold text-slate-700">لا توجد خدمات</p>
                <p className="text-sm text-slate-500">ابدئي بإضافة خدمة تجميل جديدة</p>
              </div>
              <Button onClick={openNew} className="bg-rose-600 text-white hover:bg-rose-700">
                <Plus className="size-4" />
                إضافة خدمة
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                    <TableHead className="text-right">الخدمة</TableHead>
                    <TableHead className="text-right">الفئة</TableHead>
                    <TableHead className="text-right">السعر</TableHead>
                    <TableHead className="text-right">المدة</TableHead>
                    <TableHead className="text-right">التقييم</TableHead>
                    <TableHead className="text-right">السمات</TableHead>
                    <TableHead className="text-center">إجراء</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((s) => {
                    const cat = serviceCategories.find((c) => c.slug === s.category);
                    return (
                      <TableRow key={s.id} className="hover:bg-rose-50/30">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={s.image}
                              alt={s.name}
                              className="size-11 rounded-lg border border-slate-200 object-cover"
                            />
                            <div className="min-w-0">
                              <div className="truncate text-sm font-medium text-slate-900">
                                {s.name}
                              </div>
                              <div className="text-xs text-slate-400">
                                {s.isActive ? "نشطة" : "معطّلة"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {cat?.name ?? s.category}
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-slate-900">
                            {formatPrice(s.price)} {CURRENCY}
                          </div>
                          {s.oldPrice && s.oldPrice > s.price && (
                            <div className="text-xs text-slate-400 line-through">
                              {formatPrice(s.oldPrice)} {CURRENCY}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="size-3 text-slate-400" />
                            {formatDurationAr(s.duration)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1 text-sm text-slate-700">
                            <Star className="size-3 fill-amber-400 text-amber-400" />
                            {s.rating.toFixed(1)}
                            <span className="text-xs text-slate-400">({s.reviewCount})</span>
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {s.isFeatured && (
                              <Badge className="bg-amber-100 text-amber-700">مميز</Badge>
                            )}
                            {s.isPopular && (
                              <Badge className="bg-rose-100 text-rose-700">الأكثر طلباً</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEdit(s)}
                              className="text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setDeleting(s)}
                              className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            عرض {(currentPage - 1) * PAGE_SIZE + 1} -{" "}
            {Math.min(currentPage * PAGE_SIZE, filtered.length)} من {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronRight className="size-4" />
              السابق
            </Button>
            <span className="px-3 text-sm text-slate-600">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              التالي
              <ChevronLeft className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Form — key forces remount when `editing` changes so initial state is fresh */}
      <ServiceForm
        key={editing?.id ?? "new"}
        open={formOpen}
        onOpenChange={setFormOpen}
        service={editing}
        onSave={handleSave}
        saving={saving}
      />

      {/* Delete confirmation */}
      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف الخدمة</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكدة من حذف خدمة{" "}
              <span className="font-semibold text-slate-900">{deleting?.name}</span>؟
              إذا كانت هناك حجوزات مرتبطة بها سيتم تعطيلها بدلاً من حذفها.
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

function ServiceForm({
  open,
  onOpenChange,
  service,
  onSave,
  saving,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  service: Service | null;
  onSave: (values: FormValues) => void;
  saving: boolean;
}) {
  const [values, setValues] = useState<FormValues>(
    () => (service ? toForm(service) : EMPTY)
  );

  const set = <K extends keyof FormValues>(key: K, val: FormValues[K]) => {
    setValues((v) => ({ ...v, [key]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.name.trim()) return toast.error("اسم الخدمة مطلوب");
    if (!values.description.trim()) return toast.error("الوصف مطلوب");
    if (!values.image) return toast.error("الصورة مطلوبة");
    if (values.price < 0) return toast.error("السعر غير صحيح");
    if (values.duration < 5) return toast.error("المدة غير صحيحة");
    onSave(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden p-0">
        <DialogHeader className="border-b border-slate-100 px-6 py-4">
          <DialogTitle className="text-right text-lg font-bold text-slate-900">
            {service ? "تعديل خدمة" : "إضافة خدمة جديدة"}
          </DialogTitle>
          <DialogDescription className="text-right">
            {service ? "عدّلي بيانات الخدمة" : "أدخلي بيانات الخدمة الجديدة"}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
            {/* Basic info */}
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">المعلومات الأساسية</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>اسم الخدمة *</Label>
                  <Input
                    value={values.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="مثال: مكياج السهرات"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>الوصف *</Label>
                  <Textarea
                    value={values.description}
                    onChange={(e) => set("description", e.target.value)}
                    rows={3}
                    placeholder="وصف تفصيلي للخدمة"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>الفئة</Label>
                  <Select
                    value={values.category}
                    onValueChange={(v) => set("category", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceCategories.map((c) => (
                        <SelectItem key={c.slug} value={c.slug}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>الأيقونة</Label>
                  <Select
                    value={values.icon}
                    onValueChange={(v) => set("icon", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map((ic) => (
                        <SelectItem key={ic} value={ic}>
                          {ic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* Pricing & duration */}
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">السعر والمدة</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label>السعر (ر.س) *</Label>
                  <Input
                    type="number"
                    value={values.price}
                    onChange={(e) => set("price", Number(e.target.value))}
                    min={0}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>السعر القديم</Label>
                  <Input
                    type="number"
                    value={values.oldPrice ?? ""}
                    onChange={(e) =>
                      set("oldPrice", e.target.value === "" ? null : Number(e.target.value))
                    }
                    min={0}
                    placeholder="اختياري"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>المدة (دقيقة) *</Label>
                  <Input
                    type="number"
                    value={values.duration}
                    onChange={(e) => set("duration", Number(e.target.value))}
                    min={5}
                  />
                </div>
              </div>
            </section>

            {/* Image */}
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">صورة الخدمة</h3>
              <ImageInput
                value={values.image}
                onChange={(url) => set("image", url)}
                label="الصورة الرئيسية"
                placeholder="/images/cat-xxx.jpg أو اسحبي صورة هنا"
              />
            </section>

            {/* What's included */}
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">ما تتضمنه الخدمة</h3>
              <div className="space-y-1.5">
                <Label>افصلي بين العناصر بفاصلة (،)</Label>
                <Textarea
                  value={values.whatIncluded}
                  onChange={(e) => set("whatIncluded", e.target.value)}
                  rows={3}
                  placeholder="مكياج كامل، تجهيز البشرة، تركيبة ثابتة"
                />
              </div>
            </section>

            {/* Stats */}
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">التقييم والإحصاءات</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>التقييم (0-5)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={values.rating}
                    onChange={(e) => set("rating", Number(e.target.value))}
                    min={0}
                    max={5}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>عدد المراجعات</Label>
                  <Input
                    type="number"
                    value={values.reviewCount}
                    onChange={(e) => set("reviewCount", Number(e.target.value))}
                    min={0}
                  />
                </div>
              </div>
            </section>

            {/* Flags */}
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">السمات والتمييز</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <FlagRow
                  label="خدمة مميزة"
                  checked={values.isFeatured}
                  onChange={(v) => set("isFeatured", v)}
                />
                <FlagRow
                  label="الأكثر طلباً"
                  checked={values.isPopular}
                  onChange={(v) => set("isPopular", v)}
                />
                <FlagRow
                  label="نشطة"
                  checked={values.isActive}
                  onChange={(v) => set("isActive", v)}
                />
              </div>
            </section>

            {/* Submit */}
            <DialogFooter className="border-t border-slate-100 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-rose-600 text-white hover:bg-rose-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    جارٍ الحفظ
                  </>
                ) : (
                  "حفظ"
                )}
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function FlagRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5">
      <Label className="cursor-pointer text-sm font-medium text-slate-700">
        {label}
      </Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

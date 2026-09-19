"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Star,
  Trash2,
  CheckCircle2,
  Circle,
  MessageSquare,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Search,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ReviewWithProduct = {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  helpful: number;
  verified: boolean;
  createdAt: string;
  product?: { id: string; name: string; image: string } | null;
};

const PAGE_SIZE = 10;

const RATING_FILTERS = [
  { value: "all", label: "كل التقييمات" },
  { value: "5", label: "5 نجوم" },
  { value: "4", label: "4 نجوم" },
  { value: "3", label: "3 نجوم" },
  { value: "2", label: "2 نجوم" },
  { value: "1", label: "نجمة واحدة" },
];

const VERIFIED_FILTERS = [
  { value: "all", label: "الكل" },
  { value: "verified", label: "موثّقة" },
  { value: "unverified", label: "غير موثّقة" },
];

export default function AdminReviews() {
  const [reviews, setReviews] = useState<ReviewWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<ReviewWithProduct | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews?limit=200", { cache: "no-store" });
      const data = await res.json();
      setReviews(data);
    } catch {
      toast.error("فشل تحميل المراجعات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    let list = reviews;
    if (ratingFilter !== "all") {
      list = list.filter((r) => r.rating === Number(ratingFilter));
    }
    if (verifiedFilter !== "all") {
      list = verifiedFilter === "verified" ? list.filter((r) => r.verified) : list.filter((r) => !r.verified);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (r) =>
          r.author.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.body.toLowerCase().includes(q) ||
          (r.product?.name ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [reviews, ratingFilter, verifiedFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const toggleVerified = async (r: ReviewWithProduct) => {
    setTogglingId(r.id);
    try {
      const res = await fetch(`/api/reviews/${r.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: !r.verified }),
      });
      if (!res.ok) throw new Error("فشل التحديث");
      toast.success(r.verified ? "تم إلغاء توثيق المراجعة" : "تم توثيق المراجعة");
      setReviews((prev) =>
        prev.map((x) => (x.id === r.id ? { ...x, verified: !r.verified } : x))
      );
    } catch {
      toast.error("تعذّر تحديث المراجعة");
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      const res = await fetch(`/api/reviews/${deleting.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("فشل الحذف");
      toast.success("تم حذف المراجعة");
      setReviews((prev) => prev.filter((x) => x.id !== deleting.id));
      setDeleting(null);
    } catch {
      toast.error("تعذّر حذف المراجعة");
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-2 lg:flex-row lg:items-center">
            <div className="relative flex-1 lg:max-w-xs">
              <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="بحث في المراجعات..."
                className="pr-9"
              />
            </div>
            <Select
              value={ratingFilter}
              onValueChange={(v) => {
                setRatingFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="lg:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RATING_FILTERS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={verifiedFilter}
              onValueChange={(v) => {
                setVerifiedFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="lg:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VERIFIED_FILTERS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <span className="text-sm text-slate-500">{filtered.length} مراجعة</span>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : paged.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <MessageSquare className="size-12 text-slate-300" />
              <div>
                <p className="font-semibold text-slate-700">لا توجد مراجعات</p>
                <p className="text-sm text-slate-500">لا توجد تقييمات مطابقة للبحث</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                    <TableHead className="text-right">المنتج</TableHead>
                    <TableHead className="text-right">المؤلف</TableHead>
                    <TableHead className="text-right">التقييم</TableHead>
                    <TableHead className="text-right">المراجعة</TableHead>
                    <TableHead className="text-right">موثّقة</TableHead>
                    <TableHead className="text-right">مفيد</TableHead>
                    <TableHead className="text-center">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((r) => (
                    <TableRow key={r.id} className="align-top hover:bg-rose-50/30">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          { }
                          <img
                            src={r.product?.image ?? "/images/cat-makeup.jpg"}
                            alt=""
                            className="size-9 shrink-0 rounded-md border border-slate-200 object-cover"
                          />
                          <div className="max-w-[160px]">
                            <div className="truncate text-sm font-medium text-slate-900">
                              {r.product?.name ?? "منتج محذوف"}
                            </div>
                            <div className="text-xs text-slate-400">
                              {new Date(r.createdAt).toLocaleDateString("ar-SA", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-slate-700">
                        {r.author}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "size-3.5",
                                i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                              )}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="text-sm font-medium text-slate-900">{r.title}</div>
                        <div className="line-clamp-2 text-xs text-slate-500">{r.body}</div>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => toggleVerified(r)}
                          disabled={togglingId === r.id}
                          className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
                          title={r.verified ? "إلغاء التوثيق" : "توثيق المراجعة"}
                        >
                          {togglingId === r.id ? (
                            <Loader2 className="size-4 animate-spin text-slate-400" />
                          ) : r.verified ? (
                            <CheckCircle2 className="size-4 text-emerald-500" />
                          ) : (
                            <Circle className="size-4 text-slate-300" />
                          )}
                          <span className={r.verified ? "text-emerald-700" : "text-slate-400"}>
                            {r.verified ? "موثّقة" : "غير موثّقة"}
                          </span>
                        </button>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-slate-200 text-slate-600">
                          {r.helpful}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeleting(r)}
                            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف المراجعة</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكدة من حذف مراجعة{" "}
              <span className="font-semibold text-slate-900">{deleting?.author}</span> على المنتج{" "}
              <span className="font-semibold text-slate-900">{deleting?.product?.name ?? "—"}</span>؟
              سيتم إعادة حساب متوسط تقييم المنتج تلقائياً.
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

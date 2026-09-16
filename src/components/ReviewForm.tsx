"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Review } from "@/lib/types";
import { toast } from "sonner";

type Props = {
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (review: Review) => void;
};

export default function ReviewForm({
  productId,
  open,
  onOpenChange,
  onCreated,
}: Props) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reset = () => {
    setRating(5);
    setAuthor("");
    setTitle("");
    setBody("");
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (author.trim().length < 2) errs.author = "الاسم مطلوب";
    if (title.trim().length < 2) errs.title = "العنوان مطلوب";
    if (body.trim().length < 5) errs.body = "نص التقييم قصير جداً";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, author, title, body }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "فشل إرسال التقييم");
      }
      const review = await res.json();
      toast.success("شكراً على تقييمك!");
      onCreated?.(review);
      reset();
      onOpenChange(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "حدث خطأ غير متوقع";
      toast.error("تعذّر إرسال التقييم", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>اكتبي تقيماً</DialogTitle>
          <DialogDescription>
            شاركينا رأيكِ في هذا المنتج لمساعدة عميلاتنا الأخريات.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label className="mb-2 block text-sm font-bold">التقييم</Label>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => {
                const v = i + 1;
                const active = hover ? hover >= v : rating >= v;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setRating(v)}
                    onMouseEnter={() => setHover(v)}
                    onMouseLeave={() => setHover(0)}
                    className="p-1"
                    aria-label={`${v} نجوم`}
                  >
                    <Star
                      className={cn(
                        "size-7 transition",
                        active
                          ? "fill-gold text-gold"
                          : "text-muted-foreground/40"
                      )}
                    />
                  </button>
                );
              })}
              <span className="ms-2 text-sm font-bold text-foreground">
                {hover || rating}/5
              </span>
            </div>
          </div>
          <div>
            <Label htmlFor="r-author" className="text-sm font-bold">
              الاسم
            </Label>
            <Input
              id="r-author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="مثال: سارة العتيبي"
              className="mt-1.5 h-10"
            />
            {errors.author && (
              <p className="mt-1 text-xs text-destructive">{errors.author}</p>
            )}
          </div>
          <div>
            <Label htmlFor="r-title" className="text-sm font-bold">
              عنوان التقييم
            </Label>
            <Input
              id="r-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: منتج رائع ويفوق التوقعات"
              className="mt-1.5 h-10"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-destructive">{errors.title}</p>
            )}
          </div>
          <div>
            <Label htmlFor="r-body" className="text-sm font-bold">
              نص التقييم
            </Label>
            <Textarea
              id="r-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="أخبرينا عن تجربتك مع المنتج..."
              className="mt-1.5 min-h-24"
            />
            {errors.body && (
              <p className="mt-1 text-xs text-destructive">{errors.body}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-cta-gold font-bold text-primary hover:brightness-105"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> جارٍ الإرسال...
                </>
              ) : (
                "إرسال التقييم"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

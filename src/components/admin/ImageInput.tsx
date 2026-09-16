"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Link2, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
};

/**
 * Image input with three ways to set an image:
 * 1. Drag & drop a file (converts to a base64 data URL — stored in the product image field)
 * 2. Click to browse and select a file
 * 3. Paste/type a URL (e.g. /images/prod-xxx.jpg)
 *
 * Because the backend stores image as a string, we use base64 data URLs for uploaded files
 * so they persist directly in the database without needing a file upload endpoint.
 * We keep uploads small (< ~1.5MB) and warn for larger files.
 */
export default function ImageInput({
  value,
  onChange,
  label = "الصورة",
  placeholder = "/images/prod-xxx.jpg أو اسحبي صورة هنا",
  className,
}: Props) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("الرجاء اختيار ملف صورة صالح");
        return;
      }
      if (file.size > 1.5 * 1024 * 1024) {
        toast.error("حجم الصورة كبير جداً. الرجاء استخدام صورة أقل من ١.٥ ميجابايت");
        return;
      }
      setLoading(true);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        onChange(result);
        setLoading(false);
        toast.success("تم تحميل الصورة");
      };
      reader.onerror = () => {
        setLoading(false);
        toast.error("فشل تحميل الصورة");
      };
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onPaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            handleFile(file);
            e.preventDefault();
            break;
          }
        }
      }
    },
    [handleFile]
  );

  return (
    <div className={cn("space-y-2", className)} dir="rtl">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground">{label}</label>
          <div className="flex rounded-lg border border-border bg-muted/50 p-0.5">
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={cn(
                "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition",
                mode === "upload"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Upload className="size-3.5" />
              رفع
            </button>
            <button
              type="button"
              onClick={() => setMode("url")}
              className={cn(
                "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition",
                mode === "url"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Link2 className="size-3.5" />
              رابط
            </button>
          </div>
        </div>
      )}

      {mode === "upload" ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onPaste={onPaste}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition",
            dragging
              ? "border-rose-500 bg-rose-50 dark:bg-rose-950/20"
              : "border-border bg-muted/30 hover:border-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/10"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
          {loading ? (
            <>
              <Loader2 className="size-7 animate-spin text-rose-500" />
              <p className="text-xs text-muted-foreground">جارٍ التحميل...</p>
            </>
          ) : (
            <>
              <span className="grid size-11 place-items-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300">
                <Upload className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  اسحبي الصورة هنا أو انقري للاختيار
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP — حتى ١.٥ ميجابايت
                </p>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="relative">
          <Link2 className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={value.startsWith("data:") ? "" : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="h-11 w-full rounded-xl border border-border bg-background pr-10 pl-3 text-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
          />
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="relative inline-block overflow-hidden rounded-xl border border-border bg-muted">
          <Image
            src={value}
            alt="معاينة"
            width={120}
            height={120}
            unoptimized={value.startsWith("data:")}
            className="size-24 object-cover"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onChange("");
            }}
            className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-background/90 text-foreground shadow-sm transition hover:bg-destructive hover:text-white"
            aria-label="حذف الصورة"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}
      {!value && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ImageIcon className="size-3.5" />
          <span>لا توجد صورة بعد</span>
        </div>
      )}
    </div>
  );
}

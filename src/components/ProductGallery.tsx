"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  alt: string;
  discount?: number;
  className?: string;
};

export default function ProductGallery({ images, alt, discount, className }: Props) {
  const allImages = images.length > 0 ? images : ["/images/placeholder.jpg"];
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const activeImage = allImages[activeIdx] ?? allImages[0];

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Main image */}
      <div
        className="relative aspect-square overflow-hidden rounded-xl border border-border bg-card shadow-amazon"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={activeImage}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-300"
          style={
            zoom
              ? {
                  transform: "scale(1.8)",
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                }
              : undefined
          }
          priority
        />
        {discount && discount > 0 && (
          <div className="absolute right-3 top-3 rounded-md bg-destructive px-2 py-1 text-xs font-bold text-white shadow-sm">
            خصم {discount}%
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2">
          {allImages.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-md border-2 bg-muted transition",
                i === activeIdx
                  ? "border-primary shadow-rose"
                  : "border-border hover:border-primary/40"
              )}
              aria-label={`صورة ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${alt} ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
      <p className="hidden text-center text-[11px] text-muted-foreground md:block">
        مرري الماوس على الصورة للتكبير
      </p>
    </div>
  );
}

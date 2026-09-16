"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { CategoryWithCount } from "@/lib/types";

type Props = {
  category: CategoryWithCount;
  index?: number;
};

export default function CategoryCard({ category, index = 0 }: Props) {
  const count = category._count?.products ?? 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.08, 0.4) }}
    >
      <Link
        href={`?view=shop&category=${category.slug}`}
        className="group relative block aspect-square overflow-hidden rounded-3xl border border-border/60 shadow-soft"
      >
        <Image
          src={category.image || "/images/cat-makeup.jpg"}
          alt={category.name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end p-5 text-center">
          <h3 className="text-xl font-extrabold text-white drop-shadow-md">
            {category.name}
          </h3>
          <p className="mt-1 text-xs text-white/85">
            {count} منتج
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
            تسوقي الآن <ArrowLeft className="size-3.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

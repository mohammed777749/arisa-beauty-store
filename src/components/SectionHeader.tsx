"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  align?: "center" | "start";
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  viewAllHref,
  align = "center",
  className,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn(
        "mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:text-center",
        className
      )}
    >
      <div className={cn(align === "center" && "md:mx-auto md:max-w-2xl")}>
        {eyebrow && (
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-primary">
            <span className="size-1.5 rounded-full bg-gold" />
            {eyebrow}
          </span>
        )}
        <h2 className="text-2xl font-extrabold text-foreground md:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {viewAllHref && (
        <Button
          asChild
          variant="outline"
          className="shrink-0 rounded-full border-primary/40 font-bold text-primary hover:bg-primary/5"
        >
          <Link href={viewAllHref} className="flex items-center gap-2">
            عرض الكل
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
      )}
    </motion.div>
  );
}

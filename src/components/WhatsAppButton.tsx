"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";
import { whatsappLink, WHATSAPP_DEFAULT_MESSAGE } from "@/lib/brand";

/**
 * Floating WhatsApp button with a glowing pulse effect.
 * Click opens a small popup with a quick-message preset, then links to wa.me.
 * Positioned fixed at bottom-left (RTL) so it doesn't overlap the cart (right).
 */
export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3"
      dir="rtl"
    >
      {/* Quick chat popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="w-72 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-[#25D366] px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <div className="grid size-9 place-items-center rounded-full bg-white/20">
                  <MessageCircle className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">أريسا — واتساب</p>
                  <p className="text-[11px] text-white/80">عادة نرد خلال دقائق</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-7 place-items-center rounded-full bg-white/20 transition hover:bg-white/30"
                aria-label="إغلاق"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Body */}
            <div className="bg-[#ECE5DD] p-3">
              <div className="mb-2 rounded-lg rounded-tr-none bg-white p-2.5 text-xs text-foreground shadow-sm">
                مرحباً بكِ في أريسا 💕 كيف يمكننا مساعدتكِ اليوم؟
              </div>
              <p className="mb-2 text-[11px] font-semibold text-foreground/70">
                اختاري رسالة سريعة:
              </p>
              <div className="space-y-1.5">
                {[
                  "أرغب في حجز موعد لخدمة تجميل",
                  "أريد الاستفسار عن المنتجات المتوفرة",
                  "ما هي أسعار تجهيز العرايس؟",
                  "هل لديكم خدمة التوصيل؟",
                ].map((msg) => (
                  <a
                    key={msg}
                    href={whatsappLink(msg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg bg-white px-3 py-2 text-[11px] text-foreground shadow-sm transition hover:bg-[#25D366] hover:text-white"
                  >
                    {msg}
                  </a>
                ))}
              </div>
            </div>

            {/* Footer — direct chat */}
            <a
              href={whatsappLink(WHATSAPP_DEFAULT_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 bg-[#25D366] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#1da851]"
            >
              <MessageCircle className="size-4" />
              ابدئي المحادثة الآن
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The glowing floating button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="تواصلي عبر واتساب"
        title="تواصلي عبر واتساب"
        className="group relative grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-110"
      >
        {/* Pulsing glow rings */}
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />
        <span
          className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 blur-md"
          style={{ animation: "wa-glow 2s ease-in-out infinite" }}
        />
        {/* Glow style */}
        <style>{`
          @keyframes wa-glow {
            0%, 100% { transform: scale(1); opacity: 0.4; }
            50% { transform: scale(1.35); opacity: 0.15; }
          }
        `}</style>
        <MessageCircle className="relative size-7 fill-white" />
        {/* Notification dot */}
        <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
          1
        </span>
      </button>
    </div>
  );
}

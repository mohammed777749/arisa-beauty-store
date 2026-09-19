"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Eye, EyeOff, Lock, ArrowLeft, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuth } from "@/store/admin-auth";
import { toast } from "sonner";

export default function AdminLogin() {
  const login = useAdminAuth((s) => s.login);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("الرجاء إدخال كلمة السر");
      return;
    }
    setLoading(true);
    // Small delay for UX
    setTimeout(() => {
      const ok = login(password);
      if (ok) {
        toast.success("مرحباً بكِ في لوحة التحكم");
      } else {
        toast.error("كلمة السر غير صحيحة");
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 p-4"
      dir="rtl"
    >
      {/* Decorative blobs */}
      <div className="absolute -right-20 -top-20 size-72 rounded-full bg-rose-500/20 blur-3xl" />
      <div className="absolute -left-20 -bottom-20 size-80 rounded-full bg-amber-500/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-3xl border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur-xl">
          {/* Brand */}
          <div className="flex flex-col items-center text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 shadow-lg shadow-rose-900/30">
              <Sparkles className="size-8 text-white" />
            </div>
            <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
              لوحة تحكم أريسا
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              الرجاء إدخال كلمة السر للمتابعة
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-sm font-semibold text-slate-700">
                كلمة السر
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 rounded-xl border-slate-200 bg-slate-50 pr-10 pl-10 text-slate-900 focus-visible:ring-rose-500"
                  autoComplete="current-password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-rose-600"
                  aria-label={showPassword ? "إخفاء كلمة السر" : "إظهار كلمة السر"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-gradient-to-l from-rose-600 to-rose-500 text-base font-bold text-white shadow-lg shadow-rose-500/30 transition hover:from-rose-700 hover:to-rose-600 disabled:opacity-60"
            >
              {loading ? "جارٍ التحقق..." : "تسجيل الدخول"}
            </Button>
          </form>

          {/* Hint + back to store */}
          <div className="mt-6 space-y-3 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
              <KeyRound className="size-3.5 shrink-0" />
              <span>
                كلمة السر الافتراضية: <code className="font-bold">admin1234</code>
                <br />
                يمكنكِ تغييرها من داخل لوحة التحكم.
              </span>
            </div>
            <a
              href="?view=home"
              className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500 transition hover:text-rose-600"
            >
              <ArrowLeft className="size-3.5" />
              العودة إلى المتجر
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

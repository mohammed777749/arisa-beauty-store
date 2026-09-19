"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  ArrowLeft,
  ShoppingBag,
  Truck,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomerAuth } from "@/store/customer-auth";
import { useCart } from "@/store/cart";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Mode = "login" | "register";

export default function AuthView() {
  const router = useRouter();
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const register = useCustomerAuth((s) => s.register);
  const login = useCustomerAuth((s) => s.login);
  const isAuthenticated = useCustomerAuth((s) => s.isAuthenticated);
  const hasHydrated = useCustomerAuth((s) => s.hasHydrated);
  const cartCount = useCart((s) => s.getTotalItems());

  const [mode, setMode] = useState<Mode>(
    searchParams?.get("mode") === "register" ? "register" : "login"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect home
  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      router.push("?view=home");
    }
  }, [hasHydrated, isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (mode === "register") {
        const res = register({ name, email, phone, password });
        if (res.ok) {
          toast.success("تم إنشاء حسابك بنجاح! مرحباً بكِ في أريسا");
          router.push("?view=home");
        } else {
          toast.error(res.error ?? "فشل التسجيل");
        }
      } else {
        const res = login(email, password);
        if (res.ok) {
          toast.success("مرحباً بعودتكِ إلى أريسا");
          // Go back to where they came from, or home
          const dest = cartCount > 0 ? "?view=cart" : "?view=home";
          router.push(dest);
        } else {
          toast.error(res.error ?? "فشل تسجيل الدخول");
        }
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div
      className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-gradient-to-br from-rose-50 via-background to-amber-50 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-rose-950"
      dir="rtl"
    >
      {/* Decorative blobs */}
      <div className="absolute -right-20 -top-20 size-72 rounded-full bg-rose-200/40 blur-3xl dark:bg-rose-500/10" />
      <div className="absolute -left-20 -bottom-20 size-80 rounded-full bg-amber-200/30 blur-3xl dark:bg-amber-500/10" />

      <div className="relative grid w-full max-w-5xl gap-8 lg:grid-cols-2">
        {/* Left: branding / value props */}
        <div className="hidden flex-col justify-center lg:flex">
          <div className="flex items-center gap-3">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 shadow-lg shadow-rose-500/30">
              <Sparkles className="size-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-rose-700 dark:text-rose-300">
                أريسا
              </h2>
              <p className="text-xs text-muted-foreground">BEAUTY SALON</p>
            </div>
          </div>
          <h1 className="mt-6 text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
            انضمي إلى عائلة أريسا
          </h1>
          <p className="mt-3 text-muted-foreground">
            أنشئي حسابكِ لتتبعي طلباتكِ، احفظي عناوينكِ، وتسوقي بسهولة وسرعة.
          </p>
          <div className="mt-8 space-y-4">
            {[
              { icon: ShoppingBag, t: "تسوقي أسرع", d: "حفظ السلة والقائمة وحفظ بياناتك" },
              { icon: Truck, t: "تتبعي طلباتكِ", d: "اعرفي حالة طلبكِ في أي وقت" },
              { icon: ShieldCheck, t: "دفع آمن", d: "حماية كاملة لبياناتكِ ومدفوعاتكِ" },
            ].map((v) => (
              <div key={v.t} className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300">
                  <v.icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground">{v.t}</p>
                  <p className="text-xs text-muted-foreground">{v.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-border/60 bg-card p-8 shadow-xl"
        >
          {/* Mode tabs */}
          <div className="mb-6 flex rounded-xl bg-muted p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-lg py-2 text-sm font-bold transition ${
                mode === "login"
                  ? "bg-background text-rose-700 shadow-sm dark:text-rose-300"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 rounded-lg py-2 text-sm font-bold transition ${
                mode === "register"
                  ? "bg-background text-rose-700 shadow-sm dark:text-rose-300"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              حساب جديد
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-extrabold text-foreground">
                {mode === "login" ? "أهلاً بعودتكِ 👋" : "أنشئي حسابكِ الآن"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode === "login"
                  ? "سجّلي الدخول لمتابعة التسوق"
                  : "بياناتكِ آمنة معنا — يستغرق التسجيل ثوانٍ"}
              </p>

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {mode === "register" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="auth-name" className="text-xs font-semibold">
                      الاسم الكامل
                    </Label>
                    <div className="relative">
                      <User className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="auth-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="سارة المطيري"
                        className="h-11 pr-9"
                        autoComplete="name"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="auth-email" className="text-xs font-semibold">
                    البريد الإلكتروني
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="auth-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sara@example.com"
                      className="h-11 pr-9"
                      autoComplete="email"
                      dir="ltr"
                    />
                  </div>
                </div>

                {mode === "register" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="auth-phone" className="text-xs font-semibold">
                      رقم الجوال
                    </Label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="auth-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0551234567"
                        className="h-11 pr-9"
                        autoComplete="tel"
                        dir="ltr"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="auth-password" className="text-xs font-semibold">
                    كلمة السر
                  </Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="auth-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-11 pr-9 pl-9"
                      autoComplete={
                        mode === "login" ? "current-password" : "new-password"
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition hover:text-rose-600"
                      tabIndex={-1}
                      aria-label={showPassword ? "إخفاء كلمة السر" : "إظهار كلمة السر"}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {mode === "register" && (
                    <p className="text-[11px] text-muted-foreground">
                      ٦ أحرف على الأقل
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-xl bg-gradient-to-l from-rose-600 to-rose-500 text-base font-bold text-white shadow-lg shadow-rose-500/30 transition hover:from-rose-700 hover:to-rose-600 disabled:opacity-60"
                >
                  {loading
                    ? "جارٍ المعالجة..."
                    : mode === "login"
                    ? "تسجيل الدخول"
                    : "إنشاء الحساب"}
                </Button>
              </form>

              <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                <span>بياناتكِ محفوظة محلياً وآمنة على جهازكِ</span>
              </div>

              <a
                href="?view=home"
                className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground transition hover:text-rose-600"
              >
                <ArrowLeft className="size-3.5" />
                متابعة كزائرة
              </a>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

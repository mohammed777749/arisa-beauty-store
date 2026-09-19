"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, KeyRound, RotateCcw, LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuth, DEFAULT_PASSWORD } from "@/store/admin-auth";
import { toast } from "sonner";
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

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export default function ChangePasswordDialog({ open, onOpenChange }: Props) {
  const changePassword = useAdminAuth((s) => s.changePassword);
  const resetPassword = useAdminAuth((s) => s.resetPassword);
  const logout = useAdminAuth((s) => s.logout);

  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPw || !newPw || !confirmPw) {
      toast.error("الرجاء تعبئة جميع الحقول");
      return;
    }
    if (newPw.length < 6) {
      toast.error("كلمة السر الجديدة يجب أن تكون ٦ أحرف على الأقل");
      return;
    }
    if (newPw !== confirmPw) {
      toast.error("كلمة السر الجديدة وتأكيدها غير متطابقتين");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const ok = changePassword(oldPw, newPw);
      setLoading(false);
      if (ok) {
        toast.success("تم تغيير كلمة السر بنجاح");
        onOpenChange(false);
      } else {
        toast.error("كلمة السر الحالية غير صحيحة");
      }
    }, 300);
  };

  const handleReset = () => {
    resetPassword();
    setResetConfirmOpen(false);
    setResetDone(true);
    toast.success(`تمت إعادة تعيين كلمة السر إلى: ${DEFAULT_PASSWORD}`);
    // Log out so the admin must log in with the new default password
    setTimeout(() => {
      logout();
      onOpenChange(false);
    }, 1500);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-rose-100">
              <KeyRound className="size-5 text-rose-600" />
            </div>
            <DialogTitle>تغيير كلمة السر</DialogTitle>
            <DialogDescription>
              أدخلي كلمة السر الحالية وكلمة السر الجديدة. كلمة السر الجديدة يجب أن تكون ٦ أحرف على الأقل.
            </DialogDescription>
          </DialogHeader>

          {resetDone ? (
            <div className="rounded-lg bg-emerald-50 p-4 text-center text-sm text-emerald-700">
              تمت إعادة تعيين كلمة السر إلى{" "}
              <code className="font-bold">{DEFAULT_PASSWORD}</code>.
              <br />
              جارٍ تسجيل الخروج...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Current password */}
              <div className="space-y-1.5">
                <Label htmlFor="cur-pw" className="text-xs font-semibold">
                  كلمة السر الحالية
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="cur-pw"
                    type={showOld ? "text" : "password"}
                    value={oldPw}
                    onChange={(e) => setOldPw(e.target.value)}
                    className="h-10 pr-9 pl-9"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld((v) => !v)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-rose-600"
                    tabIndex={-1}
                    aria-label="إظهار/إخفاء"
                  >
                    {showOld ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div className="space-y-1.5">
                <Label htmlFor="new-pw" className="text-xs font-semibold">
                  كلمة السر الجديدة
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="new-pw"
                    type={showNew ? "text" : "password"}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    className="h-10 pr-9 pl-9"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-rose-600"
                    tabIndex={-1}
                    aria-label="إظهار/إخفاء"
                  >
                    {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm */}
              <div className="space-y-1.5">
                <Label htmlFor="conf-pw" className="text-xs font-semibold">
                  تأكيد كلمة السر الجديدة
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="conf-pw"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    className="h-10 pr-9 pl-9"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-rose-600"
                    tabIndex={-1}
                    aria-label="إظهار/إخفاء"
                  >
                    {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <DialogFooter className="flex-row gap-2 sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setResetConfirmOpen(true)}
                  className="text-xs text-slate-500 hover:text-rose-600"
                >
                  <RotateCcw className="size-3.5" />
                  نسيت كلمة السر؟ إعادة التعيين
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    إلغاء
                  </Button>
                  <Button type="submit" disabled={loading} className="bg-rose-600 hover:bg-rose-700">
                    {loading ? "جارٍ الحفظ..." : "حفظ"}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Reset confirm */}
      <AlertDialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>إعادة تعيين كلمة السر؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم إعادة تعيين كلمة السر إلى الافتراضية{" "}
              <code className="font-bold">{DEFAULT_PASSWORD}</code>. سيتم تسجيل خروجك ويجب
              عليكِ تسجيل الدخول مجدداً بكلمة السر الافتراضية.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              className="bg-rose-600 hover:bg-rose-700"
            >
              <LogOut className="size-4" />
              نعم، أعد التعيين
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

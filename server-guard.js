/**
 * server-guard.js — غلاف حماية لسيرفر الإنتاج (standalone)
 *
 * يُضاف معالجات للأخطاء غير المعالجة لمنع تعطل السيرفر،
 * ثم يُحمّل سيرفر Next.js المستقل.
 *
 * الاستخدام (في ecosystem.config.js بدل .next/standalone/server.js):
 *   script: "server-guard.js"
 *
 * ملاحظة: هذا الملف للاستخدام في الإنتاج فقط بعد `bun run build`.
 */

// منع تعطل السيرفر من الأخطاء غير المعالجة
process.on("uncaughtException", (err) => {
  console.error("⚠️  Uncaught Exception:", err);
  // لا نوقف العملية — نسجّل الخطأ فقط
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️  Unhandled Rejection at:", promise, "reason:", reason);
});

// إعادة التشغيل بأمان عند إشارة SIGTERM
process.on("SIGTERM", () => {
  console.log("📩 SIGTERM received, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("📩 SIGINT received, shutting down gracefully...");
  process.exit(0);
});

// تحديد المنفذ والمضيف
process.env.PORT = process.env.PORT || "3000";
process.env.HOSTNAME = process.env.HOSTNAME || "0.0.0.0";

// تحميل سيرفر Next.js المستقل
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("./.next/standalone/server.js");
} catch (err) {
  console.error("❌ Failed to start standalone server:", err);
  console.error("   تأكدي من تشغيل `bun run build` أولاً.");
  process.exit(1);
}

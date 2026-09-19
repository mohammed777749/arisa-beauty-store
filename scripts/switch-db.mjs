#!/usr/bin/env node
/**
 * switch-db.mjs
 * يبدّل مزود قاعدة بيانات Prisma بين SQLite (محلي) و PostgreSQL (Vercel).
 *
 * الاستخدام:
 *   node scripts/switch-db.mjs sqlite   # بيئة محلية (افتراضي)
 *   node scripts/switch-db.mjs pg       # Vercel / إنتاج
 *
 * يعمل بنسخ المخطط المناسب إلى prisma/schema.prisma ثم تشغيل prisma generate.
 */
import { copyFileSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const target = join(root, "prisma", "schema.prisma");
const sqliteSrc = join(root, "prisma", "schema.sqlite.prisma");
const pgSrc = join(root, "prisma", "schema.pg.prisma");

const mode = process.argv[2] ?? "sqlite";

if (mode === "pg") {
  if (!existsSync(pgSrc)) {
    console.error("❌ ملف schema.pg.prisma غير موجود");
    process.exit(1);
  }
  copyFileSync(pgSrc, target);
  console.log("✅ تم التبديل إلى PostgreSQL (Vercel/إنتاج)");
} else {
  if (!existsSync(sqliteSrc)) {
    // إذا لم يوجد ملف SQLite منفصل، احفظ الحالي كنسخة SQLite
    const current = readFileSync(target, "utf8");
    if (current.includes('provider = "postgresql"')) {
      console.error("❌ المخطط الحالي PostgreSQL. لا توجد نسخة SQLite.");
      process.exit(1);
    }
    writeFileSync(sqliteSrc, current);
    console.log("✅ تم حفظ نسخة SQLite");
  } else {
    copyFileSync(sqliteSrc, target);
    console.log("✅ تم التبديل إلى SQLite (محلي)");
  }
}

// إعادة توليد عميل Prisma
try {
  execSync("bun run db:generate", { cwd: root, stdio: "inherit" });
} catch {
  try {
    execSync("npx prisma generate", { cwd: root, stdio: "inherit" });
  } catch {
    console.error("⚠️ فشل prisma generate — تأكدي من تثبيت Prisma");
  }
}

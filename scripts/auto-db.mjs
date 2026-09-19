#!/usr/bin/env node
/**
 * auto-db.mjs — تهيئة قاعدة البيانات تلقائياً (محلي + Vercel)
 *
 * هذا السكريبت يُشغّل تلقائياً في مرحلة البناء على Vercel (vercel-build)
 * وفي postinstall. يقوم بـ:
 *
 *  ١. اكتشاف نوع قاعدة البيانات من DATABASE_URL (sqlite/postgresql/mysql)
 *  ٢. تبديل مخطط Prisma إلى المزود المناسب
 *  ٣. تشغيل prisma generate
 *  ٤. دفع المخطط إلى قاعدة البيانات (db push) — ينشئ الجداول
 *  ٥. تهيئة البيانات الأولية (seed) — فقط إذا كانت قاعدة البيانات فارغة
 *
 * آمن للتشغيل المتكرر (idempotent): لا يكسر البيانات الموجودة.
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const schemaPath = join(root, "prisma", "schema.prisma");
const sqliteSchema = join(root, "prisma", "schema.sqlite.prisma");
const pgSchema = join(root, "prisma", "schema.pg.prisma");

const log = (msg) => console.log(`[auto-db] ${msg}`);
const warn = (msg) => console.warn(`[auto-db] ⚠️  ${msg}`);

// --- ١. اكتشاف نوع قاعدة البيانات ---
const dbUrl = process.env.DATABASE_URL ?? "";
if (!dbUrl) {
  log("DATABASE_URL غير مضبوط — تخطي التهيئة التلقائية.");
  process.exit(0);
}

let provider = "sqlite";
if (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://")) {
  provider = "postgresql";
} else if (dbUrl.startsWith("mysql://")) {
  provider = "mysql";
} else if (dbUrl.startsWith("file:")) {
  provider = "sqlite";
}

log(`نوع قاعدة البيانات المكتشف: ${provider}`);

// --- ٢. تبديل المخطط ---
function setProvider(prov) {
  // اقرأ المخطط الحالي
  let schema = readFileSync(schemaPath, "utf8");
  // استبدل سطر provider داخل datasource block فقط
  schema = schema.replace(
    /datasource db \{[\s\S]*?provider\s*=\s*"(sqlite|postgresql|mysql)"[\s\S]*?\}/,
    (match) =>
      match.replace(
        /provider\s*=\s*"(sqlite|postgresql|mysql)"/,
        `provider = "${prov}"`
      )
  );
  writeFileSync(schemaPath, schema);
}

// استخدم ملفات المخطط المنفصلة إن وُجدت، وإلا عدّلي المخطط الحالي
if (provider === "postgresql" && existsSync(pgSchema)) {
  copyFileSync(pgSchema, schemaPath);
  log("تم استخدام مخطط PostgreSQL");
} else if (provider === "sqlite" && existsSync(sqliteSchema)) {
  copyFileSync(sqliteSchema, schemaPath);
  log("تم استخدام مخطط SQLite");
} else {
  setProvider(provider);
  log(`تم ضبط المزود في المخطط إلى: ${provider}`);
}

// --- ٣. prisma generate ---
try {
  log("تشغيل prisma generate...");
  execSync("npx prisma generate", { cwd: root, stdio: "inherit" });
} catch {
  warn("فشل prisma generate — قد تحتاجين لتشغيله يدوياً");
}

// --- ٤. دفع المخطط (db push) ---
// فقط إذا لم نكن في مرحلة التثبيت (postinstall) — نريد db push في البناء فقط
const isBuildPhase =
  process.env.VERCEL === "1" || process.env.RUN_DB_PUSH === "1" || process.argv.includes("--push");

if (isBuildPhase) {
  try {
    log("دفع المخطط إلى قاعدة البيانات (db push)...");
    execSync("npx prisma db push --accept-data-loss", {
      cwd: root,
      stdio: "inherit",
    });
    log("✅ تم دفع المخطط بنجاح");
  } catch (e) {
    warn("فشل db push — تأكدي من أن DATABASE_URL صحيح وقاعدة البيانات متاحة");
    warn(String(e.message ?? e).split("\n").slice(0, 3).join("\n"));
    // لا نوقف البناء — قد تكون قاعدة البيانات مهيّأة بالفعل
  }

  // --- ٥. تهيئة البيانات الأولية تلقائياً (seed) ---
  // نشغّل السكريبت دائماً — هو idempotent (يمسح ويعيد الإدراج)
  // لكن فقط في بيئة Vercel أو عند تمرير --seed
  const shouldSeed =
    process.env.VERCEL === "1" ||
    process.argv.includes("--seed") ||
    process.env.AUTO_SEED === "1";

  if (shouldSeed) {
    try {
      log("تهيئة البيانات الأولية (seed)...");
      const seedScript = join(root, "prisma", "seed.ts");
      // جرّبي عدة طرق بالترتيب: tsx (الأفضل مع TS) → bun → node strip-types
      const attempts = [
        `npx --yes tsx "${seedScript}"`,
        `bun run "${seedScript}"`,
        `node --experimental-strip-types "${seedScript}"`,
      ];
      let seeded = false;
      for (const cmd of attempts) {
        try {
          execSync(cmd, {
            cwd: root,
            stdio: "inherit",
            env: { ...process.env },
            timeout: 90000,
          });
          seeded = true;
          break;
        } catch {
          // جرّبي الطريقة التالية
        }
      }
      if (seeded) {
        log("✅ تمت التهيئة التلقائية للبيانات");
      } else {
        warn("فشلت كل طرق التهيئة — يمكن تشغيلها يدوياً: bun run db:seed");
      }
    } catch (e) {
      warn("فشل التهيئة التلقائية للبيانات — يمكن تشغيلها يدوياً: bun run db:seed");
      warn(String(e.message ?? e).split("\n").slice(0, 3).join("\n"));
      // لا نوقف البناء
    }
  } else {
    log("تخطي seed (استخدمي --seed أو VERCEL=1 لتفعيله)");
  }
} else {
  log("تخطي db push (استخدمي --push أو متغير VERCEL=1 لتفعيله)");
}

log("✅ اكتملت التهيئة التلقائية لقاعدة البيانات");
